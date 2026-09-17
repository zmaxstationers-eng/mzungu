import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  ShieldAlert, 
  Clock, 
  Coins, 
  Sparkles, 
  AlertCircle, 
  CheckCheck, 
  StopCircle, 
  Play, 
  Languages, 
  Info,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Session, Message, User } from '../types';

interface ChatViewProps {
  initialSession?: Session | null;
  targetTeacher?: User | null;
  onOpenReport: (reportedUserId: string, reportedUserName: string, sessionId?: string) => void;
  onSessionEnded?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  initialSession,
  targetTeacher,
  onOpenReport,
  onSessionEnded
}) => {
  const { user, refreshUser } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(initialSession || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const [completionSummary, setCompletionSummary] = useState<{ earned: number; duration: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load all sessions for current user
  const loadSessions = async () => {
    if (!user) return;
    try {
      const list = await api.getUserSessions(user.id);
      setSessions(list);

      // If no activeSession is selected, select the first active or latest one
      if (!activeSession && list.length > 0) {
        const found = list.find((s) => s.status === 'active') || list[0];
        setActiveSession(found);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [user?.id]);

  // If a targetTeacher was passed in and no matching active session exists, start or find it
  useEffect(() => {
    if (targetTeacher && user) {
      const existing = sessions.find(s => s.teacherId === targetTeacher.id && s.status === 'active');
      if (existing) {
        setActiveSession(existing);
      } else if (user.role === 'learner') {
        // Create new session with this teacher
        api.requestSession(targetTeacher.id, user.id, 'Everyday Conversation & Greetings')
          .then((newSess) => {
            setSessions(prev => [newSess, ...prev]);
            setActiveSession(newSess);
          }).catch(err => {
            console.error('Failed to create session with target teacher', err);
          });
      }
    }
  }, [targetTeacher?.id]);

  // Sync messages and timer when activeSession changes
  useEffect(() => {
    if (!activeSession) return;

    // Load messages
    api.getMessages(activeSession.id).then(setMessages);

    // Calculate initial timer based on startedAt if active
    if (activeSession.status === 'active') {
      const startMs = new Date(activeSession.startedAt).getTime();
      const nowMs = Date.now();
      const elapsed = Math.max(0, Math.floor((nowMs - startMs) / 1000));
      setTimerSeconds(elapsed);
    } else {
      setTimerSeconds(activeSession.verifiedSeconds);
    }
  }, [activeSession?.id, activeSession?.status]);

  // Real-time local timer tick for active sessions
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'active') return;

    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession?.id, activeSession?.status]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hrs = Math.floor(mins / 60);
    const displayMins = mins % 60;
    return `${hrs.toString().padStart(2, '0')}:${displayMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // KSh 500 per hour = 500 / 3600 = ~0.1388 KSh/sec
  const estimatedEarnedKsh = ((timerSeconds / 3600) * 500).toFixed(2);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim() || !activeSession || !user) return;

    const textToSend = inputMsg;
    setInputMsg('');

    try {
      const newMsg = await api.sendMessage(activeSession.id, user.id, textToSend);
      setMessages(prev => [...prev, newMsg]);

      // If chatting with a teacher in demo, simulate a quick responsive Kiswahili reply after 1.5s
      const isUserLearner = user.role === 'learner';
      if (isUserLearner && activeSession.status === 'active') {
        setTimeout(async () => {
          const swahiliReplies = [
            'Nzuri sana! Unazungumza Kiswahili vizuri sana.',
            'Kabisa rafiki yangu! Je, ungependa kujifunza maneno mengine?',
            'Asante sana! Neno hilo hutumika mara kwa mara hapa Nairobi.',
            'Safi sana! Hebu tujaribu sentensi nyingine fupi.'
          ];
          const randomReply = swahiliReplies[Math.floor(Math.random() * swahiliReplies.length)];
          const autoMsg = await api.sendMessage(activeSession.id, activeSession.teacherId, randomReply);
          setMessages(prev => [...prev, autoMsg]);
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleEndSession = async () => {
    if (!activeSession || !user) return;
    setEndingSession(true);
    try {
      const res = await api.endSession(activeSession.id);
      setActiveSession(res.session);
      setCompletionSummary({
        earned: res.eligibleEarnings,
        duration: res.session.verifiedSeconds
      });
      await refreshUser();
      if (onSessionEnded) onSessionEnded();
    } catch (e: any) {
      alert(e.message || 'Failed to end session');
    } finally {
      setEndingSession(false);
    }
  };

  const isTeacher = user?.role === 'teacher';
  const partnerName = isTeacher ? activeSession?.learnerName : activeSession?.teacherName;
  const partnerAvatar = isTeacher ? activeSession?.learnerAvatar : activeSession?.teacherAvatar;
  const partnerId = isTeacher ? activeSession?.learnerId : activeSession?.teacherId;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-6 h-[calc(100vh-4.5rem)] md:h-[calc(100vh-5rem)] flex flex-col animate-in fade-in">
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: Session / Conversation List (hidden on mobile if activeSession is open) */}
        <div className={`w-full md:w-80 border-r border-slate-200 flex-col bg-slate-50/50 ${
          activeSession ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Conversations</h3>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {sessions.filter(s => s.status === 'active').length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {sessions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations yet. Select a teacher or learner to begin!
              </div>
            ) : (
              sessions.map((s) => {
                const isSelected = activeSession?.id === s.id;
                const otherName = isTeacher ? s.learnerName : s.teacherName;
                const otherAvatar = isTeacher ? s.learnerAvatar : s.teacherAvatar;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSession(s);
                      setCompletionSummary(null);
                    }}
                    className={`p-4 flex items-center gap-3 cursor-pointer transition active:bg-emerald-100/50 ${
                      isSelected ? 'bg-emerald-50/80 border-r-4 border-emerald-700' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <img src={otherAvatar} alt={otherName} className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm truncate">{otherName}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          s.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{s.topic}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Chat Window */}
        {activeSession ? (
          <div className={`flex-1 flex-col bg-white ${
            activeSession ? 'flex' : 'hidden md:flex'
          }`}>
            {/* Session Top Bar: Partner Details, Timer, Earnings, Actions */}
            <div className="p-3 sm:p-4 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2.5 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Android Back Button to return to Conversations list on phone */}
                <button
                  onClick={() => setActiveSession(null)}
                  className="md:hidden p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                  title="Back to conversation list"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative shrink-0">
                  <img
                    src={partnerAvatar}
                    alt={partnerName}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover ring-2 ring-emerald-500/30"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{partnerName}</h3>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">
                      {isTeacher ? 'Learner' : 'Teacher'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <Languages className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{activeSession.topic}</span>
                  </p>
                </div>
              </div>

              {/* Verified Timer & Estimated Earnings */}
              <div className="flex items-center gap-2">
                <div className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                  <div>
                    <span className="text-[9px] font-bold uppercase text-emerald-800 block leading-none">
                      {activeSession.status === 'active' ? 'Session' : 'Done'}
                    </span>
                    <span className="font-mono font-extrabold text-xs sm:text-sm text-slate-900">
                      {formatTimer(timerSeconds)}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <div>
                    <span className="text-[9px] font-bold uppercase text-slate-500 block leading-none">
                      {isTeacher ? 'Earned' : 'Rate'}
                    </span>
                    <span className="font-mono font-extrabold text-xs sm:text-sm text-emerald-800">
                      KSh {estimatedEarnedKsh}
                    </span>
                  </div>
                </div>

                {/* Report User Trigger */}
                <button
                  onClick={() => onOpenReport(partnerId || '', partnerName || 'User', activeSession.id)}
                  className="p-2 sm:p-2.5 rounded-xl text-red-500 hover:bg-red-50 border border-red-200 transition cursor-pointer"
                  title="Report safety issue"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>

                {/* End Session Button if active */}
                {activeSession.status === 'active' && (
                  <button
                    onClick={handleEndSession}
                    disabled={endingSession}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span className="hidden xs:inline">{endingSession ? 'Ending...' : 'End'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Completion Modal / Notice banner if ended */}
            {completionSummary && (
              <div className="bg-emerald-600 text-white p-4 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <div>
                    <strong>Session Verified and Completed!</strong> Duration:{' '}
                    {Math.floor(completionSummary.duration / 60)} minutes • Total Host Credited: KSh{' '}
                    {Math.round(completionSummary.earned)}
                  </div>
                </div>
                <button
                  onClick={() => setCompletionSummary(null)}
                  className="text-white/80 hover:text-white font-bold underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Chat Messages Flow */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
              {/* Trust & Safety Warning Notice */}
              <div className="max-w-md mx-auto bg-amber-50/80 border border-amber-200 text-amber-900 rounded-xl p-2.5 text-[11px] text-center flex items-center justify-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Keep all conversations educational and polite. Off-platform financial requests are strictly prohibited.</span>
              </div>

              {messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                        isMe
                          ? 'bg-emerald-700 text-white rounded-tr-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Swahili Phrase Suggestions */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-600">
              <span className="font-semibold text-slate-400 shrink-0">Quick Swahili:</span>
              {[
                'Habari yako?',
                'Niko poa, asante!',
                'Hii inaitwaje kwa Kiswahili?',
                'Tafadhali rudia polepole.',
                'Hiyo ni sawa kabisa!'
              ].map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => setInputMsg(phrase)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg whitespace-nowrap transition cursor-pointer"
                >
                  {phrase}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type a message in Kiswahili or English..."
                className="flex-1 text-sm border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-slate-50/50"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim()}
                className="p-2.5 sm:px-5 sm:py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white text-slate-400">
            <Languages className="w-14 h-14 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-800 text-base">Select or Start a Conversation</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Choose an existing chat from the left sidebar or browse teachers to begin speaking Kiswahili.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
