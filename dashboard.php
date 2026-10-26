<?php
require_once __DIR__ . '/src/Auth.php';
$user = Auth::requireAuth();
$pdo = Database::getConnection();

// Process Withdrawal Request POST
$withdrawMsg = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'withdraw') {
    $amount = (float)($_POST['amount'] ?? 0);
    $method = $_POST['method'] ?? 'UPI';
    $details = trim($_POST['details'] ?? '');

    if ($amount <= 0 || $amount > $user['wallet_balance']) {
        $withdrawMsg = ['type' => 'error', 'text' => 'Invalid withdrawal amount or insufficient balance.'];
    } elseif (empty($details)) {
        $withdrawMsg = ['type' => 'error', 'text' => 'Please provide your payout account details.'];
    } else {
        $pdo->beginTransaction();
        try {
            $update = $pdo->prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ? AND wallet_balance >= ?");
            $update->execute([$amount, $user['id'], $amount]);

            if ($update->rowCount() === 0) {
                throw new Exception("Withdrawal failed due to insufficient balance.");
            }

            $txId = "TX-WD-" . uniqid();
            $desc = "Withdrawal payout via {$method} to {$details}";
            $insertTx = $pdo->prepare("
                INSERT INTO transactions (id, user_id, type, amount, description)
                VALUES (?, ?, 'WITHDRAWAL', ?, ?)
            ");
            $insertTx->execute([$txId, $user['id'], -$amount, $desc]);

            $pdo->commit();
            $withdrawMsg = ['type' => 'success', 'text' => "Withdrawal request of ₹" . number_format($amount) . " submitted successfully!"];

            // Refresh user model
            $uStmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $uStmt->execute([$user['id']]);
            $user = $uStmt->fetch();
        } catch (Exception $e) {
            $pdo->rollBack();
            $withdrawMsg = ['type' => 'error', 'text' => $e->getMessage()];
        }
    }
}

// Fetch User Orders
$ordersStmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
$ordersStmt->execute([$user['id']]);
$orders = $ordersStmt->fetchAll();

// Fetch Transactions
$filterType = $_GET['filter'] ?? 'ALL';
$txSql = "SELECT * FROM transactions WHERE user_id = ?";
$params = [$user['id']];
if (in_array($filterType, ['DIRECT_REFERRAL', 'MATRIX_LEVEL', 'WITHDRAWAL'])) {
    $txSql .= " AND type = ?";
    $params[] = $filterType;
}
$txSql .= " ORDER BY created_at DESC";
$txStmt = $pdo->prepare($txSql);
$txStmt->execute($params);
$transactions = $txStmt->fetchAll();

// Fetch All Transactions for Metrics Calculation
$allTxStmt = $pdo->prepare("SELECT * FROM transactions WHERE user_id = ?");
$allTxStmt->execute([$user['id']]);
$allTransactions = $allTxStmt->fetchAll();

$directEarnings = 0;
$matrixEarnings = 0;
$totalWithdrawn = 0;
foreach ($allTransactions as $tx) {
    if ($tx['type'] === 'DIRECT_REFERRAL') $directEarnings += (float)$tx['amount'];
    if ($tx['type'] === 'MATRIX_LEVEL') $matrixEarnings += (float)$tx['amount'];
    if ($tx['type'] === 'WITHDRAWAL') $totalWithdrawn += abs((float)$tx['amount']);
}

// Fetch Matrix Children
$childStmt = $pdo->prepare("SELECT * FROM users WHERE parent_id = ? ORDER BY position ASC");
$childStmt->execute([$user['id']]);
$matrixChildren = $childStmt->fetchAll();

// Fetch Direct Recruits
$recruitStmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE sponsor_id = ?");
$recruitStmt->execute([$user['id']]);
$directCount = (int)$recruitStmt->fetchColumn();

// CSV Export Trigger
if (isset($_GET['export']) && $_GET['export'] === 'csv') {
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="payout_report_' . $user['id'] . '.csv"');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['Transaction ID', 'Type', 'Amount (INR)', 'Description', 'Date']);
    foreach ($transactions as $tx) {
        fputcsv($output, [$tx['id'], $tx['type'], $tx['amount'], $tx['description'], $tx['created_at']]);
    }
    fclose($output);
    exit();
}

$pageTitle = "Distributor Dashboard | Orbit Nutrition";
require_once __DIR__ . '/includes/header.php';
?>

<div class="flex flex-col lg:flex-row min-h-[85vh]">
    <?php require_once __DIR__ . '/includes/sidebar.php'; ?>

    <div class="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">

        <!-- Header Banner -->
        <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900/90 via-slate-900 to-slate-950">
            <div class="space-y-2">
                <div class="flex items-center space-x-3">
                    <span class="px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs border border-cyan-500/40">
                        ID: <?= htmlspecialchars($user['id']) ?>
                    </span>
                    <span class="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs border border-emerald-500/40">
                        Active Member
                    </span>
                </div>
                <h1 class="text-3xl font-extrabold text-white">Welcome, <?= htmlspecialchars($user['name']) ?></h1>
                <p class="text-slate-400 text-xs sm:text-sm font-mono">
                    Sponsor ID: <strong class="text-cyan-400"><?= htmlspecialchars($user['sponsor_id'] ?: 'None') ?></strong> • Matrix Parent: <strong class="text-cyan-300"><?= htmlspecialchars($user['parent_id'] ?: 'Root Node') ?></strong>
                </p>
            </div>

            <!-- Referral Link Card with Social Sharing -->
            <?php
            $sponsorLink = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://{$_SERVER['HTTP_HOST']}/register.php?sponsor={$user['id']}";
            ?>
            <div class="w-full md:w-auto glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
                <span class="text-xs font-mono text-slate-400 uppercase tracking-wider block">Your Personal Referral Link</span>
                <div class="flex flex-wrap items-center gap-2">
                    <input
                        type="text"
                        readonly
                        id="refLink"
                        value="<?= htmlspecialchars($sponsorLink) ?>"
                        class="px-3 py-1.5 rounded-lg bg-slate-950 text-cyan-400 font-mono text-xs border border-slate-800 w-full sm:w-64 focus:outline-none"
                    />
                    <button
                        onclick="navigator.clipboard.writeText(document.getElementById('refLink').value); alert('Referral link copied!');"
                        class="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-bold flex items-center justify-center"
                        title="Copy link"
                    >
                        <i data-lucide="copy" class="w-4 h-4"></i>
                    </button>

                    <!-- WhatsApp Share -->
                    <a
                        href="https://api.whatsapp.com/send?text=<?= urlencode("Join Orbit Nutrition Direct Selling 10-Matrix Plan using my sponsor ID: {$user['id']}!\nRegister here: {$sponsorLink}") ?>"
                        target="_blank"
                        class="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all font-bold flex items-center justify-center"
                        title="Share via WhatsApp"
                    >
                        <i data-lucide="message-circle" class="w-4 h-4"></i>
                    </a>

                    <!-- Telegram Share -->
                    <a
                        href="https://t.me/share/url?url=<?= urlencode($sponsorLink) ?>&text=<?= urlencode("Join Orbit Nutrition 10-Matrix Plan with Sponsor ID {$user['id']}") ?>"
                        target="_blank"
                        class="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-all font-bold flex items-center justify-center"
                        title="Share via Telegram"
                    >
                        <i data-lucide="send" class="w-4 h-4"></i>
                    </a>

                    <!-- Web Share API -->
                    <button
                        onclick="if(navigator.share) { navigator.share({title:'Orbit Nutrition', text:'Join 10-Matrix Plan with my Sponsor ID: <?= $user['id'] ?>', url:'<?= $sponsorLink ?>'}); } else { alert('Copy link: <?= $sponsorLink ?>'); }"
                        class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all font-bold flex items-center justify-center"
                        title="Device Share"
                    >
                        <i data-lucide="share-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Metrics Cards Grid -->
        <div id="wallet" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <!-- Wallet Card -->
            <div class="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-500/70 transition-all space-y-4">
                <div class="flex justify-between items-center text-slate-400">
                    <span class="text-xs font-mono uppercase font-bold text-emerald-400">Available Wallet</span>
                    <i data-lucide="wallet" class="w-5 h-5 text-emerald-400"></i>
                </div>
                <div>
                    <p class="text-3xl font-black text-emerald-400 font-mono">₹<?= number_format($user['wallet_balance'], 2) ?></p>
                    <p class="text-[11px] text-slate-400 mt-0.5">Instant direct & level commissions</p>
                </div>
                <button
                    onclick="document.getElementById('withdrawModal').classList.remove('hidden')"
                    class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-neon transition-all"
                >
                    <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
                    <span>Withdraw Earnings</span>
                </button>
            </div>

            <!-- Matrix Level Card -->
            <div class="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-3">
                <div class="flex justify-between items-center text-slate-400">
                    <span class="text-xs font-mono uppercase">Matrix Tier Level</span>
                    <i data-lucide="layers" class="w-5 h-5 text-cyan-400"></i>
                </div>
                <p class="text-3xl font-black text-cyan-400 font-mono">Level <?= $user['matrix_level'] ?></p>
                <p class="text-[11px] text-slate-400 font-mono">BFS Sequence: #<?= $user['bfs_sequence'] ?></p>
            </div>

            <!-- Direct Sponsors Card -->
            <div class="glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-3">
                <div class="flex justify-between items-center text-slate-400">
                    <span class="text-xs font-mono uppercase">Direct Sponsors</span>
                    <i data-lucide="user-plus" class="w-5 h-5 text-amber-400"></i>
                </div>
                <p class="text-3xl font-black text-amber-400 font-mono"><?= $directCount ?></p>
                <p class="text-[11px] text-slate-400 font-mono">Earned ₹<?= number_format($directEarnings) ?> referral bonus</p>
            </div>

            <!-- Fulfillment Status Card -->
            <div class="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-3">
                <div class="flex justify-between items-center text-slate-400">
                    <span class="text-xs font-mono uppercase">Protein Kit Order</span>
                    <i data-lucide="package" class="w-5 h-5 text-cyan-400"></i>
                </div>
                <p class="text-2xl font-black text-cyan-300 font-mono capitalize">
                    <?= htmlspecialchars($orders[0]['fulfillment_status'] ?? 'Processing') ?>
                </p>
                <p class="text-[11px] text-slate-400 font-mono truncate">
                    Flavor: <?= htmlspecialchars($orders[0]['flavor'] ?? $user['flavor_preference']) ?>
                </p>
            </div>

        </div>

        <!-- Financial Summary Bar -->
        <div class="glass-panel p-6 rounded-3xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
            <div class="flex items-center space-x-4 border-b sm:border-b-0 sm:border-r border-slate-800 pb-4 sm:pb-0 sm:pr-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <i data-lucide="arrow-down-right" class="w-5 h-5"></i>
                </div>
                <div>
                    <span class="text-slate-400 block text-[10px] uppercase">Direct Referral Bonus</span>
                    <span class="text-lg font-bold text-emerald-400">₹<?= number_format($directEarnings) ?></span>
                </div>
            </div>

            <div class="flex items-center space-x-4 border-b sm:border-b-0 sm:border-r border-slate-800 pb-4 sm:pb-0 sm:pr-4">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <i data-lucide="layers" class="w-5 h-5"></i>
                </div>
                <div>
                    <span class="text-slate-400 block text-[10px] uppercase">10-Matrix Level Bonus</span>
                    <span class="text-lg font-bold text-cyan-400">₹<?= number_format($matrixEarnings) ?></span>
                </div>
            </div>

            <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <i data-lucide="clock" class="w-5 h-5"></i>
                </div>
                <div>
                    <span class="text-slate-400 block text-[10px] uppercase">Total Payouts Settled</span>
                    <span class="text-lg font-bold text-amber-400">₹<?= number_format($totalWithdrawn) ?></span>
                </div>
            </div>
        </div>

        <!-- Main Dashboard Content Split -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

            <!-- Left Column: Matrix Downline Tree & Fulfillment -->
            <div class="lg:col-span-7 space-y-8">

                <!-- 10-Matrix Tree Panel -->
                <div id="matrix" class="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <h3 class="text-xl font-bold text-white flex items-center space-x-2">
                                <i data-lucide="layers" class="w-5 h-5 text-cyan-400"></i>
                                <span>Your 10-Matrix Downline Tree</span>
                            </h3>
                            <p class="text-xs text-slate-400 mt-1">Directly assigned matrix children (Max 10 per node)</p>
                        </div>
                        <span class="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold">
                            <?= count($matrixChildren) ?> / 10 Capacity
                        </span>
                    </div>

                    <div class="space-y-4 font-mono">
                        <div class="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-xs">
                                    YOU
                                </div>
                                <div>
                                    <span class="text-white font-bold block text-sm"><?= htmlspecialchars($user['name']) ?> (<?= $user['id'] ?>)</span>
                                    <span class="text-slate-400 text-xs">Level <?= $user['matrix_level'] ?> • Position #<?= $user['position'] ?></span>
                                </div>
                            </div>
                        </div>

                        <?php if (empty($matrixChildren)): ?>
                            <div class="text-center py-8 px-4 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs space-y-2">
                                <p>No matrix children assigned under your node yet.</p>
                                <p class="text-cyan-400">Company-wide BFS auto-spillover will populate this tier automatically!</p>
                            </div>
                        <?php else: ?>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l-2 border-cyan-500/30">
                                <?php foreach ($matrixChildren as $child): ?>
                                    <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                                        <div class="flex justify-between items-center">
                                            <span class="text-cyan-400 font-bold"><?= $child['id'] ?></span>
                                            <span class="text-slate-500 text-[10px]">Pos #<?= $child['position'] ?></span>
                                        </div>
                                        <div class="text-slate-200 font-semibold truncate"><?= htmlspecialchars($child['name']) ?></div>
                                        <div class="text-slate-400 text-[10px]">Level <?= $child['matrix_level'] ?></div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Product Fulfillment Panel -->
                <div id="fulfillment" class="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                    <h3 class="text-xl font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-4">
                        <i data-lucide="truck" class="w-5 h-5 text-cyan-400"></i>
                        <span>1kg Whey Protein Fulfillment Status</span>
                    </h3>

                    <?php foreach ($orders as $ord): ?>
                        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
                            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                                <span class="text-slate-400">Order ID: <strong class="text-slate-200"><?= $ord['id'] ?></strong></span>
                                <span class="px-3 py-1 rounded-full font-bold uppercase text-[10px] <?= $ord['fulfillment_status'] === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' ?>">
                                    • <?= $ord['fulfillment_status'] ?>
                                </span>
                            </div>

                            <div class="grid grid-cols-2 gap-4 text-slate-300">
                                <div>
                                    <span class="text-slate-500 block">Package:</span>
                                    <span class="font-bold text-white"><?= htmlspecialchars($ord['package_name']) ?></span>
                                </div>
                                <div>
                                    <span class="text-slate-500 block">Flavor:</span>
                                    <span class="font-bold text-cyan-400"><?= htmlspecialchars($ord['flavor']) ?></span>
                                </div>
                                <div>
                                    <span class="text-slate-500 block">Tracking:</span>
                                    <span class="font-bold text-amber-400"><?= htmlspecialchars($ord['tracking_number'] ?: 'TRK-PENDING') ?></span>
                                </div>
                                <div>
                                    <span class="text-slate-500 block">Shipping Address:</span>
                                    <span class="truncate block text-slate-300"><?= htmlspecialchars($ord['shipping_address']) ?></span>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

            </div>

            <!-- Right Column: Payout Statement Report Panel -->
            <div id="reports" class="lg:col-span-5 space-y-8">
                <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <h3 class="text-xl font-bold text-white flex items-center space-x-2">
                                <i data-lucide="file-text" class="w-5 h-5 text-emerald-400"></i>
                                <span>Payout & Statement Report</span>
                            </h3>
                            <p class="text-[11px] text-slate-400 font-mono mt-0.5">Detailed financial transaction ledger</p>
                        </div>

                        <a
                            href="dashboard.php?export=csv&filter=<?= $filterType ?>"
                            class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 font-mono text-xs flex items-center space-x-1.5 font-bold transition-all"
                        >
                            <i data-lucide="download" class="w-3.5 h-3.5"></i>
                            <span>Export CSV</span>
                        </a>
                    </div>

                    <!-- Filter Tabs -->
                    <div class="flex items-center space-x-2 font-mono text-xs overflow-x-auto pb-1">
                        <?php foreach (['ALL' => 'All', 'DIRECT_REFERRAL' => 'Direct', 'MATRIX_LEVEL' => 'Level', 'WITHDRAWAL' => 'Payouts'] as $key => $lbl): ?>
                            <a
                                href="dashboard.php?filter=<?= $key ?>#reports"
                                class="px-2.5 py-1 rounded-lg border font-bold transition-all <?= $filterType === $key ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' ?>"
                            >
                                <?= $lbl ?>
                            </a>
                        <?php endforeach; ?>
                    </div>

                    <?php if (empty($transactions)): ?>
                        <div class="text-center py-8 text-slate-500 text-xs font-mono">
                            No statement entries matching filter criteria.
                        </div>
                    <?php else: ?>
                        <div class="space-y-3 max-h-[520px] overflow-y-auto pr-2 font-mono text-xs">
                            <?php foreach ($transactions as $tx): ?>
                                <?php
                                $isWd = $tx['type'] === 'WITHDRAWAL';
                                $isDir = $tx['type'] === 'DIRECT_REFERRAL';
                                ?>
                                <div class="p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                                    <div class="flex justify-between items-center">
                                        <span class="font-bold <?= $isWd ? 'text-amber-400' : ($isDir ? 'text-emerald-400' : 'text-cyan-400') ?>">
                                            <?= $isWd ? 'Payout Settlement' : ($isDir ? '₹1,000 Direct Bonus' : "₹200 Level {$tx['level_depth']} Bonus") ?>
                                        </span>
                                        <span class="font-black text-sm <?= $isWd ? 'text-amber-400' : 'text-emerald-400' ?>">
                                            <?= $isWd ? '-₹' . number_format(abs($tx['amount'])) : '+₹' . number_format($tx['amount']) ?>
                                        </span>
                                    </div>
                                    <p class="text-slate-300 text-[11px]"><?= htmlspecialchars($tx['description']) ?></p>
                                    <div class="text-slate-500 text-[10px] pt-1"><?= $tx['created_at'] ?></div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

        </div>

    </div>
</div>

<!-- Withdrawal Modal -->
<div id="withdrawModal" class="<?= $withdrawMsg ? '' : 'hidden' ?> fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 max-w-md w-full bg-slate-950 space-y-6 shadow-2xl relative font-mono text-xs">
        <div class="flex justify-between items-center border-b border-slate-800 pb-4">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                    <i data-lucide="wallet" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-lg font-extrabold text-white">Withdraw Earnings</h3>
                    <span class="text-xs text-emerald-400">Available: ₹<?= number_format($user['wallet_balance'], 2) ?></span>
                </div>
            </div>
            <button onclick="document.getElementById('withdrawModal').classList.add('hidden')" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <?php if ($withdrawMsg): ?>
            <div class="p-3 rounded-xl <?= $withdrawMsg['type'] === 'success' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40' : 'bg-red-950/60 text-red-400 border border-red-500/40' ?>">
                <?= htmlspecialchars($withdrawMsg['text']) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="dashboard.php" class="space-y-4">
            <input type="hidden" name="action" value="withdraw" />
            <div>
                <label class="text-slate-300 block mb-1">Amount (₹)</label>
                <input
                    type="number"
                    name="amount"
                    min="1"
                    max="<?= $user['wallet_balance'] ?>"
                    required
                    placeholder="Enter amount (e.g. 1000)"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                />
            </div>

            <div>
                <label class="text-slate-300 block mb-1">Payout Method</label>
                <select name="method" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-bold focus:border-cyan-500 focus:outline-none">
                    <option value="UPI">UPI Virtual Payment Address</option>
                    <option value="BANK_TRANSFER">Bank Account (IMPS/NEFT)</option>
                </select>
            </div>

            <div>
                <label class="text-slate-300 block mb-1">UPI ID or Bank Account Details</label>
                <input
                    type="text"
                    name="details"
                    required
                    placeholder="e.g. user@upi OR Account: 1234567, IFSC: HDFC000123"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                />
            </div>

            <div class="pt-2 flex justify-end space-x-3">
                <button type="button" onclick="document.getElementById('withdrawModal').classList.add('hidden')" class="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold shadow-neon">
                    Submit Request
                </button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
