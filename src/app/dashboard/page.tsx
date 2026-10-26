'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';
import {
  Zap,
  Wallet,
  Users,
  Package,
  Layers,
  Copy,
  Check,
  UserPlus,
  Truck,
  ArrowUpRight,
  CreditCard,
  Building,
  RefreshCw,
  Clock,
  ArrowDownRight
} from 'lucide-react';

export default function UserDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Withdrawal modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'UPI' | 'BANK_TRANSFER'>('UPI');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUserData = () => {
    fetch('/api/user/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d && d.authenticated) {
          setData(d);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserData();
  }, [router]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawLoading(true);
    setWithdrawMessage(null);

    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: withdrawAmount,
          method: payoutMethod,
          payoutDetails,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setWithdrawMessage({ type: 'error', text: result.error || 'Withdrawal failed' });
      } else {
        setWithdrawMessage({ type: 'success', text: result.message });
        setWithdrawAmount('');
        setPayoutDetails('');
        fetchUserData(); // refresh ledger & wallet balance
        setTimeout(() => setShowWithdrawModal(false), 2000);
      }
    } catch (err: any) {
      setWithdrawMessage({ type: 'error', text: err.message || 'Error executing request' });
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#0b0f19]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500 flex items-center justify-center animate-pulse">
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="text-cyan-400 font-mono text-sm">Loading 10-Matrix Profile...</span>
        </div>
      </div>
    );
  }

  if (!data || !data.user) return null;

  const { user, orders, transactions, directRecruits, matrixChildren } = data;
  const sponsorLink = typeof window !== 'undefined' ? `${window.location.origin}/register?sponsor=${user.id}` : '';

  const copyReferral = () => {
    navigator.clipboard.writeText(sponsorLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Financial Breakdown calculations
  const directEarnings = transactions
    .filter((tx: any) => tx.type === 'DIRECT_REFERRAL')
    .reduce((sum: number, tx: any) => sum + tx.amount, 0);

  const matrixLevelEarnings = transactions
    .filter((tx: any) => tx.type === 'MATRIX_LEVEL')
    .reduce((sum: number, tx: any) => sum + tx.amount, 0);

  const totalWithdrawn = Math.abs(
    transactions
      .filter((tx: any) => tx.type === 'WITHDRAWAL')
      .reduce((sum: number, tx: any) => sum + tx.amount, 0)
  );

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Member Portal', href: '/dashboard' },
    { label: 'Overview' },
  ];

  return (
    <SidebarLayout user={user} breadcrumbs={breadcrumbs}>

      {/* Top Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900/90 via-slate-900 to-slate-950">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs border border-cyan-500/40">
              ID: {user.id}
            </span>
            <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs border border-emerald-500/40">
              Active Member
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Welcome, {user.name}</h1>
          <p className="text-slate-400 text-xs sm:text-sm font-mono">
            Sponsor ID: <strong className="text-cyan-400">{user.sponsorId || 'None'}</strong> • Matrix Parent: <strong className="text-cyan-300">{user.parentId || 'Root Node'}</strong>
          </p>
        </div>

        {/* Copy Referral Box */}
        <div className="w-full md:w-auto glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Your Personal Referral Link</span>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={sponsorLink}
              className="px-3 py-1.5 rounded-lg bg-slate-950 text-cyan-400 font-mono text-xs border border-slate-800 w-full sm:w-64 focus:outline-none"
            />
            <button
              onClick={copyReferral}
              className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-bold"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics & Wallet Cards Grid */}
      <div id="wallet" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Wallet Balance & Action Card */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-500/70 transition-all space-y-4">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase font-bold text-emerald-400">Available Wallet</span>
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-3xl font-black text-emerald-400 font-mono">₹{user.walletBalance.toLocaleString()}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Instant direct & level commissions</p>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-neon transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw Earnings</span>
          </button>
        </div>

        {/* Matrix Placement Tier */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-500/60 transition-all space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Matrix Tier Level</span>
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-400 font-mono">Level {user.matrixLevel}</p>
          <p className="text-[11px] text-slate-400">BFS Sequence: #{user.bfsSequence}</p>
        </div>

        {/* Direct Recruits */}
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 hover:border-amber-500/60 transition-all space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Direct Sponsors</span>
            <UserPlus className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 font-mono">{directRecruits.length}</p>
          <p className="text-[11px] text-slate-400">Earned ₹{directEarnings.toLocaleString()} referral bonus</p>
        </div>

        {/* Fulfillment Status */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-500/60 transition-all space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Protein Kit Order</span>
            <Package className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-300 font-mono capitalize">
            {orders[0]?.fulfillment_status || 'Processing'}
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            Flavor: {orders[0]?.flavor || user.flavorPreference}
          </p>
        </div>

      </div>

      {/* Financial Summary Breakdown Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
        <div className="flex items-center space-x-4 border-b sm:border-b-0 sm:border-r border-slate-800 pb-4 sm:pb-0 sm:pr-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Direct Referral Bonus</span>
            <span className="text-lg font-bold text-emerald-400">₹{directEarnings.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 border-b sm:border-b-0 sm:border-r border-slate-800 pb-4 sm:pb-0 sm:pr-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">10-Matrix Level Bonus</span>
            <span className="text-lg font-bold text-cyan-400">₹{matrixLevelEarnings.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Total Payouts Settled</span>
            <span className="text-lg font-bold text-amber-400">₹{totalWithdrawn.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Interactive 10-Matrix Tree Viewer & Order Info */}
        <div className="lg:col-span-7 space-y-8">

          {/* Interactive Matrix Tree View */}
          <div id="matrix" className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>Your 10-Matrix Downline Tree</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Directly assigned matrix children (Max 10 per node)</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold">
                {matrixChildren.length} / 10 Capacity
              </span>
            </div>

            {/* Tree Nodes Display */}
            <div className="space-y-4">
              {/* Parent Self Node */}
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between font-mono">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-xs">
                    YOU
                  </div>
                  <div>
                    <span className="text-white font-bold block text-sm">{user.name} ({user.id})</span>
                    <span className="text-slate-400 text-xs">Level {user.matrixLevel} • Position #{user.position ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* Children Nodes */}
              {matrixChildren.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs font-mono space-y-2">
                  <p>No matrix children assigned under your node yet.</p>
                  <p className="text-cyan-400">Company-wide BFS auto-spillover will populate this tier automatically!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l-2 border-cyan-500/30">
                  {matrixChildren.map((child: any) => (
                    <div key={child.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all font-mono text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-cyan-400 font-bold">{child.id}</span>
                        <span className="text-slate-500 text-[10px]">Pos #{child.position}</span>
                      </div>
                      <div className="text-slate-200 font-semibold truncate">{child.name}</div>
                      <div className="text-slate-400 text-[10px]">Level {child.matrix_level}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Fulfillment Details */}
          <div id="fulfillment" className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-4">
              <Truck className="w-5 h-5 text-cyan-400" />
              <span>1kg Whey Protein Fulfillment Status</span>
            </h3>

            {orders.map((order: any) => (
              <div key={order.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                  <span className="text-slate-400">Order ID: <strong className="text-slate-200">{order.id}</strong></span>
                  <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                    order.fulfillment_status === 'Delivered'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : order.fulfillment_status === 'Dispatched'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  }`}>
                    • {order.fulfillment_status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Package:</span>
                    <span className="font-bold text-white">{order.package_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Selected Flavor:</span>
                    <span className="font-bold text-cyan-400">{order.flavor}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tracking Number:</span>
                    <span className="font-bold text-amber-400">{order.tracking_number || 'TRK-PENDING'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Shipping Address:</span>
                    <span className="truncate block text-slate-300">{user.shippingAddress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Wallet Commissions & Withdrawal Ledger */}
        <div className="lg:col-span-5 space-y-8">

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>Real-time Financial Ledger</span>
              </h3>
              <button
                onClick={fetchUserData}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                title="Refresh Ledger"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs font-mono">
                No financial transactions recorded yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
                {transactions.map((tx: any) => {
                  const isWithdrawal = tx.type === 'WITHDRAWAL';
                  const isDirect = tx.type === 'DIRECT_REFERRAL';

                  return (
                    <div key={tx.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className={`font-bold ${
                          isWithdrawal
                            ? 'text-amber-400'
                            : isDirect
                            ? 'text-emerald-400'
                            : 'text-cyan-400'
                        }`}>
                          {isWithdrawal
                            ? 'Payout Settlement'
                            : isDirect
                            ? '₹1,000 Direct Bonus'
                            : `₹200 Level ${tx.level_depth} Bonus`}
                        </span>
                        <span className={`font-black text-sm ${isWithdrawal ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {isWithdrawal ? `-₹${Math.abs(tx.amount)}` : `+₹${tx.amount}`}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{tx.description}</p>
                      <div className="text-slate-500 text-[10px] pt-1">
                        {new Date(tx.created_at).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Withdrawal Modal Dialog */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 max-w-md w-full bg-slate-950 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Withdraw Earnings</h3>
                  <span className="text-xs text-emerald-400 font-mono">
                    Available: ₹{user.walletBalance.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {withdrawMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-mono ${
                  withdrawMessage.type === 'success'
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                    : 'bg-red-950/60 text-red-400 border border-red-500/40'
                }`}
              >
                {withdrawMessage.text}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  max={user.walletBalance}
                  required
                  placeholder="Enter amount (e.g., 1000)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Payout Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('UPI')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center space-x-2 font-bold ${
                      payoutMethod === 'UPI'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>UPI ID</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('BANK_TRANSFER')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center space-x-2 font-bold ${
                      payoutMethod === 'BANK_TRANSFER'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Bank Account</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">
                  {payoutMethod === 'UPI' ? 'UPI Virtual Payment Address (VPA)' : 'Bank Account No. & IFSC'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={payoutMethod === 'UPI' ? 'e.g. name@upi' : 'Account No: 12345678, IFSC: HDFC000123'}
                  value={payoutDetails}
                  onChange={(e) => setPayoutDetails(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={withdrawLoading || user.walletBalance <= 0}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold shadow-neon disabled:opacity-50"
                >
                  {withdrawLoading ? 'Processing...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </SidebarLayout>
  );
}
