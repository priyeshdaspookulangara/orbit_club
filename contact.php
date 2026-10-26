<?php
$pageTitle = "Contact & Warehouse Locations | Orbit Nutrition";
require_once __DIR__ . '/includes/header.php';
?>

<section class="py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="text-center space-y-3">
            <span class="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
                Direct Support & Warehousing
            </span>
            <h1 class="text-4xl font-extrabold text-white">Contact Orbit Support</h1>
            <p class="text-slate-400 text-sm">Have inquiries regarding distributor onboarding, kit dispatches, or payouts?</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
                <h3 class="text-xl font-bold text-white flex items-center space-x-2">
                    <i data-lucide="building" class="w-5 h-5 text-cyan-400"></i>
                    <span>Corporate Headquarters</span>
                </h3>

                <div class="space-y-4 text-xs font-mono text-slate-300">
                    <div>
                        <span class="text-slate-500 block">Address:</span>
                        <span>Orbit Tech Park, Sector 62, Noida, NCR, India</span>
                    </div>
                    <div>
                        <span class="text-slate-500 block">Dispatch Warehouse:</span>
                        <span>Orbit Logistics Hub, Plot 42, Greater Noida</span>
                    </div>
                    <div>
                        <span class="text-slate-500 block">Email Support:</span>
                        <span class="text-cyan-400">support@orbitnutrition.com</span>
                    </div>
                    <div>
                        <span class="text-slate-500 block">Hotline:</span>
                        <span>+91 98765 43210 / +91 11 4000 8888</span>
                    </div>
                </div>
            </div>

            <div class="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
                <h3 class="text-xl font-bold text-white">Send Message</h3>
                <form onsubmit="alert('Message sent to Orbit Nutrition Support.'); return false;" class="space-y-4 text-xs font-mono">
                    <div>
                        <label class="text-slate-400 block mb-1">Your Name</label>
                        <input type="text" required placeholder="John Doe" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none">
                    </div>
                    <div>
                        <label class="text-slate-400 block mb-1">Distributor ID / Email</label>
                        <input type="text" required placeholder="ORB00001" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none">
                    </div>
                    <div>
                        <label class="text-slate-400 block mb-1">Message</label>
                        <textarea required rows="4" placeholder="How can we help you?" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-neon transition-all">
                        Send Inquiry
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
