import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Clock, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Settings, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Power,
  RotateCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { TeacherEarningsSummary, Session, Transaction } from '../types';

interface TeacherDashboardViewProps {
  onOpenWithdrawal: () => void;
  onOpenActivation: () => void;
  onNavigate: (tab: string) => void;
  onOpenSession: (session: Session) => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  onOpenWithdrawal,
  onOpenActivation,
  onNavigate,
  onOpenSession
}) => {
  const { user, refreshUser, setUser } = useAuth();
  const [earnings, setEarnings] = useState<TeacherEarningsSummary | null>(null);
  const [userSessions, setUserSessions] = useState<Session[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isOnline, setIsOnline] = useState(user?.isOnline ?? true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadData = async () => {
    if (!user) return;
    try {
      const [earn, sess, txns] = await Promise.all([
        api.getTeacherEarnings(user.id),
        api.getUserSessions(user.id),
        api.getUserTransactions(user.id)
      ]);
      setEarnings(earn);
      setUserSessions(sess);
      setTransactions(txns);
      setIsOnline(user.isOnline);
    } catch (e) {
      console.error('Failed to load teacher dashboard', e);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const toggleOnline = async () => {
    if (!user) return;
    setUpdatingStatus(true);
    try {
      const updated = await api.updateProfile(user.id, { isOnline: !isOnline });
      setIsOnline(updated.isOnline);
      setUser(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Welcome Banner & Online Toggle */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-xs"
            />
            {isOnline ? (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            ) : (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-300 ring-2 ring-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                Habari, {user.displayName}!
              </h1>
              {user.isVerified && (
                <ShieldCheck className="w-5 h-5 text-emerald-600" title="Verified Host" />
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Host Portal • Rate: <strong className="text-emerald-700">KSh 500 / hr</strong>
            </p>
          </div>
        </div>

        {/* Action Controls & Online Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={toggleOnline}
            disabled={updatingStatus}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 border ${
              isOnline
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Power className={`w-4 h-4 ${isOnline ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{isOnline ? 'Online • Accepting Chats' : 'Offline • Paused'}</span>
          </button>

          <button
            onClick={onOpenWithdrawal}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Wallet className="w-4 h-4" />
            <span>Withdraw M-Pesa</span>
          </button>
        </div>
      </div>

      {/* Activation Status Banner if Not Activated */}
      {user.activationStatus !== 'activated' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Teacher Account Activation Required (KSh 600)
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Status: <strong className="uppercase text-amber-800">{user.activationStatus.replace('_', ' ')}</strong>. Complete your one-time administrative activation fee to receive verified host badge and chat matching.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenActivation}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 cursor-pointer"
          >
            Complete Activation (KSh 600)
          </button>
        </div>
      )}

      {/* Earnings Overview Cards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Financial Overview</h2>
          <button onClick={loadData} className="text-xs text-slate-400 hover:text-emerald-700 flex items-center gap-1">
            <RotateCw className="w-3 h-3" /> Refresh Balances
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Available Balance</span>
            <span className="text-xl font-extrabold text-emerald-800 block mt-1">
              KSh {user.availableBalance.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Ready to withdraw</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Pending Balance</span>
            <span className="text-xl font-extrabold text-amber-700 block mt-1">
              KSh {user.pendingBalance.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">In withdrawal queue</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Today's Earnings</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">
              KSh {earnings?.todaysEarnings.toLocaleString() || '0'}
            </span>
            <span className="text-[10px] text-slate-400">Last 24 hours</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">This Week</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">
              KSh {earnings?.thisWeeksEarnings.toLocaleString() || '0'}
            </span>
            <span className="text-[10px] text-slate-400">Past 7 days</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Withdrawn</span>
            <span className="text-xl font-extrabold text-slate-700 block mt-1">
              KSh {user.totalWithdrawn.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">Sent to M-Pesa</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Host Rating</span>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="text-xl font-extrabold text-slate-900">
                {user.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">{user.totalReviews} reviews</span>
          </div>
        </div>
      </section>

      {/* Main Two Column Section: Sessions & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active & Recent Sessions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Today's & Recent Sessions</h3>
            <button
              onClick={() => onNavigate('chat')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              Open Active Chat <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {userSessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              No sessions yet. Toggle Online above to receive student requests.
            </div>
          ) : (
            <div className="space-y-3">
              {userSessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onOpenSession(s)}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:shadow-xs transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={s.learnerAvatar}
                      alt={s.learnerName}
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{s.learnerName}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          s.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{s.topic}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-800 block">
                      +KSh {Math.round(s.earnedAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {Math.floor(s.verifiedSeconds / 60)} mins
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent M-Pesa & Earning Transactions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Recent Transactions</h3>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Full Ledger
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{t.description}</span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span className="font-mono">{t.reference}</span>
                    <span>•</span>
                    <span>{new Date(t.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold block ${
                    t.type === 'withdrawal' ? 'text-amber-700' : 'text-emerald-800'
                  }`}>
                    {t.type === 'withdrawal' ? '-' : '+'}KSh {t.amount.toLocaleString()}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
