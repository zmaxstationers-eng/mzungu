import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Wallet, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCw, 
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { User, Transaction, AbuseReport, WithdrawalRequest } from '../types';

export const AdminView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<AbuseReport[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [s, r, w, t] = await Promise.all([
        api.getAdminStats(),
        api.getAdminReports(),
        api.getAdminWithdrawals(),
        api.getTeachers()
      ]);
      setStats(s);
      setReports(r);
      setWithdrawals(w);
      setTeachers(t);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleApproveWithdrawal = async (txnId: string) => {
    try {
      await api.actOnWithdrawal(txnId, 'approve', 'Approved via Safaricom B2C queue');
      setActionMessage('Withdrawal approved and marked completed via Safaricom B2C.');
      loadAdminData();
      setTimeout(() => setActionMessage(''), 3500);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRejectWithdrawal = async (txnId: string) => {
    try {
      await api.actOnWithdrawal(txnId, 'reject', 'Insufficient verified session balance or invalid phone');
      setActionMessage('Withdrawal marked failed and funds refunded to teacher balance.');
      loadAdminData();
      setTimeout(() => setActionMessage(''), 3500);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleResolveReport = async (reportId: string, action: 'dismissed' | 'user_suspended') => {
    try {
      await api.resolveReport(reportId, 'resolved', action);
      setActionMessage(`Report marked as ${action}.`);
      loadAdminData();
      setTimeout(() => setActionMessage(''), 3500);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Platform Governance</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Super Admin Mode
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Funza Mzungu Operations Center</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit teacher activations, approve M-Pesa payouts, and enforce zero-abuse community safety.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Refresh Stats
        </button>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block">Total Teachers</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-1">{stats.totalTeachers}</span>
            <span className="text-[11px] text-emerald-700 font-medium">Vetted Hosts</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block">Active Learners</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-1">{stats.totalLearners}</span>
            <span className="text-[11px] text-slate-400 font-medium">International Students</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block">Hours Taught</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-1">{stats.totalHoursTaught} hrs</span>
            <span className="text-[11px] text-emerald-700 font-medium">Verified Server Time</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block">Platform M-Pesa Payouts</span>
            <span className="text-2xl font-extrabold text-emerald-800 block mt-1">KSh {stats.totalPlatformPayouts.toLocaleString()}</span>
            <span className="text-[11px] text-slate-400 font-medium">Disbursed to Kenyan Hosts</span>
          </div>
        </div>
      )}

      {/* Section: Pending M-Pesa Withdrawals */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-700" />
              <span>Pending M-Pesa Withdrawals</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Approve host cashouts after reviewing verified session logs.</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full">
            {withdrawals.filter(w => w.status === 'pending').length} Pending
          </span>
        </div>

        {withdrawals.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">No withdrawal requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Host ID</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{w.reference}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{w.userId}</td>
                    <td className="py-3 px-3 font-medium text-slate-700">{w.phoneNumber || '0712345678'}</td>
                    <td className="py-3 px-3 font-bold text-emerald-800">KSh {w.amount.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        w.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        w.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{new Date(w.timestamp).toLocaleDateString()}</td>
                    <td className="py-3 px-3 text-right space-x-2">
                      {w.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApproveWithdrawal(w.id)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold cursor-pointer transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectWithdrawal(w.id)}
                            className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-bold cursor-pointer transition"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Section: Community Reports & Safety Queue */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>User Incident & Abuse Reports</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Review safety claims, scam attempts, or harassment complaints.</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-red-100 text-red-900 rounded-full">
            {reports.filter(r => r.status === 'pending').length} Pending Review
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">No reports currently submitted.</div>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{r.reason}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      r.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{r.details}</p>
                  <div className="text-[11px] text-slate-400">
                    Reported user: <span className="font-mono text-slate-700">{r.reportedUserId}</span> by <span className="font-mono text-slate-700">{r.reporterId}</span> • {new Date(r.createdAt).toLocaleString()}
                  </div>
                </div>

                {r.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleResolveReport(r.id, 'dismissed')}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleResolveReport(r.id, 'user_suspended')}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      Suspend User
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section: Teacher Management Table */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <span>Teacher Registry & Verification Status</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Hosts directory and activation states.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Teacher</th>
                <th className="py-2.5 px-3">Country</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Activation</th>
                <th className="py-2.5 px-3">Available Balance</th>
                <th className="py-2.5 px-3">Completed Hrs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 flex items-center gap-2 font-bold text-slate-900">
                    <img src={t.avatar} alt={t.displayName} className="w-7 h-7 rounded-full object-cover" />
                    <span>{t.fullName}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{t.country}</td>
                  <td className="py-3 px-3 text-slate-600">{t.kiswahiliLevel}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                      t.activationStatus === 'activated' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.activationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-emerald-800">KSh {t.availableBalance.toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-600">{t.completedHours} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
