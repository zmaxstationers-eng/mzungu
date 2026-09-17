import React, { useState } from 'react';
import { X, Wallet, ArrowRight, ShieldCheck, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onWithdrawalSubmitted: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  onWithdrawalSubmitted
}) => {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState<string>('500');
  const [phone, setPhone] = useState(user?.mpesaNumber || user?.phoneNumber || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !user) return null;

  const numAmount = Number(amount) || 0;
  const fee = 15;
  const netAmount = Math.max(0, numAmount - fee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (numAmount < 500) {
      setError('Minimum withdrawal amount is KSh 500.');
      return;
    }

    if (numAmount > availableBalance) {
      setError(`Requested amount exceeds your available balance of KSh ${availableBalance.toLocaleString()}.`);
      return;
    }

    if (!phone || phone.length < 9) {
      setError('Please enter a valid Safaricom M-Pesa phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.requestWithdrawal(user.id, phone, numAmount);
      setSuccessMsg(res.message);
      await refreshUser();
      onWithdrawalSubmitted();
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Withdrawal request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">M-Pesa Cashout</span>
            <h3 className="text-xl font-extrabold text-slate-900">Request Withdrawal</h3>
          </div>
        </div>

        {successMsg ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Withdrawal Submitted!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              {successMsg}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Balance Overview */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Available Balance</span>
                <div className="text-2xl font-extrabold text-emerald-800">
                  KSh {availableBalance.toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAmount(String(availableBalance))}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                Max Out
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amount to Withdraw (KSh)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">KSh</span>
                <input
                  type="number"
                  min="500"
                  max={availableBalance}
                  step="50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-sm font-bold border border-slate-300 rounded-xl pl-13 pr-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Minimum withdrawal amount: <strong>KSh 500</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0712345678"
                className="w-full text-sm font-semibold border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Registered Safaricom M-Pesa line for direct B2C payout.
              </span>
            </div>

            {/* Fee and Net calculation */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span>Requested Amount:</span>
                <span className="font-semibold">KSh {numAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>M-Pesa B2C Carrier Fee:</span>
                <span className="font-semibold text-slate-600">KSh {fee}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900">
                <span>Net M-Pesa Disbursement:</span>
                <span className="text-emerald-700">KSh {netAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Processing time notice */}
            <div className="flex items-start gap-2 text-[11px] text-slate-500">
              <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
              <span>
                <strong>Processing Time:</strong> M-Pesa disbursements undergo security validation and are typically delivered to your phone within 1 to 2 hours during normal EAT business hours.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || numAmount < 500 || numAmount > availableBalance}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              {loading ? 'Submitting Request...' : `Request Withdrawal (KSh ${netAmount.toLocaleString()})`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
