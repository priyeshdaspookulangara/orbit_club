<?php
require_once __DIR__ . '/src/MatrixEngine.php';
require_once __DIR__ . '/src/Auth.php';

$error = null;
$success = null;
$sponsorSponsorId = $_GET['sponsor'] ?? 'ORB00000';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $engine = new MatrixEngine();
        $res = $engine->registerDistributor([
            'name' => $_POST['name'] ?? '',
            'email' => $_POST['email'] ?? '',
            'phone' => $_POST['phone'] ?? '',
            'password' => $_POST['password'] ?? '',
            'sponsorId' => $_POST['sponsorId'] ?? 'ORB00000',
            'flavor' => $_POST['flavor'] ?? 'Chocolate',
            'shippingAddress' => $_POST['shippingAddress'] ?? '',
        ]);

        // Auto log in newly registered member
        Auth::login($_POST['email'], $_POST['password']);
        header('Location: dashboard.php?registered=1');
        exit();
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}

$pageTitle = "Distributor Registration | Orbit Nutrition";
require_once __DIR__ . '/includes/header.php';
?>

<div class="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
    <div class="space-y-8">

        <div class="text-center space-y-3">
            <span class="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
                ₹6,000 Package Activation
            </span>
            <h1 class="text-3xl font-extrabold text-white">Join 10-Matrix Direct Selling</h1>
            <p class="text-slate-400 text-sm">
                Get 1kg Pure Whey Protein & automatic BFS company-wide spillover placement.
            </p>
        </div>

        <div class="glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6">
            <?php if ($error): ?>
                <div class="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
                    <i data-lucide="alert-circle" class="w-5 h-5 text-red-400 shrink-0"></i>
                    <span><?= htmlspecialchars($error) ?></span>
                </div>
            <?php endif; ?>

            <form method="POST" action="register.php" class="space-y-5 font-mono text-xs">
                <div>
                    <label class="block uppercase text-slate-400 mb-1">Sponsor ID</label>
                    <input
                        type="text"
                        name="sponsorId"
                        value="<?= htmlspecialchars($sponsorSponsorId) ?>"
                        required
                        class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-bold focus:outline-none focus:border-cyan-400"
                    />
                    <span class="text-[10px] text-slate-500 mt-1 block">Default root sponsor is ORB00000</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block uppercase text-slate-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="John Doe"
                            class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div>
                        <label class="block uppercase text-slate-400 mb-1">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            required
                            placeholder="+91 98765 43210"
                            class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block uppercase text-slate-400 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="user@domain.com"
                            class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div>
                        <label class="block uppercase text-slate-400 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                </div>

                <div>
                    <label class="block uppercase text-slate-400 mb-1">Protein Powder Flavor Preference</label>
                    <select name="flavor" class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-bold focus:outline-none focus:border-cyan-400">
                        <option value="Chocolate">Rich Chocolate (1kg Tub)</option>
                        <option value="Vanilla">Creamy Vanilla (1kg Tub)</option>
                    </select>
                </div>

                <div>
                    <label class="block uppercase text-slate-400 mb-1">Shipping & Dispatch Address</label>
                    <textarea
                        name="shippingAddress"
                        required
                        rows="3"
                        placeholder="House / Flat No., Street, City, Pincode, State"
                        class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    ></textarea>
                </div>

                <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-400 text-[11px]">
                    <div class="flex justify-between font-bold text-white">
                        <span>Total Package Payable:</span>
                        <span class="text-emerald-400 text-sm">₹6,000 INR</span>
                    </div>
                    <p>Includes 1kg Protein Tub, Company-Wide BFS Placement, ₹1,000 Direct Referral & ₹200 Level Commissions.</p>
                </div>

                <button
                    type="submit"
                    class="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-slate-950 font-black text-sm shadow-neon transition-all flex items-center justify-center space-x-2"
                >
                    <i data-lucide="check-circle-2" class="w-5 h-5"></i>
                    <span>Complete ₹6,000 Registration</span>
                </button>
            </form>
        </div>

    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
