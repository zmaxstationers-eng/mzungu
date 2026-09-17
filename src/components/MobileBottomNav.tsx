import React from 'react';
import { Home, Search, Users, MessageSquare, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { user } = useAuth();

  const getDashboardTab = () => {
    if (!user) return 'login';
    if (user.role === 'teacher') return 'teacher-dashboard';
    if (user.role === 'admin') return 'admin';
    return 'learner-dashboard';
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'teachers', label: 'Teachers', icon: Search },
    { id: 'ai-learners', label: 'Learners', icon: Users },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: getDashboardTab(), label: user ? 'Account' : 'Log In', icon: LayoutDashboard },
  ];

  return (
    <nav 
      aria-label="Android Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 pb-[env(safe-area-inset-bottom,4px)] shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="h-16 flex items-center justify-around px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-1 select-none active:scale-95 transition-transform duration-100 cursor-pointer min-h-[48px]"
            >
              <div 
                className={`flex items-center justify-center px-4 py-1 rounded-full transition-colors duration-200 ${
                  isActive 
                    ? 'bg-emerald-100 text-emerald-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                  {item.id === 'chat' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white"></span>
                  )}
                </div>
              </div>
              <span 
                className={`text-[11px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-emerald-900' : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
