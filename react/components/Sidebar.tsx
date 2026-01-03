import React from 'react';
import { Home, Users, User, Bookmark, Settings as SettingsIcon, LogOut, HelpCircle, Zap, MessageSquare, Plus, MoreHorizontal } from 'lucide-react';
import { View } from '../types';
import { CURRENT_USER } from '../constants';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  onOpenCreate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onOpenCreate }) => {
  const navItems = [
    { id: 'feed', icon: Home, label: 'Home' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'communities', icon: Users, label: 'Communities' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'saved', icon: Bookmark, label: 'Saved' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="w-[280px] h-full flex flex-col px-4 py-6 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0E11] hidden md:flex transition-colors duration-200 overflow-y-auto scrollbar-hide sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 mb-8 flex-shrink-0 cursor-pointer" onClick={() => setView('feed')}>
        <img 
            src="https://www.zeeker.com/assets/images/logo-beta.png" 
            alt="Zeeker" 
            className="h-8 w-auto object-contain dark:brightness-0 dark:invert" 
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              title={item.label}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                isActive 
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#151A21] hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2} 
                fill={isActive && item.id === 'saved' ? "currentColor" : "none"}
                className="relative z-10"
              />
              <span className={`text-[15px] font-medium relative z-10 ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
            </button>
          );
        })}

        {/* Create Post Button */}
        {onOpenCreate && (
            <div className="pt-4 px-2">
                <button 
                    onClick={onOpenCreate}
                    title="Create Post"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Create Post</span>
                </button>
            </div>
        )}
      </nav>

      {/* Footer Profile */}
      <div className="pt-4 mt-auto">
         <div className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-[#151A21] transition-colors cursor-pointer group border border-transparent hover:border-gray-200 dark:hover:border-gray-800" title="Profile Options">
             <div className="flex items-center gap-3">
                 <img src={CURRENT_USER.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800" />
                 <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{CURRENT_USER.name}</p>
                     <p className="text-xs text-gray-500 truncate">{CURRENT_USER.handle}</p>
                 </div>
                 <MoreHorizontal size={18} className="text-gray-400" />
             </div>
         </div>
      </div>
    </div>
  );
};