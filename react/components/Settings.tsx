import React from 'react';
import { Bell, Lock, Mail, Key, Eye, Activity, UserX, Moon, Globe, ChevronRight } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({ icon, title, subtitle, action }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-[#1A1F26] transition-colors cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{icon}</div>
      <div>
        <h3 className="text-gray-900 dark:text-white text-sm font-medium">{title}</h3>
        {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="text-gray-400 dark:text-gray-500">
      {action || <ChevronRight size={18} />}
    </div>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-4">{title}</h2>
    <div className="bg-white dark:bg-[#151A21] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
      {children}
    </div>
  </div>
);

const Toggle: React.FC<{ checked?: boolean; onChange?: () => void }> = ({ checked = false, onChange }) => (
  <div 
    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
    onClick={onChange}
  >
    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${checked ? 'translate-x-5' : ''}`}></div>
  </div>
);

export const Settings: React.FC<{isDarkMode: boolean, toggleTheme: () => void}> = ({isDarkMode, toggleTheme}) => {
  const { showToast } = useToast();

  const handleToggle = (feature: string) => {
    showToast(`${feature} Updated`);
  }

  return (
    <div className="p-6 max-w-[720px] mx-auto min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account preferences and privacy.</p>
      </div>

      <Section title="Account">
        <SettingRow icon={<Bell size={20} />} title="Notifications" subtitle="Email, Push, and In-App alerts" />
        <div className="border-t border-gray-200 dark:border-gray-800" />
        <SettingRow icon={<Lock size={20} />} title="Password & Security" subtitle="Last changed 3 months ago" />
        <div className="border-t border-gray-200 dark:border-gray-800" />
        <SettingRow icon={<Mail size={20} />} title="Email Addresses" subtitle="alex@example.com (Primary)" />
        <div className="border-t border-gray-200 dark:border-gray-800" />
        <SettingRow 
          icon={<Key size={20} />} 
          title="Two-Factor Authentication" 
          subtitle="Enabled via Authenticator App" 
          action={<span className="text-[10px] font-bold bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/20 dark:border-green-500/30 px-1.5 py-0.5 rounded">ON</span>} 
        />
      </Section>

      <Section title="Privacy">
        <SettingRow 
          icon={<Eye size={20} />} 
          title="Private Account" 
          subtitle="Only approved followers can see your content" 
          action={<Toggle onChange={() => handleToggle('Privacy')} />} 
        />
        <div className="border-t border-gray-200 dark:border-gray-800" />
        <SettingRow 
          icon={<Activity size={20} />} 
          title="Activity Status" 
          subtitle="Show when you're active" 
          action={<Toggle checked={true} onChange={() => handleToggle('Activity Status')} />} 
        />
        <div className="border-t border-gray-200 dark:border-gray-800" />
        <SettingRow icon={<UserX size={20} />} title="Blocked Accounts" subtitle="3 accounts blocked" />
      </Section>

      <Section title="App Preferences">
        <SettingRow 
          icon={<Moon size={20} />} 
          title="Dark Mode" 
          subtitle="Use system theme" 
          action={<Toggle checked={isDarkMode} onChange={() => { toggleTheme(); handleToggle('Theme'); }} />} 
        />
        <div className="border-t border-gray-200 dark:border-gray-800" />
        <SettingRow icon={<Globe size={20} />} title="Language" subtitle="English (US)" />
      </Section>
    </div>
  );
};