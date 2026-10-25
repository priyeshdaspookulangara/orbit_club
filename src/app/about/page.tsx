import Link from 'next/link';
import { ShieldCheck, Award, Truck, CheckCircle2, Zap, HeartPulse, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="relative py-16 bg-[#0b0f19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <span>Brand Story & Quality Excellence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Pioneering Pure Nutrition & <span className="text-gradient-cyan">Financial Empowerment</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Orbit Nutrition was founded in 2026 with a bold dual mission: to deliver ultra-pure, scientifically formulated protein supplements while democratizing wealth creation through an automated, company-wide forced spillover matrix.
          </p>
        </div>

        {/* Quality Standards & Product Pillar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
              <Award className="w-8 h-8 text-cyan-400" />
              <span>Pharmaceutical Grade Quality</span>
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              Our flagship 1kg Pure Whey Protein Powder Kit is manufactured in ISO-22000 and GMP certified state-of-the-art facilities. Each batch undergoes rigorous third-party lab testing to ensure zero heavy metals, zero banned substances, and accurate macronutrient profiles.
            </p>

            <div className="space-y-3">
              {[
                '24g Premium Fast-Absorbing Whey Isolate & Concentrate Blend',
                '5.5g Naturally Occurring Branched-Chain Amino Acids (BCAAs)',
                'Zero Added Sugars, Gluten-Free, and Digestive Enzyme Infused',
                'Mouthwatering Gourmet Flavors: Rich Chocolate & Creamy Vanilla',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-slate-200 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
              Quality Assurance Snapshot
            </h3>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-2xl font-bold text-cyan-400 font-mono">100%</p>
                <p className="text-xs text-slate-400 mt-1 uppercase">Pure Whey Source</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-2xl font-bold text-emerald-400 font-mono">ISO 22000</p>
                <p className="text-xs text-slate-400 mt-1 uppercase">Certified Facility</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-2xl font-bold text-cyan-300 font-mono">24g</p>
                <p className="text-xs text-slate-400 mt-1 uppercase">Protein Per Scoop</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-2xl font-bold text-yellow-400 font-mono">0g</p>
                <p className="text-xs text-slate-400 mt-1 uppercase">Added Sugar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Ecosystem Pillar */}
        <div className="glass-panel p-10 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Zap className="w-8 h-8 text-cyan-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Strict BFS Spillover</h4>
              <p className="text-slate-400 text-xs">
                Breadth-First Search queue guarantees that every single distributor joining the company gets placed systematically across the top-to-bottom, left-to-right tree.
              </p>
            </div>
            <div className="space-y-2">
              <HeartPulse className="w-8 h-8 text-cyan-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Immediate Dispatch</h4>
              <p className="text-slate-400 text-xs">
                Upon registration for ₹6,000, your 1kg Protein Tub order is logged immediately in our automated logistics warehouse for prompt dispatch.
              </p>
            </div>
            <div className="space-y-2">
              <ShieldCheck className="w-8 h-8 text-cyan-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">100% Transparent Wallet</h4>
              <p className="text-slate-400 text-xs">
                Track every ₹1,000 direct referral and ₹200 level commission credited in real-time with comprehensive transaction ledger logs.
              </p>
            </div>
          </div>
        </div>

        {/* Warehouse & Location banner */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Truck className="w-10 h-10 text-cyan-400 flex-shrink-0" />
            <div>
              <h3 className="text-white font-bold text-lg">Central Fulfillment Center</h3>
              <p className="text-slate-400 text-xs">Orbit Logistics Park, Cyber City, Sector 44, Gurugram, India</p>
            </div>
          </div>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-neon flex items-center space-x-2 transition-all"
          >
            <span>Order Your Kit Today</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
