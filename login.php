<?php
require_once __DIR__ . '/src/Auth.php';

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $emailOrId = $_POST['emailOrId'] ?? '';
        $password = $_POST['password'] ?? '';
        $user = Auth::login($emailOrId, $password);

        if ($user['role'] === 'admin') {
            header('Location: admin.php');
        } else {
            header('Location: dashboard.php');
        }
        exit();
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}

$pageTitle = "Distributor Login Portal | Orbit Nutrition";
require_once __DIR__ . '/includes/header.php';
?>

<div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
    <div class="w-full max-w-md space-y-8">

        <div class="text-center space-y-3">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 p-0.5 shadow-neon">
                <div class="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <i data-lucide="zap" class="w-6 h-6 text-cyan-400"></i>
                </div>
            </div>
            <h2 class="text-3xl font-extrabold text-white">Distributor Login Portal</h2>
            <p class="text-slate-400 text-sm">
                Access your 10-Matrix Dashboard & Wallet Balance
            </p>
        </div>

        <div class="glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6">
            <?php if ($error): ?>
                <div class="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
                    <i data-lucide="alert-circle" class="w-5 h-5 text-red-400 shrink-0"></i>
                    <span><?= htmlspecialchars($error) ?></span>
                </div>
            <?php endif; ?>

            <form method="POST" action="login.php" class="space-y-5 font-mono text-xs">
                <div>
                    <label class="block text-xs uppercase text-slate-400 mb-2">
                        Distributor ID or Email
                    </label>
                    <div class="relative">
                        <input
                            type="text"
                            name="emailOrId"
                            required
                            placeholder="e.g. ORB00000 or user@domain.com"
                            class="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
                        />
                        <i data-lucide="mail" class="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5"></i>
                    </div>
                </div>

                <div>
                    <label class="block text-xs uppercase text-slate-400 mb-2">
                        Password
                    </label>
                    <div class="relative">
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            class="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
                        />
                        <i data-lucide="lock" class="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5"></i>
                    </div>
                </div>

                <button
                    type="submit"
                    class="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-slate-950 font-black text-sm shadow-neon transition-all flex items-center justify-center space-x-2"
                >
                    <span>Sign In to Portal</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
            </form>

            <div class="border-t border-slate-800 pt-4 text-center">
                <p class="text-xs text-slate-400">
                    New to Orbit Nutrition?
                    <a href="register.php" class="text-cyan-400 font-semibold hover:underline">
                        Register with Sponsor ID
                    </a>
                </p>
            </div>
        </div>

        <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-500 font-mono">
            <span>Root Admin Credentials: ORB00000 / Admin@123</span>
        </div>

    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
