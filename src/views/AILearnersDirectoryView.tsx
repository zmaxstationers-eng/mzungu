import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Sparkles, 
  Search, 
  Filter, 
  Globe2, 
  MessageSquare, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  Heart, 
  ShieldAlert, 
  Award,
  Zap,
  Coffee,
  Briefcase
} from 'lucide-react';
import { AI_LEARNERS } from '../data/aiLearners';
import { AILearnerProfile } from '../types';

interface AILearnersDirectoryViewProps {
  onSelectLearner: (learner: AILearnerProfile) => void;
  onNavigateHome: () => void;
}

export const AILearnersDirectoryView: React.FC<AILearnersDirectoryViewProps> = ({
  onSelectLearner,
  onNavigateHome
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedPersonality, setSelectedPersonality] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  // Filter countries for dropdown
  const countries = useMemo(() => {
    const set = new Set(AI_LEARNERS.map(l => l.country));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filteredLearners = useMemo(() => {
    return AI_LEARNERS.filter(learner => {
      const matchesSearch = 
        learner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        learner.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        learner.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        learner.learningGoal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        learner.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLevel = selectedLevel === 'All' || learner.kiswahiliLevel === selectedLevel;
      const matchesPersonality = selectedPersonality === 'All' || learner.personality === selectedPersonality;
      const matchesCountry = selectedCountry === 'All' || learner.country === selectedCountry;

      return matchesSearch && matchesLevel && matchesPersonality && matchesCountry;
    });
  }, [searchQuery, selectedLevel, selectedPersonality, selectedCountry]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 animate-in fade-in space-y-6 sm:space-y-8 pb-20 md:pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-lg border border-emerald-800/50 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wide border border-emerald-400/30">
            <Users className="w-3.5 h-3.5" /> 30 International Conversation Partners
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Learners Directory
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Practice teaching and speaking Kiswahili with international learners. Test your explanations, practice conversational Kenyan Sheng or standard Swahili, and guide students on their language journey.
          </p>
        </div>

        {/* Practice Transparency Notice */}
        <div className="mt-5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-xs text-slate-300 space-y-1 backdrop-blur-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Practice & Earnings Rule</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            These 30 learner profiles are dedicated practice partners for teachers and students. Practice sessions are completely free. Only verified sessions with eligible human students generate the KSh 500/hour host compensation.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls (Optimized for Android Touch) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, country, or interest..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto text-xs">
            {/* Country filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="All">All Countries ({countries.length - 1})</option>
              {countries.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Level filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Elementary">Elementary</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Curious Beginner">Curious Beginner</option>
            </select>
          </div>
        </div>

        {/* Personality Archetype Quick Filter Pills (Horizontally Scrollable on Mobile) */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-xs overflow-x-auto pb-1">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Topic:
          </span>
          {[
            'All',
            'Beginner',
            'Curious Traveler',
            'Friendly Student',
            'Business Learner',
            'African Culture Enthusiast',
            'Travel Enthusiast',
            'Food Lover',
            'Sports Fan',
          ].map((personality) => (
            <button
              key={personality}
              onClick={() => setSelectedPersonality(personality)}
              className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer shrink-0 active:scale-95 ${
                selectedPersonality === personality
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {personality}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>Showing {filteredLearners.length} of {AI_LEARNERS.length} learners</span>
        {filteredLearners.length < AI_LEARNERS.length && (
          <button 
            onClick={() => { setSearchQuery(''); setSelectedLevel('All'); setSelectedPersonality('All'); setSelectedCountry('All'); }}
            className="text-emerald-700 font-bold hover:underline cursor-pointer p-1"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid of 30 Learners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredLearners.map((learner) => (
          <div
            key={learner.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition flex flex-col justify-between group"
          >
            <div className="space-y-3.5">
              {/* Card Header: Avatar & Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="relative">
                  <img
                    src={learner.avatar}
                    alt={learner.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20 group-hover:scale-105 transition"
                  />
                  <span className="absolute -bottom-1 -right-1 text-base">{learner.flag}</span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                    <Users className="w-3 h-3" /> Learner
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    🟢 Available
                  </span>
                </div>
              </div>

              {/* Identity & Origin */}
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-800 transition">
                    {learner.name}
                  </h3>
                  <span className="text-base" title={learner.country}>{learner.flag}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {learner.country} • Native: {learner.nativeLanguage}
                </p>
              </div>

              {/* Level & Personality Tags */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 font-bold">
                  {learner.kiswahiliLevel} Kiswahili
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                  {learner.personality}
                </span>
              </div>

              {/* Learning Goal Quote */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-700 italic">
                "{learner.learningGoal}"
              </div>

              {/* Bio summary */}
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {learner.bio}
              </p>

              {/* Interest Badges */}
              <div className="flex flex-wrap gap-1 pt-1">
                {learner.interests.slice(0, 3).map((interest, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                    #{interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Start Chat Button (Touch-Friendly for Android) */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-medium">
                Free Practice
              </span>
              <button
                onClick={() => onSelectLearner(learner)}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4" /> Start Chat
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLearners.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No learners found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting the level and topic filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedLevel('All'); setSelectedPersonality('All'); setSelectedCountry('All'); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};
