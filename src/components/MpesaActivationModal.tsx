import React, { useState } from 'react';
import { 
  CheckCircle2, 
  X, 
  Smartphone, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Lock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface MpesaActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const MpesaActivationModal: React.FC<MpesaActivationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, refreshUser } = useAuth();
  const [phone, setPhone] = useState(user?.mpesaNumber || user?.phoneNumber || '0712345678');
  const [method, setMethod] = useState<'stk' | 'manual'>('stk');
  const [step, setStep] = useState<'details' | 'waiting' | 'confirmed'>('details');
  const [mpesaCode, setMpesaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkoutData, setCheckoutData] = useState<any>(null);

  if (!isOpen || !user) return null;

  const handleInitiateSTK = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.initiateActivation(user.id, phone);
      setCheckoutData(data);
      setStep('waiting');
    } catch (err: any) {
      setError(err.message || 'Failed to initiate STK push');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (codeOverride?: string) => {
    setError('');
    setLoading(true);

    try {
      await api.confirmActivation(user.id, codeOverride || mpesaCode);
      await refreshUser();
      setStep('confirmed');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Payment confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Top green accent bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'details' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Official Host Activation</span>
                <h3 className="text-xl font-extrabold text-slate-900">Activate Teacher Account</h3>
              </div>
            </div>

            {/* Transparent fee card */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 mb-4">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">One-time Activation Fee</span>
                <span className="text-2xl font-extrabold text-emerald-800">KSh 600</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                A single one-time administrative fee covering teacher vetting, identity confirmation, and profile listing on the marketplace.
              </p>
            </div>

            {/* Mandatory transparency disclosures */}
            <div className="space-y-2 mb-5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>What you receive:</strong> Verified Host badge, public profile discovery, ability to accept chat requests, and M-Pesa automated payout access.</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span><strong>Non-refundable:</strong> The KSh 600 fee is non-refundable once account vetting and profile listing are granted.</span>
              </div>
              <div className="flex items-start gap-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span><strong>Marketplace notice:</strong> Payment does <em>not</em> guarantee earnings or a minimum number of sessions. Teachers earn <strong>KSh 500 per completed verified hour</strong> based on actual sessions held with learners.</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {/* Method tabs */}
            <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMethod('stk')}
                className={`py-2 text-xs font-semibold rounded-lg transition ${
                  method === 'stk' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                M-Pesa STK Push (Instant)
              </button>
              <button
                type="button"
                onClick={() => setMethod('manual')}
                className={`py-2 text-xs font-semibold rounded-lg transition ${
                  method === 'manual' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Manual Paybill 174379
              </button>
            </div>

            {method === 'stk' ? (
              <form onSubmit={handleInitiateSTK} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Safaricom M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0712345678"
                      className="w-full text-sm font-semibold border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">KE (+254)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    An M-Pesa STK prompt for KSh 600 will pop up on this phone.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  {loading ? 'Sending M-Pesa Prompt...' : 'Send STK Push Prompt (KSh 600)'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-800">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Business / Paybill:</span>
                    <span className="font-bold font-mono text-emerald-800">174379</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Account Number:</span>
                    <span className="font-bold font-mono text-slate-900">FMZ-{user.id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount:</span>
                    <span className="font-bold text-emerald-800">KSh 600</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enter M-Pesa Transaction Code (e.g. QK8945...)
                  </label>
                  <input
                    type="text"
                    value={mpesaCode}
                    onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                    placeholder="e.g. QK984021KL"
                    className="w-full text-sm font-mono uppercase font-bold border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <button
                  type="button"
                  disabled={loading || !mpesaCode.trim()}
                  onClick={() => handleConfirmPayment()}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {loading ? 'Verifying Code...' : 'Verify Manual Paybill Code'}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'waiting' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Smartphone className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">M-Pesa STK Prompt Dispatched</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Please check your phone (<strong>{phone}</strong>). Enter your M-Pesa PIN on the screen prompt to authorize KSh 600.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span>Merchant:</span>
                <span className="font-semibold text-slate-900">Funza Mzungu Ltd</span>
              </div>
              <div className="flex justify-between">
                <span>Account:</span>
                <span className="font-mono text-slate-900">FMZ-{user.id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold text-emerald-700">KSh 600</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleConfirmPayment(`QK${Math.floor(Math.random() * 899999 + 100000)}`)}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {loading ? 'Confirming with Daraja API...' : 'Simulate / Confirm M-Pesa PIN Entered'}
              </button>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs text-slate-500 hover:text-slate-800 py-1"
              >
                Change Phone Number or Paybill
              </button>
            </div>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Account Verified</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                "Your teacher account is now active."
              </h3>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto">
                Congratulations! You are now an active Kiswahili Host on Funza Mzungu. You can receive session requests and earn <strong>KSh 500 per verified completed hour</strong>.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <span>Go to Teacher Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
