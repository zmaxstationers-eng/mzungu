import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Wallet, 
  ShieldCheck, 
  Menu, 
  X, 
  LogIn, 
  UserPlus, 
  CheckCircle, 
  Sparkles,
  ChevronDown,
  Bot
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenActivation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenActivation }) => {
  const { user, switchDemoUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const demoUsers = [
    { id: 'user_teacher_1', label: 'Amani W. (Teacher • KSh 3,250)', role: 'teacher', badge: 'Active Host' },
    { id: 'user_teacher_3', label: 'Zawadi C. (Teacher • Unactivated)', role: 'teacher', badge: 'Pending Fee' },
    { id: 'user_learner_1', label: 'Sarah (Learner • UK Expat)', role: 'learner', badge: 'Learner' },
    { id: 'user_admin_1', label: 'David K. (Platform Admin)', role: 'admin', badge: 'Admin Desk' }
  ];

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top Banner with Demo Switcher */}
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" /> Funza Mzungu Platform
          </span>
          <span className="hidden sm:inline text-emerald-300/60">|</span>
          <span className="hidden sm:inline text-emerald-200">
            Teachers earn KSh 500/hr • Verified Kenyan Hosts
          </span>
        </div>

        {/* Demo Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
            className="flex items-center gap-1.5 bg-emerald-800/90 hover:bg-emerald-700 text-white px-2.5 py-0.5 rounded-full text-xs font-medium transition cursor-pointer border border-emerald-700"
          >
            <span>Persona:</span>
            <span className="font-semibold text-amber-300">
              {user ? user.displayName : 'Guest'}
            </span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 bg-emerald-950/60 rounded text-emerald-200">
              {user?.role || 'Visitor'}
            </span>
            <ChevronDown className="w-3 h-3 text-emerald-300" />
          </button>

          {demoDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-72 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Switch Test Account
              </div>
              {demoUsers.map((du) => (
                <button
                  key={du.id}
                  onClick={() => {
                    switchDemoUser(du.id);
                    setDemoDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition ${
                    user?.id === du.id ? 'bg-emerald-50/80 font-semibold text-emerald-900' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div>{du.label}</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {du.badge}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              FM
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-none">
                FUNZA <span className="text-emerald-700">MZUNGU</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mt-0.5">
                Kiswahili Learning & Hosts
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentTab === 'home' ? 'text-emerald-800 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('teachers')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentTab === 'teachers' ? 'text-emerald-800 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Find Teachers
            </button>
            <button
              onClick={() => handleNav('ai-learners')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'ai-learners' ? 'text-emerald-800 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Learners</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                30
              </span>
            </button>
            <button
              onClick={() => handleNav('lessons')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentTab === 'lessons' ? 'text-emerald-800 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Kiswahili Lessons
            </button>
            <button
              onClick={() => handleNav('how-it-works')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentTab === 'how-it-works' ? 'text-emerald-800 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => handleNav('pricing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentTab === 'pricing' ? 'text-emerald-800 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Pricing
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => handleNav('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'admin' ? 'text-purple-800 bg-purple-50 font-semibold' : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Desk
              </button>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Active Session / Chat button */}
                <button
                  onClick={() => handleNav('chat')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition cursor-pointer ${
                    currentTab === 'chat' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Chat & Session</span>
                </button>

                {/* Teacher specific Dashboard & Withdrawal */}
                {user.role === 'teacher' && (
                  <button
                    onClick={() => handleNav('teacher-dashboard')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition cursor-pointer ${
                      currentTab === 'teacher-dashboard' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-emerald-700" />
                    <span>Dashboard (KSh {user.availableBalance.toLocaleString()})</span>
                  </button>
                )}

                {/* Learner Dashboard */}
                {user.role === 'learner' && (
                  <button
                    onClick={() => handleNav('learner-dashboard')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition cursor-pointer ${
                      currentTab === 'learner-dashboard' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>My Learning</span>
                  </button>
                )}

                {/* User avatar & role indicator */}
                <div 
                  onClick={() => handleNav(user.role === 'teacher' ? 'teacher-dashboard' : 'learner-dashboard')}
                  className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('signup')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition cursor-pointer"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => handleNav('become-teacher')}
                  className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition cursor-pointer"
                >
                  Earn KSh 500/hr
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <button
                onClick={() => handleNav('chat')}
                className="p-2 text-emerald-800 bg-emerald-50 rounded-lg"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 animate-in fade-in">
          <div className="space-y-1">
            <button
              onClick={() => handleNav('home')}
              className={`w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                currentTab === 'home' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('teachers')}
              className={`w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                currentTab === 'teachers' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700'
              }`}
            >
              Find Kiswahili Teachers
            </button>
            <button
              onClick={() => handleNav('ai-learners')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-base font-medium flex items-center justify-between ${
                currentTab === 'ai-learners' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Learners Directory</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                30 Active
              </span>
            </button>
            <button
              onClick={() => handleNav('lessons')}
              className={`w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                currentTab === 'lessons' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700'
              }`}
            >
              Kiswahili Lessons & Phrases
            </button>
            <button
              onClick={() => handleNav('how-it-works')}
              className={`w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                currentTab === 'how-it-works' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => handleNav('become-teacher')}
              className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-emerald-700 bg-emerald-50"
            >
              Become a Teacher (Earn KSh 500/hr)
            </button>
            <button
              onClick={() => handleNav('pricing')}
              className={`w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                currentTab === 'pricing' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700'
              }`}
            >
              Pricing & Terms
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => handleNav('admin')}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-purple-700 bg-purple-50"
              >
                Admin Panel Desk
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
                  <img src={user.avatar} alt={user.displayName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{user.fullName}</div>
                    <div className="text-xs text-slate-500 capitalize">{user.role} • {user.kiswahiliLevel}</div>
                  </div>
                </div>

                {user.role === 'teacher' && (
                  <button
                    onClick={() => handleNav('teacher-dashboard')}
                    className="w-full py-2.5 px-3 bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Teacher Dashboard (KSh {user.availableBalance.toLocaleString()})
                  </button>
                )}

                {user.role === 'learner' && (
                  <button
                    onClick={() => handleNav('learner-dashboard')}
                    className="w-full py-2.5 px-3 bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Learner Dashboard
                  </button>
                )}

                <button
                  onClick={() => handleNav('chat')}
                  className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Active Messages & Session
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="py-2.5 text-center text-sm font-medium text-slate-700 border border-slate-200 rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('signup')}
                  className="py-2.5 text-center text-sm font-semibold text-white bg-emerald-700 rounded-lg shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
