import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Sparkles, 
  CheckCircle, 
  Search, 
  ArrowRight, 
  Languages, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { LearningTopic, KiswahiliPhrase } from '../types';
import { api } from '../services/api';

interface KiswahiliLessonsViewProps {
  onStartSessionWithTopic?: (topicTitle: string) => void;
}

export const KiswahiliLessonsView: React.FC<KiswahiliLessonsViewProps> = ({
  onStartSessionWithTopic
}) => {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    api.getTopics().then((data) => {
      setTopics(data);
      if (data.length > 0) {
        setSelectedTopic(data[0]);
      }
    });
  }, []);

  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'sw-KE';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyPhrase = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['All', 'Basics', 'Daily Life', 'Culture & Slang', 'Professional'];

  const filteredTopics = topics.filter(t => {
    const matchesCat = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.phrases.some(p => p.swahili.toLowerCase().includes(search.toLowerCase()) || p.english.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">East African Cultural Curriculum</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">Kiswahili Learning & Phrasebook</h1>
        <p className="text-sm text-slate-600 mt-1">
          Explore everyday topics, phonetic guides, and audio pronunciations to prepare for your conversation sessions.
        </p>
      </div>

      {/* Category filters and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search words or topics..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Topic Selector list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Available Topics</div>
          {filteredTopics.map((topic) => {
            const isSelected = selectedTopic?.id === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/10 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    {topic.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{topic.level}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{topic.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{topic.description}</p>
                <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <span>{topic.phrases.length} key phrases</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Topic Details & Phrase Cards */}
        <div className="lg:col-span-8">
          {selectedTopic ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">{selectedTopic.category} • {selectedTopic.level}</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">{selectedTopic.title}</h2>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">{selectedTopic.description}</p>
                </div>

                {onStartSessionWithTopic && (
                  <button
                    onClick={() => onStartSessionWithTopic(selectedTopic.title)}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    <span>Practice This Topic</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Phrases Grid */}
              <div className="py-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Phrasebook & Sound Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTopic.phrases.map((phrase) => (
                    <div
                      key={phrase.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-sm transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                          Kiswahili
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => copyPhrase(phrase.id, `${phrase.swahili} (${phrase.english})`)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
                            title="Copy phrase"
                          >
                            {copiedId === phrase.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => playPronunciation(phrase.swahili)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
                            title="Listen to pronunciation"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-base font-extrabold text-slate-900">{phrase.swahili}</div>
                      <div className="text-xs font-mono text-emerald-700 mt-0.5 font-medium">{phrase.phonetic}</div>
                      <div className="text-xs text-slate-700 font-semibold mt-2">"{phrase.english}"</div>

                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 leading-tight">
                        <strong>Context:</strong> {phrase.context}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
              Select a topic from the list to view phrases.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
