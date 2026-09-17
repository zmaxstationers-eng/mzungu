import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Smartphone, 
  Languages, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthViewProps {
  initialMode?: 'login' | 'signup-teacher' | 'signup-learner';
  onAuthSuccess: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onAuthSuccess
}) => {
  const { login, signup, switchDemoUser } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup-teacher' | 'signup-learner'>(initialMode);
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form states
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [kiswahiliLevel, setKiswahiliLevel] = useState('Native / Fluent');
  const [bio, setBio] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeActivationFee, setAgreeActivationFee] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Community Guidelines.');
      return;
    }

    const isTeacher = tab === 'signup-teacher';
    if (isTeacher && !agreeActivationFee) {
      setError('You must acknowledge the KSh 600 host activation fee terms.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        email,
        password,
        fullName,
        displayName: displayName || fullName.split(' ')[0],
        role: isTeacher ? 'teacher' : 'learner',
        phoneNumber: phone,
        mpesaNumber: isTeacher ? phone : undefined,
        country,
        kiswahiliLevel,
        languagesSpoken: isTeacher ? ['Kiswahili', 'English'] : ['English'],
        bio: bio || (isTeacher ? 'Native Kiswahili speaker enthusiastic about conversational practice.' : 'Excited to practice everyday Swahili!'),
        learningGoals: !isTeacher ? 'Improve conversational fluency and daily vocabulary.' : undefined
      });
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (userId: string) => {
    switchDemoUser(userId);
    onAuthSuccess();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md">
        {/* Title Header */}
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Funza Mzungu Access</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {tab === 'login' ? 'Welcome Back' : tab === 'signup-teacher' ? 'Apply as Kiswahili Host' : 'Join as Swahili Learner'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {tab === 'login' ? 'Access your conversation dashboard and chat rooms' : 'Create your free account in seconds'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              tab === 'login' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup-teacher'); setError(''); }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              tab === 'signup-teacher' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Host (Teach)
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup-learner'); setError(''); }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              tab === 'signup-learner' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Learner
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form area */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. amani@funzamzungu.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Logging In...' : 'Log In to Funza Mzungu'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Amani Wanjiku"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Display / First Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Amani"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {tab === 'signup-teacher' ? 'M-Pesa Phone Number' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712345678"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden bg-white text-slate-800"
                >
                  <option value="Kenya">Kenya</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Canada">Canada</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {tab === 'signup-teacher' && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2 text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Teacher Activation Policy (KSh 600)</span>
                </div>
                <p className="leading-relaxed">
                  Teachers pay a one-time administrative fee of <strong>KSh 600</strong> to activate their profile and verified host badge. Payouts are made to your registered M-Pesa number at <strong>KSh 500 per verified completed hour</strong>.
                </p>
                <label className="flex items-start gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeActivationFee}
                    onChange={(e) => setAgreeActivationFee(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800">
                    I understand the non-refundable KSh 600 fee applies upon profile verification, and that earnings depend strictly on completing active sessions.
                  </span>
                </label>
              </div>
            )}

            <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500"
              />
              <span>
                I agree to the <strong>Terms of Service</strong>, <strong>Adult 18+ policy</strong>, and <strong>Zero Tolerance Community Safety Guidelines</strong>.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Registering Account...' : 'Complete Sign Up'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 1-Click Quick Demo Sign In Box */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Quick 1-Click Demo Profiles
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('teacher-1')}
              className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-left transition cursor-pointer"
            >
              <div className="font-bold text-xs text-emerald-900">Amani (Host)</div>
              <div className="text-[10px] text-emerald-700">Verified Teacher • KSh 500/hr</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('learner-1')}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition cursor-pointer"
            >
              <div className="font-bold text-xs text-slate-900">David (Learner)</div>
              <div className="text-[10px] text-slate-500">Student from USA</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin-1')}
              className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-left transition cursor-pointer"
            >
              <div className="font-bold text-xs text-purple-900">Admin Staff</div>
              <div className="text-[10px] text-purple-700">Audit & M-Pesa Payouts</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
