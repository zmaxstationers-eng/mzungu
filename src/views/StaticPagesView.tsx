import React from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Lock, 
  FileText, 
  HeartHandshake,
  Users
} from 'lucide-react';

interface StaticPagesViewProps {
  page: 'how-it-works' | 'pricing' | 'community-guidelines' | 'terms' | 'privacy' | 'report-abuse';
  onNavigate: (tab: string) => void;
  onOpenReportModal?: () => void;
}

export const StaticPagesView: React.FC<StaticPagesViewProps> = ({
  page,
  onNavigate,
  onOpenReportModal
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in space-y-8">
      {/* Subpage Navigation Chips */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200 text-xs font-semibold">
        {[
          { id: 'how-it-works', label: 'How It Works' },
          { id: 'pricing', label: 'Pricing & Earnings Transparency' },
          { id: 'community-guidelines', label: 'Safety Guidelines' },
          { id: 'terms', label: 'Terms of Service' },
          { id: 'privacy', label: 'Privacy Policy' },
          { id: 'report-abuse', label: 'Report Abuse' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
              page === item.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Page: How It Works */}
      {page === 'how-it-works' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-slate-700">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Platform Overview</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">How Funza Mzungu Works</h1>
            <p className="text-sm text-slate-500 mt-1">
              Connecting conversational Swahili speakers with international learners across the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" /> For Learners
              </h3>
              <ul className="text-xs space-y-2.5 text-slate-600 leading-relaxed">
                <li>• <strong>Find verified hosts:</strong> Filter by native accent, Kenyan Sheng, or Coastal Kiswahili.</li>
                <li>• <strong>Live practice:</strong> Chat one-on-one with fluent hosts using an active session timer.</li>
                <li>• <strong>Everyday culture:</strong> Practice greetings, bargaining, safari vocabulary, or casual banter.</li>
                <li>• <strong>Safe & moderated:</strong> Strict educational standards with instant report tools.</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-700" /> For Kiswahili Hosts
              </h3>
              <ul className="text-xs space-y-2.5 text-slate-600 leading-relaxed">
                <li>• <strong>KSh 500 per completed verified hour:</strong> Server timestamps automatically track exact minutes.</li>
                <li>• <strong>Direct M-Pesa cashouts:</strong> Withdraw your balance straight to your phone.</li>
                <li>• <strong>One-time KSh 600 activation:</strong> Covers profile review, vetting, and marketplace listing.</li>
                <li>• <strong>No get-rich claims:</strong> Earnings depend strictly on completing actual conversation sessions.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Page: Pricing & Earnings Transparency */}
      {page === 'pricing' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-slate-700">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Pricing & Compensation</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Earnings & Transparency Policy</h1>
            <p className="text-sm text-slate-500 mt-1">
              Clear, honest rates with zero hidden fees or misleading promises.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <h3 className="font-bold text-emerald-900 text-base mb-1">Teacher Earnings: KSh 500 / Hour</h3>
              <p className="text-slate-600">
                Verified hosts earn KSh 500 for each 60 minutes of eligible session time conducted with learners. Fractions of hours are calculated proportionally (e.g., 30 minutes = KSh 250, 45 minutes = KSh 375).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h3 className="font-bold text-slate-900 text-base mb-1">Teacher Activation Fee: KSh 600</h3>
              <p className="text-slate-600 mb-2">
                To keep our community safe, serious, and free from automated spam or fraud, teachers pay a single, non-refundable administrative verification fee of KSh 600 upon account setup.
              </p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Non-refundable administrative fee</li>
                <li>Provides Verified Host badge & marketplace discovery</li>
                <li>Payment does NOT guarantee income or minimum number of sessions</li>
                <li>Earnings require actively hosting learner sessions</li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h3 className="font-bold text-slate-900 text-base mb-1">M-Pesa Cashouts</h3>
              <p className="text-slate-600">
                Minimum withdrawal threshold is <strong>KSh 500</strong>. Safaricom carrier B2C transfer fees are KSh 15 per transaction. Processing time is typically 1–2 hours during normal business operations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page: Community Guidelines */}
      {page === 'community-guidelines' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-slate-700">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Trust & Safety</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Community Safety Guidelines</h1>
            <p className="text-sm text-slate-500 mt-1">
              Funza Mzungu is strictly an educational language exchange platform.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/70 text-red-900">
              <strong className="block font-bold text-sm mb-1">Zero Tolerance for Prohibited Conduct</strong>
              <p>
                Violations will result in immediate permanent suspension, forfeiture of pending balances, and potential reporting to law enforcement:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-xs">
                <li>Soliciting off-platform money, loans, or cryptocurrency</li>
                <li>Sexual harassment, explicit content, or dating solicitation</li>
                <li>Hate speech, ethnic discrimination, or harassment</li>
                <li>Impersonation or sharing false identity credentials</li>
                <li>Underage participants (must be at least 18 years old)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <strong className="block font-bold text-slate-900 text-sm mb-1">Respectful Teaching Etiquette</strong>
              <p className="text-slate-600 text-xs">
                Hosts are expected to be patient, polite, encouraging, and focused on helping international students practice Kiswahili grammar, vocabulary, pronunciation, and cultural nuances.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page: Terms of Service */}
      {page === 'terms' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-slate-700">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Legal</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Terms of Service</h1>
            <p className="text-xs text-slate-500 mt-1">Last Updated: September 2026</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
            <p>
              By accessing Funza Mzungu ("Platform"), you agree to abide by these Terms of Service. If you do not agree, do not use the Platform.
            </p>
            <h4 className="font-bold text-slate-900 text-sm">1. Eligibility</h4>
            <p>You must be at least 18 years of age to register as a teacher or learner.</p>
            <h4 className="font-bold text-slate-900 text-sm">2. Teacher Verification & Activation</h4>
            <p>
              Teachers must submit true profile information. The KSh 600 administrative activation fee covers background checks and profile setup, and is non-refundable. The platform makes no guarantees regarding earnings or demand.
            </p>
            <h4 className="font-bold text-slate-900 text-sm">3. Payments & Withdrawals</h4>
            <p>
              Host earnings are verified via server logs and disbursed via Safaricom M-Pesa. Funza Mzungu reserves the right to audit and withhold payouts in instances of suspected fraudulent session manipulation.
            </p>
          </div>
        </div>
      )}

      {/* Page: Privacy Policy */}
      {page === 'privacy' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-slate-700">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Data Protection</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Privacy Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Protecting learner and host personal data.</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
            <p>
              Funza Mzungu respects your privacy and adheres to Kenyan and international data protection standards.
            </p>
            <h4 className="font-bold text-slate-900 text-sm">Information We Collect</h4>
            <p>
              Name, email, verified M-Pesa phone number, session timestamp logs, and language learning preferences.
            </p>
            <h4 className="font-bold text-slate-900 text-sm">Use of Data</h4>
            <p>
              Data is used exclusively to facilitate conversation matching, verify teaching duration, disburse M-Pesa payouts, and maintain platform security. We never sell your personal information to third parties.
            </p>
          </div>
        </div>
      )}

      {/* Page: Report Abuse */}
      {page === 'report-abuse' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-slate-700">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">Trust & Moderation</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Report a Safety Issue or Abuse</h1>
            <p className="text-sm text-slate-500 mt-1">
              Promptly report scams, harassment, off-platform solicitations, or inappropriate behavior.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
            <p>
              Our Trust & Safety team monitors reports 24/7. All reports are confidential and investigated with high priority.
            </p>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
              <h4 className="font-bold text-amber-900 mb-2">How to Report an Incident</h4>
              <p className="text-xs text-amber-900/90 leading-relaxed mb-4">
                During any active or past session, click the shield / report icon inside the chat header. You can also file a direct report using the button below.
              </p>
              {onOpenReportModal && (
                <button
                  onClick={onOpenReportModal}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Open Incident Report Form
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
