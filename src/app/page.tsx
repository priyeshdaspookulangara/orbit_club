import Link from 'next/link';
import { Zap, ShieldCheck, TrendingUp, Award, CheckCircle2, ArrowRight, Layers, Users, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[#0b0f19]">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Next-Gen Direct Selling Platform 2026</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                Fuel Your Body with <br />
                <span className="text-gradient-cyan">Pure Whey Protein</span> & <br />
                Build Financial Freedom
              </h1>

              <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                Orbit Nutrition brings you ultra-pure 1kg Whey Protein Tub packages coupled with a revolutionary <strong>10-Matrix 5-Level Company-Wide BFS Auto-Spillover</strong> business model. Guaranteed ₹1,000 direct referral plus ₹200 level commissions.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-950 font-extrabold text-base transition-all shadow-neon hover:shadow-neon-strong transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                >
                  <span>Start ₹6,000 Kit Registration</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/business-plan"
                  className="px-8 py-4 rounded-xl glass-panel hover:bg-slate-800/80 text-cyan-400 font-semibold text-base border border-cyan-500/30 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Explore 10-Matrix Plan</span>
                </Link>
              </div>

              {/* Key Highlights Banner */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
                <div>
                  <p className="text-2xl font-extrabold text-cyan-400 font-mono">₹6,000</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Starter Kit</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-emerald-400 font-mono">₹1,000</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Direct Referral</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-cyan-300 font-mono">₹200</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Level Bonus x5</p>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl glass-panel p-8 border border-cyan-500/30 shadow-2xl bg-slate-900/60 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full" />

                {/* Product Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-400 font-mono text-xs border border-cyan-500/40">
                    Product Kit #ORB-PRO-100
                  </span>
                  <span className="text-emerald-400 font-bold text-sm flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>In Stock</span>
                  </span>
                </div>

                {/* Protein Tub Mockup Graphic */}
                <div className="w-full h-64 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/60 flex flex-col items-center justify-center p-6 text-center shadow-inner relative group">
                  <div className="w-28 h-36 rounded-2xl bg-gradient-to-tr from-cyan-600 to-cyan-400 p-1 shadow-neon mb-3 flex flex-col items-center justify-between p-3 text-slate-950">
                    <Zap className="w-8 h-8 fill-slate-950 text-slate-950" />
                    <span className="font-extrabold text-xs tracking-tighter uppercase">PURE WHEY</span>
                    <span className="text-[10px] bg-slate-950 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">1KG TUB</span>
                  </div>
                  <h3 className="text-white font-bold text-lg">1kg Ultra Pure Whey Protein</h3>
                  <p className="text-xs text-slate-400 mt-1">Chocolate / Vanilla Flavors • 24g Protein per Scoop</p>
                </div>

                {/* Matrix Spillover Live Status Box */}
                <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Company Spillover Engine:</span>
                    <span className="text-cyan-400 font-mono font-bold flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
                      Active BFS Queue
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono flex justify-between">
                    <span>Root Node: <strong className="text-cyan-400">ORB00000</strong></span>
                    <span>Max Width: <strong className="text-cyan-400">10 Direct</strong></span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 relative border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Choose <span className="text-gradient-cyan">Orbit Nutrition</span>?
            </h2>
            <p className="text-slate-400 text-base">
              Engineered for maximum income potential and absolute fairness with automated database-driven auto-spillover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Feature 1 */}
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">10-Matrix 5-Level Structure</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every node supports up to 10 direct children across 5 descendant tiers. Maximum global network capacity of 11,111 distributors.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Strict BFS Company Spillover</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automated Breadth-First Search queue guarantees left-to-right placement across every tier. No distributor gets left behind!
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Commission Payouts</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Earn ₹1,000 instantly on every direct referral plus ₹200 level bonuses credited immediately to your digital wallet upon registration.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-cyan-500/40 text-center space-y-8 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Ready to Claim Your <span className="text-gradient-cyan">Matrix Spot</span>?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              Join with Sponsor ID <strong className="text-cyan-400 font-mono">ORB00000</strong> or your inviter&apos;s ID today. Receive your 1kg Protein Tub and activate your income stream.
            </p>
            <div>
              <Link
                href="/register"
                className="inline-flex items-center space-x-2 px-9 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-950 font-black text-lg shadow-neon hover:shadow-neon-strong transform hover:-translate-y-1 transition-all"
              >
                <span>Register Now for ₹6,000</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
