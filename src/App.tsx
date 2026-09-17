import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeView } from './views/HomeView';
import { FindTeachersView } from './views/FindTeachersView';
import { KiswahiliLessonsView } from './views/KiswahiliLessonsView';
import { BecomeTeacherView } from './views/BecomeTeacherView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { LearnerDashboardView } from './views/LearnerDashboardView';
import { ChatView } from './views/ChatView';
import { AdminView } from './views/AdminView';
import { AuthView } from './views/AuthView';
import { StaticPagesView } from './views/StaticPagesView';
import { AILearnersDirectoryView } from './views/AILearnersDirectoryView';
import { AIChatView } from './views/AIChatView';

import { MpesaActivationModal } from './components/MpesaActivationModal';
import { WithdrawalModal } from './components/WithdrawalModal';
import { ReportUserModal } from './components/ReportUserModal';
import { TeacherProfileModal } from './components/TeacherProfileModal';

import { User, Session, AILearnerProfile } from './types';
import { AI_LEARNERS } from './data/aiLearners';
import { api } from './services/api';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [featuredTeachers, setFeaturedTeachers] = useState<User[]>([]);

  // Modals state
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportData, setReportData] = useState<{ userId: string; userName: string; sessionId?: string }>({
    userId: '',
    userName: ''
  });

  const [selectedTeacherForModal, setSelectedTeacherForModal] = useState<User | null>(null);
  const [activeSessionForChat, setActiveSessionForChat] = useState<Session | null>(null);
  const [targetTeacherForChat, setTargetTeacherForChat] = useState<User | null>(null);
  const [selectedAILearner, setSelectedAILearner] = useState<AILearnerProfile>(AI_LEARNERS[0]);

  // Load teachers for home view
  useEffect(() => {
    api.getTeachers().then(setFeaturedTeachers);
  }, []);

  const handleStartSession = (teacher: User) => {
    setSelectedTeacherForModal(null);
    setTargetTeacherForChat(teacher);
    setCurrentTab('chat');
  };

  const handleOpenReport = (reportedUserId: string, reportedUserName: string, sessionId?: string) => {
    setReportData({ userId: reportedUserId, userName: reportedUserName, sessionId });
    setIsReportOpen(true);
  };

  const handleOpenSession = (session: Session) => {
    setActiveSessionForChat(session);
    setCurrentTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900 pb-16 md:pb-0">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenActivation={() => setIsActivationOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={setCurrentTab}
            featuredTeachers={featuredTeachers}
            onSelectTeacher={(t) => setSelectedTeacherForModal(t)}
          />
        )}

        {currentTab === 'teachers' && (
          <FindTeachersView
            onSelectTeacher={(t) => setSelectedTeacherForModal(t)}
            onStartChat={handleStartSession}
          />
        )}

        {currentTab === 'lessons' && (
          <KiswahiliLessonsView
            onStartSessionWithTopic={(topic) => {
              setCurrentTab('teachers');
            }}
          />
        )}

        {currentTab === 'ai-learners' && (
          <AILearnersDirectoryView
            onSelectLearner={(learner) => {
              setSelectedAILearner(learner);
              setCurrentTab('ai-chat');
            }}
            onNavigateHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'ai-chat' && (
          <AIChatView
            learner={selectedAILearner}
            onBack={() => setCurrentTab('ai-learners')}
            onSelectAnotherLearner={() => setCurrentTab('ai-learners')}
          />
        )}

        {currentTab === 'become-teacher' && (
          <BecomeTeacherView
            onNavigate={setCurrentTab}
            onOpenActivation={() => setIsActivationOpen(true)}
          />
        )}

        {currentTab === 'teacher-dashboard' && (
          <TeacherDashboardView
            onOpenWithdrawal={() => setIsWithdrawalOpen(true)}
            onOpenActivation={() => setIsActivationOpen(true)}
            onNavigate={setCurrentTab}
            onOpenSession={handleOpenSession}
          />
        )}

        {currentTab === 'learner-dashboard' && (
          <LearnerDashboardView
            onNavigate={setCurrentTab}
            onOpenSession={handleOpenSession}
          />
        )}

        {currentTab === 'chat' && (
          <ChatView
            initialSession={activeSessionForChat}
            targetTeacher={targetTeacherForChat}
            onOpenReport={handleOpenReport}
            onSessionEnded={() => {
              // Stay in chat or update state
            }}
          />
        )}

        {currentTab === 'admin' && <AdminView />}

        {currentTab === 'login' && (
          <AuthView
            initialMode="login"
            onAuthSuccess={() => {
              if (user?.role === 'teacher') setCurrentTab('teacher-dashboard');
              else if (user?.role === 'admin') setCurrentTab('admin');
              else setCurrentTab('learner-dashboard');
            }}
          />
        )}

        {currentTab === 'signup' && (
          <AuthView
            initialMode="signup-teacher"
            onAuthSuccess={() => {
              setCurrentTab('teacher-dashboard');
            }}
          />
        )}

        {[
          'how-it-works',
          'pricing',
          'community-guidelines',
          'terms',
          'privacy',
          'report-abuse',
        ].includes(currentTab) && (
          <StaticPagesView
            page={currentTab as any}
            onNavigate={setCurrentTab}
            onOpenReportModal={() => {
              setReportData({ userId: 'general', userName: 'Incident Report' });
              setIsReportOpen(true);
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      <MpesaActivationModal
        isOpen={isActivationOpen}
        onClose={() => setIsActivationOpen(false)}
        onSuccess={() => {
          setCurrentTab('teacher-dashboard');
        }}
      />

      <WithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        availableBalance={user?.availableBalance || 0}
        onWithdrawalSubmitted={() => {
          // balance refreshed in context
        }}
      />

      <ReportUserModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reporterId={user?.id || 'guest'}
        reportedUserId={reportData.userId}
        reportedUserName={reportData.userName}
        sessionId={reportData.sessionId}
      />

      <TeacherProfileModal
        teacher={selectedTeacherForModal}
        isOpen={!!selectedTeacherForModal}
        onClose={() => setSelectedTeacherForModal(null)}
        onStartSession={handleStartSession}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Global Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-extrabold text-sm text-white">
                  F
                </span>
                <span className="font-extrabold text-base tracking-tight text-white">
                  FUNZA <span className="text-emerald-400">MZUNGU</span>
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Authentic Kiswahili learning & conversation platform. Teachers earn KSh 500 per verified completed teaching hour via M-Pesa.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Explore</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentTab('teachers')} className="hover:text-white transition">Find Kiswahili Teachers</button></li>
                <li><button onClick={() => setCurrentTab('ai-learners')} className="hover:text-white transition">Learners Directory</button></li>
                <li><button onClick={() => setCurrentTab('lessons')} className="hover:text-white transition">Phrasebook & Lessons</button></li>
                <li><button onClick={() => setCurrentTab('become-teacher')} className="hover:text-white transition">Become a Host (Earn KSh 500/hr)</button></li>
                <li><button onClick={() => setCurrentTab('how-it-works')} className="hover:text-white transition">How It Works</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Trust & Security</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentTab('pricing')} className="hover:text-white transition">Earnings & Pricing Transparency</button></li>
                <li><button onClick={() => setCurrentTab('community-guidelines')} className="hover:text-white transition">Community Guidelines</button></li>
                <li><button onClick={() => setCurrentTab('report-abuse')} className="hover:text-white transition">Report Safety Issue</button></li>
                <li><button onClick={() => setCurrentTab('admin')} className="hover:text-white transition">Operations Center</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Platform Notice</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Funza Mzungu is an educational marketplace. Earnings depend strictly on completed eligible sessions. Host activation fee is KSh 600 (non-refundable). Does not guarantee income.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>© {new Date().getFullYear()} Funza Mzungu Ltd. All rights reserved. Made in Kenya.</div>
            <div className="flex gap-4">
              <button onClick={() => setCurrentTab('terms')} className="hover:text-slate-400">Terms of Service</button>
              <button onClick={() => setCurrentTab('privacy')} className="hover:text-slate-400">Privacy Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
