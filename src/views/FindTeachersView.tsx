import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Star, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Sparkles,
  CheckCircle2,
  Users
} from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

interface FindTeachersViewProps {
  onSelectTeacher: (teacher: User) => void;
  onStartChat: (teacher: User) => void;
}

export const FindTeachersView: React.FC<FindTeachersViewProps> = ({
  onSelectTeacher,
  onStartChat
}) => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [levelFilter, setLevelFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const list = await api.getTeachers({
        search: search.trim() || undefined,
        online: onlineOnly || undefined,
        level: levelFilter || undefined,
        country: countryFilter || undefined,
        availableToday: availableTodayOnly || undefined
      });
      setTeachers(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [search, onlineOnly, levelFilter, countryFilter, availableTodayOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Page Title Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Native Speakers Directory</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">Find a Kiswahili Teacher</h1>
        <p className="text-sm text-slate-600 mt-1">
          Connect with fluent Swahili hosts for live practice. Teachers earn KSh 500/hr through verified sessions.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by teacher name, topic (e.g. Sheng, Nairobi market, Grammar)..."
            className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-slate-50/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <button
            onClick={() => setOnlineOnly(!onlineOnly)}
            className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer border ${
              onlineOnly ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            🟢 Online Now
          </button>

          <button
            onClick={() => setAvailableTodayOnly(!availableTodayOnly)}
            className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer border ${
              availableTodayOnly ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            📅 Available Today
          </button>

          {/* Level Filter Dropdown */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 bg-slate-100 text-slate-700 focus:outline-hidden"
          >
            <option value="">All Kiswahili Levels</option>
            <option value="Native / Fluent">Native / Fluent</option>
            <option value="Advanced">Advanced</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Beginner">Beginner Friendly</option>
          </select>

          {/* Country Filter */}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 bg-slate-100 text-slate-700 focus:outline-hidden"
          >
            <option value="">All Countries</option>
            <option value="Kenya">Kenya</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Uganda">Uganda</option>
          </select>

          {(onlineOnly || availableTodayOnly || levelFilter || countryFilter || search) && (
            <button
              onClick={() => {
                setOnlineOnly(false);
                setAvailableTodayOnly(false);
                setLevelFilter('');
                setCountryFilter('');
                setSearch('');
              }}
              className="text-xs text-red-600 hover:underline font-semibold ml-2 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Teachers Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-r-transparent mb-2"></div>
          <p className="text-sm">Finding verified Kiswahili teachers...</p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No teachers found</h3>
          <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or filters to discover more hosts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
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
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-xs"
                    />
                    {teacher.isOnline ? (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" title="Online now" />
                    ) : (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-300 ring-2 ring-white" title="Offline" />
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
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {teacher.country}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {teacher.rating.toFixed(1)}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        KSh 500 / hr
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {teacher.totalSessions} sessions
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {teacher.bio || 'Native Kiswahili speaker welcoming learners for conversational practice and cultural learning.'}
                </p>

                {/* Topics / Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-100">
                    {teacher.kiswahiliLevel}
                  </span>
                  {teacher.languagesSpoken.slice(0, 2).map((lang, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {lang}
                    </span>
                  ))}
                  {teacher.availability?.isAvailableToday && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-medium">
                      Today Available
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectTeacher(teacher)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onStartChat(teacher)}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Start Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
