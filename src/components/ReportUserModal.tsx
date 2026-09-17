import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface ReportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  reporterId: string;
  reportedUserId: string;
  reportedUserName: string;
  sessionId?: string;
}

export const ReportUserModal: React.FC<ReportUserModalProps> = ({
  isOpen,
  onClose,
  reporterId,
  reportedUserId,
  reportedUserName,
  sessionId
}) => {
  const [reason, setReason] = useState<any>('Harassment');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      setError('Please provide specific details of what occurred.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await api.submitReport({
        reporterId,
        reportedUserId,
        sessionId,
        reason,
        details
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Report Submitted</h3>
            <p className="text-sm text-slate-600">
              Thank you for keeping Funza Mzungu safe. Our Trust & Safety team has received your report regarding <strong>{reportedUserName}</strong> and will review it immediately.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Report Inappropriate Behavior</h3>
                <p className="text-xs text-slate-500">Reporting user: <span className="font-semibold text-slate-700">{reportedUserName}</span></p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-900">
              Funza Mzungu has strict zero-tolerance for harassment, sexual exploitation, financial scams, hate speech, or requesting off-platform payments.
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg mb-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Report</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                >
                  <option value="Harassment">Harassment or bullying</option>
                  <option value="Inappropriate content">Inappropriate language / explicit topics</option>
                  <option value="Off-platform financial solicitation">Asking for off-platform money / crypto / external contact</option>
                  <option value="Scam / Fraud">Scam, extortion or impersonation</option>
                  <option value="Hate speech">Hate speech or discriminatory remarks</option>
                  <option value="Other">Other violation of Community Guidelines</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Describe What Happened</label>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please give clear context or paste excerpt of the incident..."
                  className="w-full text-sm border border-slate-300 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-hidden resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-xs flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Abuse Report'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
