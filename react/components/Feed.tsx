import { BarChart2, Clock, Flame, HelpCircle, Send, Sparkles, TrendingUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Post } from '../types';
import { PostCard } from './PostCard';

interface FeedProps {
    posts: Post[];
    onOpenCreate: () => void;
    onPostClick?: (post: Post) => void;
    onToggleSave: (post: Post) => void;
    isPostSaved: (id: string) => boolean;
    onTogglePin: (post: Post) => void;
}

export const Feed: React.FC<FeedProps> = ({ posts, onOpenCreate, onPostClick, onToggleSave, isPostSaved, onTogglePin }) => {
  const [activeTab, setActiveTab] = useState('Latest');
  const { showToast } = useToast();

  // Scroll visibility logic for Desktop Trigger
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scrollContainer = document.getElementById('scrollable-content');

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Show after 150ms of no scrolling
    };

    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const FILTER_TABS = [
      { id: 'Latest', icon: Clock },
      { id: 'Popular', icon: Flame },
      { id: 'Trending', icon: TrendingUp },
      { id: 'Polls', icon: BarChart2 },
      { id: 'Q&A', icon: HelpCircle },
  ];

  // Logic to hide trigger: scrolling
  const shouldHideTrigger = isScrolling;

  return (
    <div className="relative min-h-full bg-gray-50 dark:bg-[#0B0E11] transition-colors duration-200 flex flex-col items-center">

       <div className="w-full max-w-[720px] pt-0 md:pt-4 relative flex flex-col min-h-full">
            {/* Filter Tabs - Fixed layout with icons and adjusted sticky offset */}
            <div className="sticky top-0 z-20 mb-2 md:mb-4 bg-gray-50/95 dark:bg-[#0B0E11]/95 backdrop-blur-md transition-colors w-full border-b border-gray-100 dark:border-gray-800 md:border-none">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-2 md:px-3 md:py-3 items-center">
                    {FILTER_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all shadow-sm ${isActive ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-[#151A21] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800'}`}
                            >
                                <Icon size={13} className={`md:w-[14px] md:h-[14px] ${isActive ? 'text-white dark:text-black' : 'text-gray-500 dark:text-gray-400'}`} strokeWidth={2.5} />
                                {tab.id}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area with Thread Lines */}
            <div className="relative mx-2 md:mx-0">
                {/* Posts Container - Thread Style */}
                <div className="flex flex-col relative pb-4">
                    {posts.map((post, index) => {
                        const isLast = index === posts.length - 1;
                        const isFirst = index === 0;

                        return (
                            <div key={post.id} className="relative pb-2 animate-slide-up">
                                 {/* Vertical Extension / Spine */}
                                {!isLast && (
                                    <div className={`absolute left-[32px] md:left-[36px] w-[2px] bg-gray-200 dark:bg-gray-700 z-0 ${
                                        isFirst
                                        ? `${post.isPinned ? 'top-[52px]' : 'top-[24px]'} bottom-0` // Start lower for the first item (head)
                                        : 'top-0 bottom-0' // Full height for subsequent items
                                    }`}></div>
                                )}

                                {/* L-Shape Connector for items AFTER the first one */}
                                {!isFirst && (
                                    <div className="absolute left-[32px] md:left-[36px] top-0 w-[10px] md:w-[40px] h-[36px] rounded-bl-lg md:rounded-bl-xl border-b-2 border-l-2 border-gray-200 dark:border-gray-700 z-0"></div>
                                )}

                                {/* Indented Post */}
                                {/* First post is NOT indented to serve as the thread head */}
                                <div className={`${isFirst ? '' : 'pl-[46px] md:pl-[88px]'} ${post.isPinned ? 'mb-2' : ''}`}>
                                    <PostCard
                                        post={post}
                                        onClick={onPostClick ? () => onPostClick(post) : undefined}
                                        variant="card"
                                        onToggleSave={() => onToggleSave(post)}
                                        isSaved={isPostSaved(post.id)}
                                        onTogglePin={() => onTogglePin(post)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Desktop Sticky Compact Input Capsule */}
            <div className={`hidden md:block sticky bottom-4 px-4 z-40 transition-all duration-300 ease-out transform ${shouldHideTrigger ? 'translate-y-[200%] opacity-0' : 'translate-y-0 opacity-100'}`}>
                <div
                    onClick={onOpenCreate}
                    className="relative rounded-full p-[1px] overflow-hidden pointer-events-auto shadow-2xl max-w-[600px] mx-auto cursor-pointer group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-indigo-500 to-pink-500 animate-gradient-x opacity-100" />
                    <div className="relative bg-white dark:bg-[#151A21] rounded-full pl-2 pr-2 flex items-center gap-2 h-[44px]">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-pink-600 flex-shrink-0 flex items-center justify-center ml-0.5">
                            <img src="https://picsum.photos/seed/alex/200/200" className="w-full h-full rounded-full p-[1.5px] object-cover" alt="Me" />
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm flex-1 font-medium group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                            What's on your mind?
                        </span>
                        <div className="relative">
                             <div className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                                <Sparkles size={16} />
                            </div>
                        </div>
                        <div className={`p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 transition-all group-hover:bg-primary group-hover:text-white`}>
                            <Send size={16} />
                        </div>
                    </div>
                </div>
            </div>
       </div>
    </div>
  );
};
