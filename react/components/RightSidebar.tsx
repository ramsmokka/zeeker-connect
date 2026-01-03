import React from 'react';
import { COMMUNITIES, TRENDING_TOPICS, WHO_TO_FOLLOW } from '../constants';
import { TrendingUp, CheckCircle, ArrowRight, MessageCircle, Hash, Search } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  return (
    <div className="w-[380px] h-full hidden xl:flex flex-col p-6 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0E11] transition-colors duration-200 gap-6 overflow-y-auto scrollbar-hide">
        
        {/* Search - Desktop Sidebar Version (Optional, if main search is hidden or for quick access) */}
        {/* <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
                type="text" 
                placeholder="Search Connect" 
                className="w-full bg-gray-100 dark:bg-[#151A21] border-none rounded-full py-3 pl-11 pr-4 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 transition-all"
            />
        </div> */}

        {/* Trending Section */}
        <div className="bg-gray-50 dark:bg-[#151A21]/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                    Trending
                </h3>
            </div>
            
            <div className="space-y-5">
                 {TRENDING_TOPICS.map((topic, i) => (
                     <div key={i} className="group cursor-pointer flex gap-4 items-start">
                         <span className="text-gray-300 dark:text-gray-700 font-bold text-lg leading-none mt-0.5 w-4 text-right tabular-nums group-hover:text-primary transition-colors">
                            {i + 1}
                         </span>
                         <div className="flex flex-col flex-1 min-w-0">
                             <div className="flex justify-between items-start">
                                 <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{topic.category}</span>
                                 <MoreHorizontalIcon />
                             </div>
                             <h4 className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug group-hover:underline decoration-2 decoration-gray-200 dark:decoration-gray-700 underline-offset-2">
                                 {topic.title}
                             </h4>
                             <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                 <span>{(Math.random() * 50 + 10).toFixed(1)}k posts</span>
                             </div>
                         </div>
                     </div>
                 ))}
            </div>
             <button className="w-full mt-4 py-2 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors">
                Show more
            </button>
        </div>

        {/* Who to Follow */}
        <div className="bg-gray-50 dark:bg-[#151A21]/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800/50 sticky top-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Who to Follow</h3>
            </div>
            
            <div className="flex flex-col gap-4">
                {WHO_TO_FOLLOW.slice(0, 3).map((user, i) => (
                    <div key={i} className="flex items-center gap-3">
                         <div className="relative flex-shrink-0">
                            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-[#151A21]" alt={user.name} />
                         </div>
                         <div className="flex flex-col flex-1 min-w-0">
                             <div className="flex items-center gap-1">
                                 <span className="text-sm font-bold text-gray-900 dark:text-white hover:underline truncate">{user.name}</span>
                                 {user.verified && <CheckCircle size={12} className="text-blue-500 fill-blue-500 text-white flex-shrink-0" />}
                             </div>
                             <span className="text-xs text-gray-500 truncate">{user.handle}</span>
                         </div>
                         <button className="px-3.5 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full hover:opacity-80 transition-opacity">
                             Follow
                         </button>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors text-left">
                View all recommendations
            </button>
        </div>

        {/* Mini Footer */}
        <div className="px-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Cookie Policy</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Ads Info</a>
            <span>© 2024 Connect Inc.</span>
        </div>

    </div>
  );
};

const MoreHorizontalIcon = () => (
    <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
);
