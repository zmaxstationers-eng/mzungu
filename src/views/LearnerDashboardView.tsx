import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  MessageSquare, 
  Star, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Session, User } from '../types';

interface LearnerDashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenSession: (session: Session) => void;
}

export const LearnerDashboardView: React.FC<LearnerDashboardViewProps> = ({
  onNavigate,
  onOpenSession
}) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [recommendedTeachers, setRecommendedTeachers] = useState<User[]>([]);

  useEffect(() => {
    if (user) {
      api.getUserSessions(user.id).then(setSessions);
      api.getTeachers({ online: true }).then((list) => setRecommendedTeachers(list.slice(0, 3)));
    }
  }, [user?.id]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-xs"
          />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Learner Portal</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              Karibu tena, {user.displayName}!
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Current Level: <strong className="text-slate-800">{user.kiswahiliLevel}</strong> • {user.completedHours} hrs practiced
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('teachers')}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Search className="w-4 h-4" />
          <span>Find Available Teachers</span>
        </button>
      </div>

      {/* Learning Goals Card */}
      {user.learningGoals && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-xs text-emerald-900 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-sm font-extrabold text-emerald-950">Your Learning Goals:</strong>
            <p className="mt-1 text-emerald-900/90 leading-relaxed">{user.learningGoals}</p>
          </div>
        </div>
      )}

      {/* Grid: Sessions History & Online Teachers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Previous & Active Sessions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Your Practice Sessions</h2>
            <button onClick={() => onNavigate('chat')} className="text-xs font-bold text-emerald-700 hover:underline">
              Go to Active Chat
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              You have not started a conversation session yet. Browse our verified hosts to begin!
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onOpenSession(s)}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:shadow-xs transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={s.teacherAvatar}
                      alt={s.teacherName}
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{s.teacherName}</span>
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
                    <span className="text-xs font-bold text-slate-800 block">
                      {Math.floor(s.verifiedSeconds / 60)} mins
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recommended Online Hosts */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Hosts Online Now</h2>
            <button onClick={() => onNavigate('teachers')} className="text-xs font-bold text-emerald-700 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recommendedTeachers.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={t.avatar} alt={t.displayName} className="w-11 h-11 rounded-xl object-cover" />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm">{t.fullName}</span>
                      {t.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{t.rating.toFixed(1)}</span>
                      <span>•</span>
                      <span>{t.country}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('teachers')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg transition cursor-pointer"
                >
                  Chat
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
