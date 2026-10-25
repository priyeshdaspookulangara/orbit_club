'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layers, Users, TrendingUp, ShieldCheck, ArrowRight, CheckCircle2, Calculator } from 'lucide-react';

export default function BusinessPlan() {
  const [calcRecruits, setCalcRecruits] = useState(10);

  const directReferralTotal = calcRecruits * 1000;

  const levelBreakdown = [
    { level: 1, nodes: 10, bonusPerHead: 200, totalPotential: 2000 },
    { level: 2, nodes: 100, bonusPerHead: 200, totalPotential: 20000 },
    { level: 3, nodes: 1000, bonusPerHead: 200, totalPotential: 200000 },
    { level: 4, nodes: 10000, bonusPerHead: 200, totalPotential: 2000000 },
  ];

  const totalMatrixPotential = levelBreakdown.reduce((acc, curr) => acc + curr.totalPotential, 0);

  return (
    <div className="relative py-16 bg-[#0b0f19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <span>Core Compensation Model</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            10-Matrix 5-Level <span className="text-gradient-cyan">Spillover Plan</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            A mathematically designed direct selling model engineered for long-term sustainability, automatic spillover distribution, and maximum distributor earnings.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="glass-panel p-8 rounded-2xl border border-cyan-500/30 space-y-4 relative overflow-hidden">
            <div className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">Pillar 01</div>
            <h3 className="text-2xl font-extrabold text-white">₹6,000 Package</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every distributor joins by purchasing a single ₹6,000 product package containing a 1kg tub of pure Whey Protein Powder in Chocolate or Vanilla flavor.
            </p>
            <div className="pt-2 text-xs font-mono text-cyan-400 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Includes Product + Business Activation</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-emerald-500/30 space-y-4 relative overflow-hidden">
            <div className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">Pillar 02</div>
            <h3 className="text-2xl font-extrabold text-white">₹1,000 Direct Bonus</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              When you introduce a new distributor using your Sponsor ID, you immediately receive a ₹1,000 direct referral commission credited directly to your wallet.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Unlimited Direct Sponsor Commissions</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-cyan-500/30 space-y-4 relative overflow-hidden">
            <div className="text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">Pillar 03</div>
            <h3 className="text-2xl font-extrabold text-white">₹200 Matrix Level Bonus</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              For every single distributor placed under your matrix tree across 5 levels (depth tiers), ₹200 is credited automatically up the parent chain.
            </p>
            <div className="pt-2 text-xs font-mono text-cyan-300 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Automatic Company-Wide Auto-Spillover</span>
            </div>
          </div>

        </div>

        {/* Matrix Structure Breakdown Table */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-500/30 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">5-Level Matrix Capacity & Earning Matrix</h2>
              <p className="text-slate-400 text-sm mt-1">Strict 10-child limit per parent. Maximum matrix capacity: 11,111 distributors.</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
              Root Node: ORB00000
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-cyan-400 uppercase text-xs font-mono border-b border-slate-800">
                <tr>
                  <th className="p-4">Level Tier</th>
                  <th className="p-4">Max Capacity (Nodes)</th>
                  <th className="p-4">Commission / Head</th>
                  <th className="p-4">Level Income Potential</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr className="hover:bg-slate-900/40 font-mono">
                  <td className="p-4 font-bold text-white">Level 0 (Root Tier)</td>
                  <td className="p-4">1 (Root)</td>
                  <td className="p-4 text-slate-500">-</td>
                  <td className="p-4 text-slate-500">-</td>
                </tr>
                {levelBreakdown.map((row) => (
                  <tr key={row.level} className="hover:bg-slate-900/40 font-mono">
                    <td className="p-4 font-bold text-cyan-400">Level {row.level}</td>
                    <td className="p-4">{row.nodes.toLocaleString()}</td>
                    <td className="p-4 text-emerald-400">₹{row.bonusPerHead}</td>
                    <td className="p-4 font-bold text-cyan-300">₹{row.totalPotential.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-cyan-950/30 font-mono font-extrabold text-white text-base">
                  <td className="p-4 text-cyan-400">Total Matrix (Levels 1-4)</td>
                  <td className="p-4">11,110 Nodes</td>
                  <td className="p-4 text-slate-400">-</td>
                  <td className="p-4 text-emerald-400">₹{totalMatrixPotential.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Earning Simulator */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/90 to-slate-950 space-y-8">
          <div className="flex items-center space-x-3 text-cyan-400">
            <Calculator className="w-6 h-6" />
            <h2 className="text-2xl font-extrabold text-white">Interactive Earnings Simulator</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-6 space-y-6">
              <label className="block text-sm font-medium text-slate-300">
                How many direct distributors do you plan to sponsor personally?
              </label>

              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={calcRecruits}
                  onChange={(e) => setCalcRecruits(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold text-lg border border-cyan-500/40">
                  {calcRecruits}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                Note: In addition to your direct referral earnings of ₹1,000 per sponsor, company-wide BFS spillover will systematically populate your matrix levels up to 4 descendant tiers!
              </div>
            </div>

            <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 font-mono">
              <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-3">
                <span className="text-slate-400">Direct Referral Income:</span>
                <span className="text-emerald-400 font-bold text-base">₹{directReferralTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-3">
                <span className="text-slate-400">Full 10-Matrix Level Earnings:</span>
                <span className="text-cyan-300 font-bold text-base">₹{totalMatrixPotential.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-base font-extrabold pt-2">
                <span className="text-white">Total Estimated Earnings:</span>
                <span className="text-gradient-cyan text-xl">₹{(directReferralTotal + totalMatrixPotential).toLocaleString()}</span>
              </div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 px-9 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-950 font-black text-lg shadow-neon hover:shadow-neon-strong transition-all"
          >
            <span>Activate Your ₹6,000 Matrix Spot Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
