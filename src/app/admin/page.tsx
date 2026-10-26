'use client';

import { useState, useEffect, useCallback } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import {
  ShieldAlert,
  Users,
  Wallet,
  Package,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Zap,
  FileText,
  Download,
  Filter,
  ArrowDownRight,
  Layers,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('Dispatched');
  const [editTracking, setEditTracking] = useState('');
  const [updating, setUpdating] = useState(false);

  // Admin Payout Report State
  const [reportData, setReportData] = useState<any | null>(null);
  const [reportLoading, setReportLoading] = useState(true);
  const [reportType, setReportType] = useState('ALL');
  const [reportSearch, setReportSearch] = useState('');
  const [reportPage, setReportPage] = useState(1);

  const fetchAdminData = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/members?q=${encodeURIComponent(search)}&page=${page}&limit=10`)
      .then((res) => {
        if (!res.ok) {
          window.location.href = '/login';
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d) setData(d);
      })
      .finally(() => setLoading(false));
  }, [search, page]);

  const fetchReportData = useCallback(() => {
    setReportLoading(true);
    fetch(`/api/reports/payouts?type=${reportType}&q=${encodeURIComponent(reportSearch)}&page=${reportPage}&limit=10`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((d) => {
        if (d) setReportData(d);
      })
      .finally(() => setReportLoading(false));
  }, [reportType, reportSearch, reportPage]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleUpdateFulfillment = async (orderId: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          fulfillmentStatus: editStatus,
          trackingNumber: editTracking,
        }),
      });

      if (res.ok) {
        setEditingOrderId(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const exportReportCSV = () => {
    if (!reportData || !reportData.transactions) return;
    const headers = ['Transaction ID,User ID,User Name,Source User,Type,Amount (INR),Description,Date'];
    const rows = reportData.transactions.map((tx: any) =>
      `"${tx.id}","${tx.user_id}","${tx.user_name || ''}","${tx.source_user_name || tx.source_user_id}","${tx.type}","${tx.amount}","${tx.description.replace(/"/g, '""')}","${new Date(tx.created_at).toLocaleString()}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `company_wide_payout_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#0b0f19]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500 flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="text-cyan-400 font-mono text-sm">Loading System Control Panel...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, members, pagination } = data;

  const adminUser = {
    id: 'ORB00000',
    name: 'Admin User',
    email: 'admin@orbitnutrition.com',
    role: 'admin' as const,
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Admin Portal', href: '/admin' },
    { label: 'Control Center' },
  ];

  return (
    <SidebarLayout user={adminUser} breadcrumbs={breadcrumbs}>

      {/* Admin Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900/90 via-slate-900 to-slate-950">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase font-bold mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Root System Control Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Orbit Network Executive Suite</h1>
          <p className="text-slate-400 text-xs mt-1">Company-Wide 10-Matrix Monitoring & Product Fulfillment Center</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold">
          System Root Node: ORB00000
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-mono uppercase">
            <span>Total Platform Revenue</span>
            <Wallet className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-400 font-mono">₹{metrics.totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">₹6,000 package sales</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-mono uppercase">
            <span>Registered Distributors</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono">{metrics.totalMembers}</p>
          <p className="text-[11px] text-slate-400">Active matrix nodes</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-mono uppercase">
            <span>Distributed Commissions</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 font-mono">₹{metrics.totalCommissions.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">Direct + Level payouts</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-mono uppercase">
            <span>Protein Kit Orders</span>
            <Package className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-300 font-mono">{metrics.totalOrders}</p>
          <p className="text-[11px] text-slate-400">Fulfillment orders logged</p>
        </div>

      </div>

      {/* Company-Wide Payout & Commission Audit Report */}
      <div id="payout-report" className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Company-Wide Payout & Commission Audit Report</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">Detailed ledger of all referral bonuses, level payouts, and withdrawals</p>
          </div>

          <button
            onClick={exportReportCSV}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-black flex items-center space-x-2 transition-all shadow-neon"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit CSV</span>
          </button>
        </div>

        {/* Financial Totals Summary Row */}
        {reportData && reportData.stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
              <ArrowDownRight className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Direct Referral Payouts</span>
                <span className="text-base font-extrabold text-emerald-400">₹{reportData.stats.totalDirect.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
              <Layers className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">10-Matrix Level Payouts</span>
                <span className="text-base font-extrabold text-cyan-400">₹{reportData.stats.totalMatrix.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Member Withdrawals Settled</span>
                <span className="text-base font-extrabold text-amber-400">₹{reportData.stats.totalWithdrawn.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="flex items-center space-x-2 font-mono text-xs overflow-x-auto">
            <span className="text-slate-500 font-bold uppercase text-[10px] pr-2">Filter Type:</span>
            {['ALL', 'DIRECT_REFERRAL', 'MATRIX_LEVEL', 'WITHDRAWAL'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setReportType(t);
                  setReportPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  reportType === t
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t === 'ALL'
                  ? 'All Transactions'
                  : t === 'DIRECT_REFERRAL'
                  ? 'Direct Referrals'
                  : t === 'MATRIX_LEVEL'
                  ? 'Matrix Levels'
                  : 'Withdrawals'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={reportSearch}
              onChange={(e) => {
                setReportSearch(e.target.value);
                setReportPage(1);
              }}
              placeholder="Search by User, ID, Description..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* Payout Report Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-cyan-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Tx ID</th>
                <th className="p-3">Distributor</th>
                <th className="p-3">Source Member</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {reportLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-500">
                    Loading payout ledger...
                  </td>
                </tr>
              ) : !reportData || reportData.transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-500">
                    No transactions recorded matching filter criteria.
                  </td>
                </tr>
              ) : (
                reportData.transactions.map((tx: any) => {
                  const isWithdrawal = tx.type === 'WITHDRAWAL';
                  const isDirect = tx.type === 'DIRECT_REFERRAL';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-mono text-[11px] text-slate-400">{tx.id}</td>
                      <td className="p-3">
                        <span className="font-extrabold text-cyan-400 block">{tx.user_id}</span>
                        <span className="text-[10px] text-slate-400">{tx.user_name}</span>
                      </td>
                      <td className="p-3 text-slate-300">{tx.source_user_name || tx.source_user_id || 'System'}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          isWithdrawal
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : isDirect
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className={`p-3 font-extrabold ${isWithdrawal ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {isWithdrawal ? `-₹${Math.abs(tx.amount)}` : `+₹${tx.amount}`}
                      </td>
                      <td className="p-3 text-slate-400 text-[11px] max-w-xs truncate">{tx.description}</td>
                      <td className="p-3 text-right text-[10px] text-slate-500">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Payout Report Pagination */}
        {reportData && reportData.pagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800 text-xs font-mono text-slate-400">
            <div>
              Showing Page {reportData.pagination.page} of {reportData.pagination.totalPages || 1} ({reportData.pagination.totalRecords} total entries)
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={reportPage <= 1}
                onClick={() => setReportPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
                {reportPage}
              </span>
              <button
                disabled={reportPage >= reportData.pagination.totalPages}
                onClick={() => setReportPage((p) => p + 1)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Distributors & Fulfillment Table Container */}
      <div id="directory" className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">

        {/* Table Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <h3 className="text-xl font-bold text-white">Distributor Master Directory</h3>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by ID, Name, Sponsor, Parent..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* Searchable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-cyan-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">BFS Seq</th>
                <th className="p-3">Distributor ID</th>
                <th className="p-3">Name & Email</th>
                <th className="p-3">Sponsor ID</th>
                <th className="p-3">Parent ID</th>
                <th className="p-3">Matrix Level</th>
                <th className="p-3">Flavor & Fulfillment</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    No distributors found matching query.
                  </td>
                </tr>
              ) : (
                members.map((m: any) => (
                  <tr key={m.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-bold text-slate-500">#{m.bfs_sequence}</td>
                    <td className="p-3 font-extrabold text-cyan-400">{m.id}</td>
                    <td className="p-3">
                      <span className="font-bold text-white block">{m.name}</span>
                      <span className="text-[10px] text-slate-400">{m.email}</span>
                    </td>
                    <td className="p-3 text-slate-300">{m.sponsor_id || 'System'}</td>
                    <td className="p-3 text-cyan-300 font-bold">{m.parent_id || 'Root'}</td>
                    <td className="p-3 text-amber-400 font-bold">Level {m.matrix_level}</td>
                    <td className="p-3">
                      <span className="text-slate-200 block font-semibold">{m.flavor_preference}</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold mt-1 ${
                        m.fulfillment_status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : m.fulfillment_status === 'Dispatched'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      }`}>
                        {m.fulfillment_status || 'Processing'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {editingOrderId === m.order_id ? (
                        <div className="flex flex-col space-y-2 text-left bg-slate-950 p-2 rounded-lg border border-cyan-500/40">
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="bg-slate-900 text-slate-200 p-1 rounded border border-slate-700 text-[10px]"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          <input
                            type="text"
                            value={editTracking}
                            onChange={(e) => setEditTracking(e.target.value)}
                            placeholder="Tracking #"
                            className="bg-slate-900 text-slate-200 p-1 rounded border border-slate-700 text-[10px]"
                          />
                          <div className="flex space-x-1 pt-1">
                            <button
                              onClick={() => handleUpdateFulfillment(m.order_id)}
                              disabled={updating}
                              className="px-2 py-1 bg-cyan-500 text-slate-950 rounded font-bold hover:bg-cyan-400"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingOrderId(null)}
                              className="px-2 py-1 bg-slate-800 text-slate-400 rounded hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingOrderId(m.order_id);
                            setEditStatus(m.fulfillment_status || 'Processing');
                            setEditTracking(m.tracking_number || '');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-semibold text-[11px] inline-flex items-center space-x-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Fulfill Order</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
          <div>
            Showing Page {pagination.page} of {pagination.totalPages || 1} ({pagination.totalRecords} total records)
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
              {page}
            </span>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </SidebarLayout>
  );
}
