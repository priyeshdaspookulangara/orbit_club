<?php
require_once __DIR__ . '/src/Auth.php';
$adminUser = Auth::requireAdmin();
$pdo = Database::getConnection();

// Order Fulfillment Status Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_fulfillment') {
    $orderId = $_POST['order_id'] ?? '';
    $status = $_POST['fulfillment_status'] ?? 'Processing';
    $tracking = trim($_POST['tracking_number'] ?? '');

    $stmt = $pdo->prepare("UPDATE orders SET fulfillment_status = ?, tracking_number = ? WHERE id = ?");
    $stmt->execute([$status, $tracking, $orderId]);
}

// Global Metrics Calculation
$totalUsers = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
$totalOrders = (int)$pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
$totalRevenue = $totalOrders * 6000;

$payoutStmt = $pdo->query("SELECT SUM(amount) FROM transactions WHERE type IN ('DIRECT_REFERRAL', 'MATRIX_LEVEL')");
$totalCommissions = (float)($payoutStmt->fetchColumn() ?: 0);

$withdrawStmt = $pdo->query("SELECT SUM(ABS(amount)) FROM transactions WHERE type = 'WITHDRAWAL'");
$totalPayoutsSettled = (float)($withdrawStmt->fetchColumn() ?: 0);

// Search / Filter Members Query
$search = trim($_GET['search'] ?? '');
$userSql = "SELECT * FROM users";
$userParams = [];
if (!empty($search)) {
    $userSql .= " WHERE id LIKE ? OR name LIKE ? OR email LIKE ? OR sponsor_id LIKE ?";
    $userParams = ["%{$search}%", "%{$search}%", "%{$search}%", "%{$search}%"];
}
$userSql .= " ORDER BY bfs_sequence ASC";
$userStmt = $pdo->prepare($userSql);
$userStmt->execute($userParams);
$allMembers = $userStmt->fetchAll();

// Fetch System-wide Orders with Member details
$ordersStmt = $pdo->query("
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
");
$allOrders = $ordersStmt->fetchAll();

// Fetch All Payout Ledger Entries for Admin
$adminTxStmt = $pdo->query("
    SELECT t.*, u.name as user_name
    FROM transactions t
    JOIN users u ON u.id = t.user_id
    ORDER BY t.created_at DESC
");
$allTransactions = $adminTxStmt->fetchAll();

// Admin CSV Export
if (isset($_GET['export']) && $_GET['export'] === 'admin_csv') {
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="system_payouts_audit.csv"');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['Transaction ID', 'User ID', 'User Name', 'Type', 'Amount (INR)', 'Description', 'Date']);
    foreach ($allTransactions as $tx) {
        fputcsv($output, [$tx['id'], $tx['user_id'], $tx['user_name'], $tx['type'], $tx['amount'], $tx['description'], $tx['created_at']]);
    }
    fclose($output);
    exit();
}

$pageTitle = "Admin Control Center | Orbit Nutrition";
require_once __DIR__ . '/includes/header.php';
?>

<div class="flex flex-col lg:flex-row min-h-[85vh]">
    <?php $user = $adminUser; require_once __DIR__ . '/includes/sidebar.php'; ?>

    <div class="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full font-mono">

        <!-- Header Banner -->
        <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900 to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center space-x-2">
                    <span class="px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-400 font-bold text-xs border border-cyan-500/40">
                        ADMIN PANEL
                    </span>
                    <span class="text-xs text-slate-400">Company-Wide BFS 10-Matrix Monitor</span>
                </div>
                <h1 class="text-3xl font-extrabold text-white mt-1">Platform Control & Audit Center</h1>
                <p class="text-slate-400 text-xs mt-0.5">Global distributor directory, matrix spillover level stats & package fulfillment.</p>
            </div>

            <a
                href="admin.php?export=admin_csv"
                class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-slate-950 font-black text-xs shadow-neon transition-all flex items-center space-x-2"
            >
                <i data-lucide="download" class="w-4 h-4"></i>
                <span>Download Full Audit Ledger CSV</span>
            </a>
        </div>

        <!-- Metric Counters Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">

            <div class="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-2">
                <span class="text-slate-400 uppercase">Total Platform Revenue</span>
                <p class="text-3xl font-black text-white">₹<?= number_format($totalRevenue) ?></p>
                <p class="text-[10px] text-cyan-400"><?= $totalOrders ?> Active ₹6,000 Package Sales</p>
            </div>

            <div class="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-2">
                <span class="text-slate-400 uppercase">Commissions Generated</span>
                <p class="text-3xl font-black text-emerald-400">₹<?= number_format($totalCommissions) ?></p>
                <p class="text-[10px] text-slate-400">Direct + 10-Matrix Level Bonuses</p>
            </div>

            <div class="glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-2">
                <span class="text-slate-400 uppercase">Total Settled Payouts</span>
                <p class="text-3xl font-black text-amber-400">₹<?= number_format($totalPayoutsSettled) ?></p>
                <p class="text-[10px] text-slate-400">Processed Member Withdrawals</p>
            </div>

            <div class="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-2">
                <span class="text-slate-400 uppercase">Total Registered Distributors</span>
                <p class="text-3xl font-black text-cyan-400"><?= $totalUsers ?></p>
                <p class="text-[10px] text-slate-400">BFS Global Queue Length</p>
            </div>

        </div>

        <!-- Searchable Distributor Directory -->
        <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                    <h2 class="text-xl font-bold text-white flex items-center space-x-2">
                        <i data-lucide="users" class="w-5 h-5 text-cyan-400"></i>
                        <span>Distributor Directory & Matrix Placement</span>
                    </h2>
                    <p class="text-xs text-slate-400">Comprehensive list of all nodes across 5 levels</p>
                </div>

                <form method="GET" action="admin.php" class="flex items-center space-x-2 w-full sm:w-auto">
                    <input
                        type="text"
                        name="search"
                        value="<?= htmlspecialchars($search) ?>"
                        placeholder="Search ID, Name, Email or Sponsor..."
                        class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 w-full sm:w-64"
                    />
                    <button type="submit" class="px-3 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400">
                        Search
                    </button>
                </form>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs text-slate-300">
                    <thead>
                        <tr class="border-b border-slate-800 text-slate-500 uppercase">
                            <th class="py-3 px-4">BFS #</th>
                            <th class="py-3 px-4">Distributor ID</th>
                            <th class="py-3 px-4">Name & Email</th>
                            <th class="py-3 px-4">Sponsor ID</th>
                            <th class="py-3 px-4">Parent ID</th>
                            <th class="py-3 px-4">Matrix Level</th>
                            <th class="py-3 px-4">Wallet Balance</th>
                            <th class="py-3 px-4">Joined Date</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                        <?php foreach ($allMembers as $m): ?>
                            <tr class="hover:bg-slate-900/50">
                                <td class="py-3 px-4 text-slate-500">#<?= $m['bfs_sequence'] ?></td>
                                <td class="py-3 px-4 font-bold text-cyan-400"><?= $m['id'] ?></td>
                                <td class="py-3 px-4">
                                    <span class="text-white font-bold block"><?= htmlspecialchars($m['name']) ?></span>
                                    <span class="text-slate-500 text-[10px]"><?= htmlspecialchars($m['email']) ?></span>
                                </td>
                                <td class="py-3 px-4 text-amber-400"><?= $m['sponsor_id'] ?: 'None' ?></td>
                                <td class="py-3 px-4 text-cyan-300"><?= $m['parent_id'] ?: 'Root' ?></td>
                                <td class="py-3 px-4 font-bold">Level <?= $m['matrix_level'] ?></td>
                                <td class="py-3 px-4 text-emerald-400 font-bold">₹<?= number_format($m['wallet_balance'], 2) ?></td>
                                <td class="py-3 px-4 text-slate-500 text-[10px]"><?= $m['created_at'] ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Package Orders & Fulfillment Management -->
        <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h2 class="text-xl font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-4">
                <i data-lucide="package" class="w-5 h-5 text-cyan-400"></i>
                <span>1kg Whey Protein Fulfillment Queue</span>
            </h2>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs text-slate-300">
                    <thead>
                        <tr class="border-b border-slate-800 text-slate-500 uppercase">
                            <th class="py-3 px-4">Order ID</th>
                            <th class="py-3 px-4">Distributor</th>
                            <th class="py-3 px-4">Flavor</th>
                            <th class="py-3 px-4">Status</th>
                            <th class="py-3 px-4">Tracking Number</th>
                            <th class="py-3 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                        <?php foreach ($allOrders as $ord): ?>
                            <tr>
                                <td class="py-3 px-4 font-bold text-slate-300"><?= $ord['id'] ?></td>
                                <td class="py-3 px-4">
                                    <span class="text-white block font-bold"><?= htmlspecialchars($ord['user_name']) ?></span>
                                    <span class="text-cyan-400 text-[10px]"><?= $ord['user_id'] ?></span>
                                </td>
                                <td class="py-3 px-4 text-cyan-300 font-bold"><?= htmlspecialchars($ord['flavor']) ?></td>
                                <td class="py-3 px-4">
                                    <span class="px-2.5 py-1 rounded-full font-bold text-[10px] <?= $ord['fulfillment_status'] === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400' ?>">
                                        <?= $ord['fulfillment_status'] ?>
                                    </span>
                                </td>
                                <td class="py-3 px-4 text-amber-400 font-mono"><?= htmlspecialchars($ord['tracking_number'] ?: 'TRK-PENDING') ?></td>
                                <td class="py-3 px-4">
                                    <form method="POST" action="admin.php" class="flex items-center space-x-2">
                                        <input type="hidden" name="action" value="update_fulfillment" />
                                        <input type="hidden" name="order_id" value="<?= $ord['id'] ?>" />
                                        <select name="fulfillment_status" class="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-white">
                                            <option value="Processing" <?= $ord['fulfillment_status'] === 'Processing' ? 'selected' : '' ?>>Processing</option>
                                            <option value="Dispatched" <?= $ord['fulfillment_status'] === 'Dispatched' ? 'selected' : '' ?>>Dispatched</option>
                                            <option value="Delivered" <?= $ord['fulfillment_status'] === 'Delivered' ? 'selected' : '' ?>>Delivered</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="tracking_number"
                                            value="<?= htmlspecialchars($ord['tracking_number'] ?: '') ?>"
                                            placeholder="Tracking #"
                                            class="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-white w-24"
                                        />
                                        <button type="submit" class="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 text-[10px]">
                                            Save
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
