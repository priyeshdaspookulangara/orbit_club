'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, CheckCircle2, AlertCircle, ShieldCheck, UserCheck, ArrowRight, Package, Truck, Lock, Mail, User, MapPin } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sponsorFromUrl = searchParams.get('sponsor') || 'ORB00000';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    sponsorId: sponsorFromUrl,
    flavorPreference: 'Chocolate',
    shippingAddress: '',
  });

  const [sponsorName, setSponsorName] = useState<string | null>(null);
  const [sponsorValid, setSponsorValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);

  // Auto verify sponsor ID on change
  useEffect(() => {
    if (!form.sponsorId || form.sponsorId.trim() === '') {
      setSponsorValid(null);
      setSponsorName(null);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/sponsor/verify?sponsorId=${encodeURIComponent(form.sponsorId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setSponsorValid(true);
            setSponsorName(data.name);
          } else {
            setSponsorValid(false);
            setSponsorName(null);
          }
        })
        .catch(() => {
          setSponsorValid(false);
          setSponsorName(null);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [form.sponsorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (sponsorValid === false) {
      setError('Please provide a valid active Sponsor ID.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please check inputs.');
      }

      setSuccessResult(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
          <span>Direct Selling Activation • ₹6,000 Kit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Distributor Registration Portal
        </h1>
        <p className="text-slate-400 text-sm">
          Join Orbit Nutrition to receive your 1kg Whey Protein Tub & activate your spot in the 10-Matrix
        </p>
      </div>

      {/* Success View */}
      {successResult ? (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6 bg-slate-900/90 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Welcome to Orbit Network!</h2>
            <p className="text-slate-300 text-sm">Your account and ₹6,000 Whey Protein order have been created successfully.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-left font-mono text-sm space-y-3">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Assigned Distributor ID:</span>
              <span className="text-cyan-400 font-extrabold">{successResult.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Sponsor ID:</span>
              <span className="text-slate-200">{successResult.sponsorId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Assigned Matrix Parent:</span>
              <span className="text-cyan-300 font-bold">{successResult.parentId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Matrix Tier Level:</span>
              <span className="text-emerald-400 font-bold">Level {successResult.matrixLevel}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Global BFS Sequence:</span>
              <span className="text-amber-400 font-bold">#{successResult.bfsSequence}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Order ID:</span>
              <span className="text-slate-300">{successResult.orderId}</span>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="block w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-950 font-black text-base shadow-neon hover:shadow-neon-strong transition-all"
          >
            Go to Member Dashboard
          </Link>
        </div>
      ) : (
        /* Form Card */
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Sponsor Verification Box */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <label className="block text-xs font-mono uppercase text-cyan-400 font-bold">
                Sponsor Distributor ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={form.sponsorId}
                  onChange={(e) => setForm({ ...form, sponsorId: e.target.value.toUpperCase() })}
                  placeholder="e.g. ORB00000"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm uppercase focus:outline-none focus:border-cyan-400"
                />
                <ShieldCheck className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              </div>

              {sponsorValid === true && (
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono">
                  <UserCheck className="w-4 h-4" />
                  <span>Verified Sponsor: <strong>{sponsorName}</strong></span>
                </div>
              )}
              {sponsorValid === false && (
                <div className="flex items-center space-x-2 text-red-400 text-xs font-mono">
                  <AlertCircle className="w-4 h-4" />
                  <span>Invalid Sponsor ID. Default system sponsor is ORB00000.</span>
                </div>
              )}
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Vikram Verma"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="vikram@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Account Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
                />
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Package Selection */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-bold text-sm">Product Kit Selection</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-sm">₹6,000 (Incl. Taxes)</span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                  Select 1kg Protein Powder Flavor:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, flavorPreference: 'Chocolate' })}
                    className={`p-3.5 rounded-xl border text-sm font-bold transition-all ${
                      form.flavorPreference === 'Chocolate'
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-neon'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    🍫 Rich Chocolate
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, flavorPreference: 'Vanilla' })}
                    className={`p-3.5 rounded-xl border text-sm font-bold transition-all ${
                      form.flavorPreference === 'Vanilla'
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-neon'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    🍦 French Vanilla
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Shipping Address *</label>
                <div className="relative">
                  <textarea
                    required
                    rows={2}
                    value={form.shippingAddress}
                    onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                    placeholder="Full street address, city, state, pincode..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <MapPin className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || sponsorValid === false}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-slate-950 font-black text-base shadow-neon transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Executing BFS Matrix Placement...</span>
              ) : (
                <>
                  <span>Complete ₹6,000 Package Registration</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-slate-800 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Already registered?{' '}
              <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
                Sign In here
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Register() {
  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-[#0b0f19] relative">
      <Suspense fallback={
        <div className="text-center py-20 text-cyan-400 font-mono text-sm animate-pulse">
          Loading Registration Portal...
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
