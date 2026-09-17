import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  ArrowLeft, 
  Send, 
  Smile, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Clock, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  RefreshCw,
  Award,
  ChevronDown,
  Info
} from 'lucide-react';
import { AILearnerProfile, AIMessage, AILearningProgress } from '../types';
import { AI_CONVERSATION_TOPICS } from '../data/aiLearners';
import { api } from '../services/api';

interface AIChatViewProps {
  learner: AILearnerProfile;
  onBack: () => void;
  onSelectAnotherLearner?: () => void;
}

export const AIChatView: React.FC<AIChatViewProps> = ({
  learner,
  onBack,
  onSelectAnotherLearner
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string>('general');
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [showProgressDrawer, setShowProgressDrawer] = useState(false);
  const [showLanguageHelper, setShowLanguageHelper] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Active session learning progress state
  const [progress, setProgress] = useState<AILearningProgress>({
    wordsLearned: ['Jambo', 'Habari', 'Asante'],
    phrasesPracticed: 3,
    conversationTimeSeconds: 0,
    correctionsCount: 0,
    topicsDiscussed: ['Greetings'],
    currentLevel: learner.kiswahiliLevel === 'Intermediate' ? 'Intermediate' : learner.kiswahiliLevel === 'Elementary' ? 'Elementary' : 'Beginner'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize opening message
  useEffect(() => {
    setMessages([
      {
        id: 'msg-init',
        sender: 'ai',
        text: learner.starterMessage,
        timestamp: Date.now()
      }
    ]);
  }, [learner.id]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async (textOverride?: string) => {
    const text = (textOverride || inputText).trim();
    if (!text || isSending) return;

    setInputText('');
    setShowEmojiPicker(false);
    setShowLanguageHelper(false);

    const userMessage: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsSending(true);

    try {
      const res = await api.sendAIChatMessage({
        profile: learner,
        messages: updatedMessages.map(m => ({ sender: m.sender, text: m.text })),
        topic: currentTopic
      });

      const aiReply: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.reply,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiReply]);

      // Update learning progress dynamically
      setProgress(prev => {
        const newWords = res.wordsLearned || [];
        const combinedWords = Array.from(new Set([...prev.wordsLearned, ...newWords]));
        const correctionsCount = prev.correctionsCount + (res.isCorrection ? 1 : 0);
        const phrasesPracticed = prev.phrasesPracticed + 1;
        
        let currentLevel = prev.currentLevel;
        if (combinedWords.length >= 15) currentLevel = 'Intermediate';
        else if (combinedWords.length >= 7) currentLevel = 'Elementary';

        return {
          ...prev,
          wordsLearned: combinedWords,
          correctionsCount,
          phrasesPracticed,
          currentLevel
        };
      });
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: AIMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Samahani! I had a quick connection pause. Could you say that again? I want to continue practicing with you! 😊`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectTopic = (topic: typeof AI_CONVERSATION_TOPICS[0]) => {
    setCurrentTopic(topic.id);
    setShowTopicPicker(false);
    
    setProgress(p => ({
      ...p,
      topicsDiscussed: Array.from(new Set([...p.topicsDiscussed, topic.label]))
    }));

    handleSendMessage(`Let's practice the topic: "${topic.label}". ${topic.prompt}`);
  };

  const quickTeachingPrompts = [
    { label: 'Teach Greeting', text: 'Habari yako? It means "How are you?". You can reply "Nzuri sana" (Very good).' },
    { label: 'Teach Thanks', text: 'Asante sana means "Thank you very much". You reply "Karibu" (You are welcome).' },
    { label: 'Teach Food', text: 'Chakula means "Food". In Kenya, people love Ugali, Sukuma Wiki, and Nyama Choma.' },
    { label: 'Teach Slang (Sheng)', text: 'Nairobi Sheng slang: "Mambo?" (What\'s up?) and reply "Poa!" (Cool).' },
    { label: 'Correct Pronunciation', text: 'Good attempt! Kiswahili vowels are clean: A (ah), E (eh), I (ee), O (oh), U (oo).' },
    { label: 'Teach Directions', text: 'Njia means "Road" and Kushoto means "Left", Kulia means "Right".' },
  ];

  const quickEmojis = ['😊', '👋', '🇰🇪', '👍', '☕', '🍛', '✈️', '🦁', '🙏', '❤️', '💡', '🎉'];

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4 min-h-[calc(100vh-80px)] flex flex-col animate-in fade-in pb-20 md:pb-6">
      {/* Top Practice Session Status */}
      <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-2.5 sm:p-3 mb-2.5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-emerald-950 min-w-0">
            <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-800 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-xs sm:text-sm truncate block">Practice Session with {learner.name}</span>
              <span className="text-[11px] text-emerald-700 truncate block">
                {learner.country} • Native: {learner.nativeLanguage} • {learner.kiswahiliLevel} Level
              </span>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full shrink-0">
            Active
          </span>
        </div>
      </div>

      {/* WhatsApp/Android-Style Clean Chat Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md flex-1 flex flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="bg-slate-900 text-white px-3 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between gap-2 border-b border-slate-800">
          {/* Back & Profile Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onBack}
              className="p-2 -ml-1 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 rounded-xl transition cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Return to Learners Directory"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative shrink-0">
              <img
                src={learner.avatar}
                alt={learner.name}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-emerald-400 bg-slate-800 object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-extrabold text-sm sm:text-base text-white truncate">
                  {learner.name}
                </h2>
                <span className="text-sm">{learner.flag}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <Users className="w-2.5 h-2.5" /> Learner
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300 truncate">
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                </span>
                <span>•</span>
                <span className="text-slate-400">{learner.kiswahiliLevel}</span>
                <span>•</span>
                <span className="text-amber-300 font-mono">{formatTimer(elapsedSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowTopicPicker(!showTopicPicker)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer min-h-[36px]"
              title="Change Conversation Topic"
            >
              <span>Topic</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            <button
              onClick={() => setShowProgressDrawer(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-emerald-400 rounded-xl transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              title="View Learning Progress"
            >
              <Award className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Topic Picker Dropdown */}
        {showTopicPicker && (
          <div className="bg-slate-800 text-white border-b border-slate-700 p-3 sm:p-4 text-xs animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between font-bold text-slate-300 mb-2">
              <span>Choose a Practice Topic for {learner.name}:</span>
              <button onClick={() => setShowTopicPicker(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AI_CONVERSATION_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className={`p-2.5 rounded-xl text-left border transition cursor-pointer active:scale-95 ${
                    currentTopic === topic.id
                      ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                      : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs truncate">{topic.label}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{topic.prompt}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 bg-slate-50/60">
          {/* Welcome Intro Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center max-w-md mx-auto space-y-2 shadow-xs">
            <div className="w-12 h-12 rounded-full overflow-hidden mx-auto border-2 border-emerald-500 shadow-xs">
              <img src={learner.avatar} alt={learner.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Practice Conversation with {learner.name}
            </h3>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              "{learner.learningGoal}" • Speaks {learner.nativeLanguage}. Ask questions, explain vocabulary, or practice everyday Swahili!
            </p>
          </div>

          {/* Messages */}
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2 sm:gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <img
                    src={learner.avatar}
                    alt={learner.name}
                    className="w-8 h-8 rounded-full border border-emerald-200 bg-white p-0.5 shrink-0 self-end"
                  />
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm shadow-xs relative group ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-70 mb-1">
                    <span className="font-bold">{isUser ? 'You (Teacher)' : learner.name}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <p className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isSending && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-10">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>{learner.name} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Teaching Suggestions (Collapsible) */}
        {showLanguageHelper && (
          <div className="bg-white border-t border-slate-200 p-3 shadow-lg space-y-2 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Quick Teaching Prompts
              </span>
              <button onClick={() => setShowLanguageHelper(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {quickTeachingPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.text)}
                  className="p-2 text-left bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition cursor-pointer active:scale-95"
                >
                  <div className="font-bold text-slate-900 text-[11px]">{item.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{item.text}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Emoji Bar */}
        {showEmojiPicker && (
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex flex-wrap gap-2 text-lg">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setInputText(prev => prev + emoji)}
                className="hover:scale-125 active:scale-95 transition cursor-pointer p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Android-Friendly Message Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="bg-white border-t border-slate-200 p-2.5 sm:p-4 flex items-center gap-2"
        >
          {/* Quick Helper Button */}
          <button
            type="button"
            onClick={() => setShowLanguageHelper(!showLanguageHelper)}
            className="p-2.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 active:scale-95 rounded-xl transition cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Teaching suggestions"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 active:scale-95 rounded-xl transition cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Emojis"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Input text */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Reply to ${learner.name}...`}
            disabled={isSending}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition min-h-[44px]"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 sm:px-4 sm:py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer min-w-[44px] min-h-[44px] justify-center"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>

      {/* Learning Progress Modal */}
      {showProgressDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Session Learning Progress</h3>
              </div>
              <button
                onClick={() => setShowProgressDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3">
                <span className="block text-2xl font-extrabold text-emerald-900">
                  {progress.wordsLearned.length}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                  Words Learned
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <span className="block text-2xl font-extrabold text-slate-900">
                  {progress.phrasesPracticed}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Phrases Practiced
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <span className="block text-2xl font-extrabold text-slate-900 font-mono">
                  {formatTimer(elapsedSeconds)}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Conversation Time
                </span>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                <span className="block text-2xl font-extrabold text-amber-900">
                  {progress.correctionsCount}
                </span>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                  Corrections Given
                </span>
              </div>
            </div>

            {/* Level & Topics */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Estimated Kiswahili Level:</span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                  {progress.currentLevel}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Vocabulary Tracked During Session:</span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1">
                  {progress.wordsLearned.map((w, idx) => (
                    <span key={idx} className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md text-[11px] font-medium">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowProgressDrawer(false)}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold rounded-xl transition cursor-pointer min-h-[44px]"
            >
              Continue Practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
