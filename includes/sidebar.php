<?php
// includes/sidebar.php
$currentScript = basename($_SERVER['PHP_SELF']);
?>
<aside class="w-full lg:w-64 bg-slate-950/80 border-r border-slate-800 flex-shrink-0 p-6 space-y-8 font-mono text-xs">

    <!-- User Badge -->
    <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
                <?= strtoupper(substr($user['name'], 0, 1)) ?>
            </div>
            <div class="truncate">
                <span class="text-white font-bold block text-sm truncate"><?= htmlspecialchars($user['name']) ?></span>
                <span class="text-cyan-400 text-[10px]"><?= htmlspecialchars($user['id']) ?></span>
            </div>
        </div>
        <div class="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
            <span>Role: <strong class="text-slate-200"><?= strtoupper($user['role']) ?></strong></span>
            <span>Tier: <strong class="text-cyan-400">Level <?= $user['matrix_level'] ?></strong></span>
        </div>
    </div>

    <!-- Navigation Menu -->
    <div class="space-y-2">
        <span class="text-[10px] uppercase text-slate-500 font-bold tracking-wider block px-2">Portal Navigation</span>

        <a href="dashboard.php" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl font-bold transition-all <?= $currentScript === 'dashboard.php' ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-900' ?>">
            <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
            <span>Member Overview</span>
        </a>

        <a href="dashboard.php#wallet" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
            <i data-lucide="wallet" class="w-4 h-4 text-emerald-400"></i>
            <span>Wallet & Withdraw</span>
        </a>

        <a href="dashboard.php#matrix" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
            <i data-lucide="layers" class="w-4 h-4 text-cyan-400"></i>
            <span>10-Matrix Tree</span>
        </a>

        <a href="dashboard.php#reports" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
            <i data-lucide="file-text" class="w-4 h-4 text-amber-400"></i>
            <span>Payout Statement</span>
        </a>

        <?php if ($user['role'] === 'admin'): ?>
            <div class="pt-4 border-t border-slate-800">
                <span class="text-[10px] uppercase text-cyan-400 font-bold tracking-wider block px-2 mb-2">Admin Control</span>
                <a href="admin.php" class="flex items-center space-x-3 px-3 py-2.5 rounded-xl font-bold transition-all <?= $currentScript === 'admin.php' ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-900' ?>">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                    <span>Admin Control Center</span>
                </a>
            </div>
        <?php endif; ?>
    </div>

</aside>
