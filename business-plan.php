<?php
$pageTitle = "10-Matrix Business Plan & Financial Breakdown | Orbit Nutrition";
require_once __DIR__ . '/includes/header.php';
?>

<section class="py-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="text-center space-y-4 max-w-3xl mx-auto">
            <span class="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
                Transparent Financial Model
            </span>
            <h1 class="text-4xl font-extrabold text-white">10-Matrix 5-Level Compensation Plan</h1>
            <p class="text-slate-400 text-sm">
                Detailed breakdown of the ₹6,000 package, ₹1,000 direct referral, and ₹200 level commission structure.
            </p>
        </div>

        <!-- Structure Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono">
            <div class="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-4">
                <div class="text-xs text-slate-500 uppercase">Registration Kit</div>
                <div class="text-3xl font-black text-white">₹6,000</div>
                <ul class="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                    <li class="flex items-center space-x-2">
                        <i data-lucide="check" class="w-4 h-4 text-cyan-400"></i>
                        <span>1kg Pure Whey Protein Tub</span>
                    </li>
                    <li class="flex items-center space-x-2">
                        <i data-lucide="check" class="w-4 h-4 text-cyan-400"></i>
                        <span>Choice of Chocolate / Vanilla</span>
                    </li>
                    <li class="flex items-center space-x-2">
                        <i data-lucide="check" class="w-4 h-4 text-cyan-400"></i>
                        <span>Instant Business Placement</span>
                    </li>
                </ul>
            </div>

            <div class="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
                <div class="text-xs text-slate-500 uppercase">Direct Sponsor Bonus</div>
                <div class="text-3xl font-black text-emerald-400">₹1,000</div>
                <ul class="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                    <li class="flex items-center space-x-2">
                        <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
                        <span>Instant wallet credit</span>
                    </li>
                    <li class="flex items-center space-x-2">
                        <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
                        <span>Unlimited direct referrals</span>
                    </li>
                    <li class="flex items-center space-x-2">
                        <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
                        <span>No capping or matching required</span>
                    </li>
                </ul>
            </div>

            <div class="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-4">
                <div class="text-xs text-slate-500 uppercase">Matrix Level Commission</div>
                <div class="text-3xl font-black text-amber-400">₹200 / head</div>
                <ul class="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                    <li class="flex items-center space-x-2">
                        <i data-lucide="check" class="w-4 h-4 text-amber-400"></i>
                        <span>Paid across 5 descendant levels</span>
                    </li>
                    <li class="flex items-center space-x-2">
                        <i data-lucide="check" class="w-4 h-4 text-amber-400"></i>
                        <span>Strict left-to-right BFS queue</span>
                    </li>
                    <li class="flex items-center space-x-2">
                        <i data-lucide="check" class="w-4 h-4 text-amber-400"></i>
                        <span>Maximum capacity: 11,111 members</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 5 Tiers Capacity Table -->
        <div class="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <h2 class="text-2xl font-bold text-white flex items-center space-x-2">
                <i data-lucide="layers" class="w-6 h-6 text-cyan-400"></i>
                <span>5-Level Matrix Capacity & Earning Table</span>
            </h2>

            <div class="overflow-x-auto">
                <table class="w-full text-left font-mono text-xs text-slate-300">
                    <thead>
                        <tr class="border-b border-slate-800 text-slate-500 uppercase">
                            <th class="py-3 px-4">Matrix Tier</th>
                            <th class="py-3 px-4">Capacity (10^n)</th>
                            <th class="py-3 px-4">Comm. Rate / Head</th>
                            <th class="py-3 px-4">Tier Potential (INR)</th>
                            <th class="py-3 px-4">Cumulative Total (INR)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                        <tr>
                            <td class="py-3.5 px-4 font-bold text-cyan-400">Level 0 (Root)</td>
                            <td class="py-3.5 px-4">1 Node</td>
                            <td class="py-3.5 px-4">-</td>
                            <td class="py-3.5 px-4">-</td>
                            <td class="py-3.5 px-4">-</td>
                        </tr>
                        <tr>
                            <td class="py-3.5 px-4 font-bold text-white">Level 1</td>
                            <td class="py-3.5 px-4">10 Nodes</td>
                            <td class="py-3.5 px-4">₹200</td>
                            <td class="py-3.5 px-4">₹2,000</td>
                            <td class="py-3.5 px-4 text-emerald-400 font-bold">₹2,000</td>
                        </tr>
                        <tr>
                            <td class="py-3.5 px-4 font-bold text-white">Level 2</td>
                            <td class="py-3.5 px-4">100 Nodes</td>
                            <td class="py-3.5 px-4">₹200</td>
                            <td class="py-3.5 px-4">₹20,000</td>
                            <td class="py-3.5 px-4 text-emerald-400 font-bold">₹22,000</td>
                        </tr>
                        <tr>
                            <td class="py-3.5 px-4 font-bold text-white">Level 3</td>
                            <td class="py-3.5 px-4">1,000 Nodes</td>
                            <td class="py-3.5 px-4">₹200</td>
                            <td class="py-3.5 px-4">₹2,00,000</td>
                            <td class="py-3.5 px-4 text-emerald-400 font-bold">₹2,22,000</td>
                        </tr>
                        <tr>
                            <td class="py-3.5 px-4 font-bold text-white">Level 4</td>
                            <td class="py-3.5 px-4">10,000 Nodes</td>
                            <td class="py-3.5 px-4">₹200</td>
                            <td class="py-3.5 px-4">₹20,00,000</td>
                            <td class="py-3.5 px-4 text-emerald-400 font-bold">₹22,22,000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
