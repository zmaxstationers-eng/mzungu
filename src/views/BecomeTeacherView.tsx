import React from 'react';
import { 
  Wallet, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  Smartphone,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BecomeTeacherViewProps {
  onNavigate: (tab: string) => void;
  onOpenActivation?: () => void;
}

export const BecomeTeacherView: React.FC<BecomeTeacherViewProps> = ({
  onNavigate,
  onOpenActivation
}) => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-in fade-in">
      {/* Top Hero Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl">
        <div className="max-w-2xl relative z-10 space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold border border-emerald-600">
            <Sparkles className="w-3.5 h-3.5" /> Official Host Program
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Share Your Kiswahili. <br />
            <span className="text-emerald-300">Earn KSh 500 Per Hour.</span>
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Connect with international students, expats, and travelers who want to practice conversational Swahili. Earn money from your smartphone through verified chat and video practice sessions.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {user?.role === 'teacher' ? (
              <button
                onClick={() => onNavigate('teacher-dashboard')}
                className="px-6 py-3 bg-white text-emerald-900 font-bold text-sm rounded-xl shadow-md hover:bg-emerald-50 transition cursor-pointer flex items-center gap-2"
              >
                <span>Go to Teacher Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('signup')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <span>Apply to Host Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onNavigate('how-it-works')}
              className="px-6 py-3 bg-emerald-950/60 hover:bg-emerald-950 text-white font-semibold text-sm rounded-xl border border-emerald-700 transition cursor-pointer"
            >
              Learn More
            </button>
          </div>

          <div className="bg-emerald-950/80 border border-emerald-700/70 rounded-2xl p-4 text-xs text-emerald-200 flex items-start gap-2.5 mt-4">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <p>
              <strong>Important Platform Notice:</strong> Funza Mzungu is an educational language marketplace. Earnings depend on completed eligible sessions. Activation does not guarantee income or session availability.
            </p>
          </div>
        </div>
      </div>

      {/* 6 Step Host Journey */}
      <section>
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">The Path to Earning</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">How Teacher Hosting Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Sign Up Profile', desc: 'Create your teacher profile, describe your Kiswahili background (Sheng, Sanifu, Coastal), and list spoken languages.' },
            { step: '2', title: 'Complete Activation', desc: 'Pay the one-time KSh 600 administrative verification fee to activate your verified host badge and listing.' },
            { step: '3', title: 'Set Your Schedule', desc: 'Set days and time slots when you are available. Toggle online status anytime to receive instant chat requests.' },
            { step: '4', title: 'Chat With Learners', desc: 'Hold guided conversations on daily greetings, market bargains, or Kenyan culture with international students.' },
            { step: '5', title: 'Earn KSh 500 / Hour', desc: 'Accurate server timers measure verified minutes (30 mins = KSh 250, 60 mins = KSh 500). No guesswork.' },
            { step: '6', title: 'Withdraw via M-Pesa', desc: 'Request withdrawals directly to your Safaricom phone number once your balance reaches KSh 500.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center mb-3">
                {item.step}
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Transparent KSh 600 Activation Fee Breakdown */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Account Activation Policy</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Transparent KSh 600 Activation Fee
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              We believe in complete transparency. Here is exactly what the fee entails before you register:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What It Covers
              </h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>• Verification of identity and phone credentials</li>
                <li>• Public listing in the teacher search directory</li>
                <li>• Access to learner chat session matching</li>
                <li>• Automated M-Pesa payout integration</li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Key Terms & Disclosures
              </h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>• <strong>Non-refundable:</strong> Covers administrative onboarding and identity vetting.</li>
                <li>• <strong>Not an investment:</strong> It does not generate passive interest or dividends.</li>
                <li>• <strong>No guaranteed income:</strong> Earnings depend strictly on completing active sessions.</li>
                <li>• <strong>Standard rate:</strong> KSh 500 per verified completed teaching hour.</li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('signup')}
              className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              Sign Up As Kiswahili Host
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
