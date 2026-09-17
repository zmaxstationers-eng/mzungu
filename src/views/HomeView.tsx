import React from 'react';
import { 
  Users, 
  MessageSquare, 
  Wallet, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  Globe, 
  Clock, 
  HeartHandshake,
  AlertCircle,
  Bot
} from 'lucide-react';
import { User } from '../types';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  featuredTeachers: User[];
  onSelectTeacher: (teacher: User) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  featuredTeachers,
  onSelectTeacher
}) => {
  const speakPhrase = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'sw-KE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-16 pb-16 animate-in fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-200 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Authentic African Language Exchange</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Learn Kiswahili From <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy">Real People</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Practice Kiswahili through real conversations with fluent speakers. 
              Native hosts earn <strong className="text-slate-900 font-bold">KSh 500 per verified teaching hour</strong> directly via M-Pesa.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('teachers')}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-800/20 transition cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Find a Teacher</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('become-teacher')}
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-base rounded-xl border-2 border-emerald-700/30 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Become a Teacher</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-extrabold">
                  Earn KSh 500/hr
                </span>
              </button>
            </div>

            {/* Critical Ethics & Trust Banner */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Safe & Transparent:</strong> Earnings depend on completed eligible sessions. Activation does not guarantee income or session availability.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Android Mobile Quick Actions Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('teachers')}
            className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-emerald-500 active:scale-95 transition text-left cursor-pointer flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs sm:text-sm text-slate-900">Find Teachers</div>
              <div className="text-[11px] text-slate-500">Native Kenyan hosts</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('ai-learners')}
            className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-emerald-500 active:scale-95 transition text-left cursor-pointer flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-2">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs sm:text-sm text-slate-900">Learners</div>
              <div className="text-[11px] text-slate-500">30 Practice partners</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('lessons')}
            className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-emerald-500 active:scale-95 transition text-left cursor-pointer flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs sm:text-sm text-slate-900">Lessons</div>
              <div className="text-[11px] text-slate-500">Phrases & Sheng slang</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('become-teacher')}
            className="p-3.5 bg-white rounded-2xl border border-emerald-200 shadow-sm hover:border-emerald-500 active:scale-95 transition text-left cursor-pointer flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs sm:text-sm text-emerald-900">Earn KSh 500/hr</div>
              <div className="text-[11px] text-emerald-700">M-Pesa daily payouts</div>
            </div>
          </button>
        </div>
      </section>

      {/* Interactive Phrase Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Quick Kenyan Swahili</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Start Speaking Right Now</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Click the audio icon to listen to natural pronunciation.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { swahili: 'Habari yako?', english: 'How are you?', phonetic: 'ha-BAH-ree YAH-koh', type: 'Polite Greeting' },
            { swahili: 'Niko poa sana!', english: 'I am doing very well!', phonetic: 'NEE-koh POH-ah SAH-nah', type: 'Common Reply' },
            { swahili: 'Hii ni bei gani?', english: 'How much is this?', phonetic: 'HEE nee BAY GAH-nee', type: 'Shopping / Market' },
            { swahili: 'Asante sana rafiki!', english: 'Thank you very much friend!', phonetic: 'ah-SAHN-teh SAH-nah rah-FEE-kee', type: 'Courtesy' }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  {item.type}
                </span>
                <button
                  onClick={() => speakPhrase(item.swahili)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                  title="Listen to pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition">
                {item.swahili}
              </h3>
              <p className="text-xs font-mono text-emerald-700 mt-0.5">{item.phonetic}</p>
              <p className="text-xs text-slate-600 mt-2 font-medium">"{item.english}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Verified Teachers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Verified Native Speakers</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Featured Kiswahili Hosts</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Connect directly with vetted teachers ready to chat.</p>
          </div>
          <button
            onClick={() => onNavigate('teachers')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Teachers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTeachers.slice(0, 3).map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={teacher.avatar}
                      alt={teacher.displayName}
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500/20"
                    />
                    {teacher.isOnline && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 text-base truncate">{teacher.fullName}</h3>
                      {teacher.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Host" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{teacher.country}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {teacher.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-700 mt-1">
                      KSh 500 / hr
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {teacher.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {teacher.languagesSpoken.slice(0, 2).map((lang, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {lang}
                    </span>
                  ))}
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                    {teacher.kiswahiliLevel}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectTeacher(teacher)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    onSelectTeacher(teacher);
                    onNavigate('chat');
                  }}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Start Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practice With AI Learners Prominent Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-800/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3.5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold tracking-wide border border-emerald-400/30">
                <Bot className="w-4 h-4 text-emerald-400" /> Interactive Language Simulation
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Practice With Learners 🌍
              </h2>

              <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
                "Not ready to chat with a human teacher? Practice your Kiswahili with our conversation partners first."
              </p>

              <p className="text-slate-400 text-xs leading-relaxed">
                Explore 30 international student profiles from the UK, USA, Germany, France, Australia, and beyond. Practice explaining grammar, correcting pronunciation, and discussing Kenyan culture in an unhurried, pressure-free chat.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
                <button
                  onClick={() => onNavigate('ai-learners')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Meet Learners</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <span className="text-[11px] text-slate-400">
                  Free practice • 30 global profiles • 0 pressure
                </span>
              </div>
            </div>

            {/* Quick visual preview of sample profiles */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              {[
                { name: 'Emily', country: 'United States', flag: '🇺🇸', level: 'Beginner', quote: 'Can you teach me how to say "How are you?" in Swahili?' },
                { name: 'James', country: 'United Kingdom', flag: '🇬🇧', level: 'Curious Traveler', quote: 'I am visiting Nairobi soon. How do I greet elders politely?' },
                { name: 'Daniel', country: 'Germany', flag: '🇩🇪', level: 'African Culture', quote: 'What does "Harambee" mean in daily Kenyan life?' },
              ].map((partner, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onNavigate('ai-learners')}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition hover:border-emerald-500/60 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-lg">
                    {partner.flag}
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <span>{partner.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                        Learner
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 italic truncate max-w-[220px]">
                      "{partner.quote}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Simple & Verified Process</span>
            <h2 className="text-3xl font-extrabold mt-1">How Funza Mzungu Works</h2>
            <p className="text-slate-400 text-sm mt-2">Connecting global Swahili learners with fluent African speakers safely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* For Learners */}
            <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-white">For International Learners</h3>
              </div>

              <div className="space-y-4">
                {[
                  { step: '1', title: 'Create your free account', desc: 'Select your native language, current Kiswahili level, and learning goals.' },
                  { step: '2', title: 'Browse verified teachers', desc: 'Filter by availability, native dialect, Sheng vs. Coastal Swahili, and ratings.' },
                  { step: '3', title: 'Start a verified conversation', desc: 'Chat in real-time with an active session timer. Use voice/video when ready.' },
                  { step: '4', title: 'Practice authentic topics', desc: 'Ask about Nairobi street life, safari terminology, polite greetings, or market bargaining.' },
                  { step: '5', title: 'Rate your host', desc: 'Leave an honest review to help maintain high quality and trusted hosts.' }
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">{s.title}</strong>
                      <span className="text-slate-400">{s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Teachers */}
            <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-white">For Kiswahili Hosts</h3>
              </div>

              <div className="space-y-4">
                {[
                  { step: '1', title: 'Sign up as a teacher', desc: 'Enter your profile, bio, languages spoken, and Safaricom M-Pesa number.' },
                  { step: '2', title: 'Complete one-time activation', desc: 'Pay the KSh 600 administrative verification fee to activate your verified host badge.' },
                  { step: '3', title: 'Set your availability & topics', desc: 'Toggle online status when you are free to accept conversation requests.' },
                  { step: '4', title: 'Chat with international learners', desc: 'Provide friendly, patient guidance and practice through text and optional calls.' },
                  { step: '5', title: 'Earn KSh 500 per verified hour', desc: 'Server timestamps record exact completed minutes (e.g. 30m = KSh 250, 60m = KSh 500).' },
                  { step: '6', title: 'Withdraw directly to M-Pesa', desc: 'Request cashouts once your balance reaches the minimum threshold of KSh 500.' }
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">{s.title}</strong>
                      <span className="text-slate-400">{s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Community Pledge */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Trust & Moderation</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 mb-4">
              Dedicated to Genuine Education & Zero Abuse
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed mb-6">
              Funza Mzungu is built strictly for language and cultural learning. We prohibit harassment, financial scams, sexual exploitation, or solicitation of illegal activity. Adult 18+ policy strictly enforced with one-click report buttons in every session.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('community-guidelines')}
                className="px-5 py-2.5 bg-white text-emerald-950 font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-50 transition cursor-pointer"
              >
                Community Guidelines
              </button>
              <button
                onClick={() => onNavigate('report-abuse')}
                className="px-5 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition cursor-pointer border border-emerald-700"
              >
                Report Safety Issue
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
