import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  Clock, 
  Globe, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  MapPin, 
  Languages, 
  CheckCircle2 
} from 'lucide-react';
import { User } from '../types';

interface TeacherProfileModalProps {
  teacher: User | null;
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (teacher: User) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  teacher,
  isOpen,
  onClose,
  onStartSession
}) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-slate-100">
          <div className="relative">
            <img
              src={teacher.avatar}
              alt={teacher.displayName}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-md"
            />
            {teacher.isOnline && (
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" title="Online now" />
            )}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-2xl font-extrabold text-slate-900">{teacher.fullName}</h3>
              {teacher.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Host
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {teacher.country}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {teacher.rating.toFixed(1)} ({teacher.totalReviews} reviews)
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">{teacher.completedHours} hrs taught</span>
            </div>

            {/* Teaching rate pill */}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs text-slate-600 font-medium">Standard verified rate:</span>
              <span className="text-sm font-extrabold text-emerald-800">KSh 500 / hr</span>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="py-4 border-b border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About Host</h4>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {teacher.bio || 'Native Kiswahili speaker welcoming international learners to practice conversational Swahili, cultural etiquette, and daily idioms.'}
          </p>
        </div>

        {/* Languages & Proficiency */}
        <div className="py-4 border-b border-slate-100 grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Kiswahili Level</span>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {teacher.kiswahiliLevel}
            </div>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Languages Spoken</span>
            <div className="text-sm font-semibold text-slate-700">
              {teacher.languagesSpoken.join(', ')}
            </div>
          </div>
        </div>

        {/* Preferred Topics */}
        {teacher.preferredTopics && teacher.preferredTopics.length > 0 && (
          <div className="py-4 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Conversation Topics</span>
            <div className="flex flex-wrap gap-1.5">
              {teacher.preferredTopics.map((topic, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        {teacher.availability && (
          <div className="py-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Availability Schedule</span>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Days: {teacher.availability.days.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Slots: {teacher.availability.timeSlots.join(', ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* CTA Footer */}
        <div className="pt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartSession(teacher);
            }}
            className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Start Chat Session
          </button>
        </div>
      </div>
    </div>
  );
};
