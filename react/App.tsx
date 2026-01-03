import { Bell, Bookmark, Heart, HelpCircle, Home, LogOut, Mail, Moon, PlusCircle, Search, Settings as SettingsIcon, Sun, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Communities } from './components/Communities';
import { CreatePostModal } from './components/CreatePostModal';
import { Feed } from './components/Feed';
import { Messages } from './components/Messages';
import { PostCard } from './components/PostCard';
import { Profile } from './components/Profile';
import { RightSidebar } from './components/RightSidebar';
import { Settings } from './components/Settings';
import { Sidebar } from './components/Sidebar';
import { ThreadView } from './components/ThreadView';
import { CURRENT_USER, MOCK_POSTS } from './constants';
import { ToastProvider } from './contexts/ToastContext';
import { Post, View } from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('feed');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Global Like Button State
  const [globalLikes, setGlobalLikes] = useState(12450);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showGlobalReactions, setShowGlobalReactions] = useState(false);

  // Live Flip Animation Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      // Increment random amount to simulate live activity
      setGlobalLikes(prev => prev + Math.floor(Math.random() * 15) + 5);

      // Reset flip state after animation completes
      setTimeout(() => setIsFlipping(false), 1000);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Posts State lifted to App
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
        let initialPosts = MOCK_POSTS;
        const saved = localStorage.getItem('connect_posts');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Ensure pinned mock post is always present and updated in the list
            const pinnedMock = MOCK_POSTS.find(p => p.id === 'pinned-nexus-update');
            if (pinnedMock) {
                // Filter out any old version of the pinned post from local storage to avoid duplicates
                const filtered = parsed.filter((p: Post) => p.id !== 'pinned-nexus-update');
                initialPosts = [pinnedMock, ...filtered];
            } else {
                initialPosts = parsed;
            }
        }

        // Ensure sorted by pinned status
        return initialPosts.sort((a: Post, b: Post) => {
             if (a.isPinned === b.isPinned) return 0;
             return a.isPinned ? -1 : 1;
        });

    } catch (e) {
        return MOCK_POSTS;
    }
  });

  // Saved Posts State
  const [savedPosts, setSavedPosts] = useState<Post[]>(() => {
    try {
        const saved = localStorage.getItem('connect_saved_posts');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('connect_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('connect_saved_posts', JSON.stringify(savedPosts));
  }, [savedPosts]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Close menu on click outside
  useEffect(() => {
    const handleClick = () => {
        setShowProfileMenu(false);
        // Close global reactions if clicking elsewhere
        setShowGlobalReactions(false);
    };
    // Only add listener if menus are open
    if(showProfileMenu || showGlobalReactions) window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [showProfileMenu, showGlobalReactions]);

  const handleCreatePost = (newPost: Post) => {
      setPosts(prev => {
          const updated = [newPost, ...prev];
          // Keep pinned at top even when new post arrives
          return updated.sort((a, b) => {
             if (a.isPinned === b.isPinned) return 0; // Maintain relative order of same status
             return a.isPinned ? -1 : 1;
          });
      });
      setCurrentView('feed');
      const scrollContainer = document.getElementById('scrollable-content');
      if (scrollContainer) {
          scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const handlePostClick = (post: Post) => {
      setSelectedPost(post);
      setCurrentView('thread');
  };

  const handleToggleSave = (post: Post) => {
      setSavedPosts(prev => {
          const isSaved = prev.some(p => p.id === post.id);
          if (isSaved) {
              return prev.filter(p => p.id !== post.id);
          } else {
              return [post, ...prev];
          }
      });
  };

  const handleTogglePin = (post: Post) => {
      setPosts(prev => {
          const updated = prev.map(p => p.id === post.id ? { ...p, isPinned: !p.isPinned } : p);
          // Sort: Pinned first
          return updated.sort((a, b) => {
              if (a.isPinned === b.isPinned) return 0;
              return a.isPinned ? -1 : 1;
          });
      });

      // Update selectedPost if it's the one being pinned/unpinned
      if (selectedPost && selectedPost.id === post.id) {
          setSelectedPost(prev => prev ? { ...prev, isPinned: !prev.isPinned } : null);
      }
  };

  const isPostSaved = (postId: string) => savedPosts.some(p => p.id === postId);

  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return (
            <Feed
                posts={posts}
                onOpenCreate={() => setIsCreateModalOpen(true)}
                onPostClick={handlePostClick}
                onToggleSave={handleToggleSave}
                isPostSaved={isPostSaved}
                onTogglePin={handleTogglePin}
            />
        );
      case 'messages': return <Messages />;
      case 'communities': return <Communities />;
      case 'profile':
        return (
            <Profile
                onPostClick={handlePostClick}
                onToggleSave={handleToggleSave}
                isPostSaved={isPostSaved}
                onTogglePin={handleTogglePin}
            />
        );
      case 'settings': return <Settings isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />;
      case 'saved':
        return (
            <div className="flex flex-col min-h-full bg-gray-50 dark:bg-[#0B0E11] transition-colors">
                <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0B0E11]/90 backdrop-blur-md px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 max-w-[720px] mx-auto w-full">
                    <Bookmark className="fill-current text-primary" size={24} />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Saved Posts</h2>
                </div>
                <div className="flex flex-col gap-4 pb-20 pt-4 max-w-[720px] mx-auto w-full px-2 md:px-0">
                    {savedPosts.length === 0 ? (
                        <div className="p-10 text-center flex flex-col items-center justify-center text-gray-500">
                            <Bookmark size={48} className="mb-4 opacity-20" />
                            <p>No saved posts yet.</p>
                            <p className="text-sm mt-2">Tap the menu on a post to save it for later.</p>
                        </div>
                    ) : (
                        savedPosts.map(post => (
                            <div key={post.id}>
                                <PostCard
                                    post={post}
                                    onClick={() => handlePostClick(post)}
                                    onToggleSave={() => handleToggleSave(post)}
                                    isSaved={true}
                                    onTogglePin={() => handleTogglePin(post)}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
      case 'thread':
        return selectedPost ? (
            <ThreadView
                post={selectedPost}
                onBack={() => {
                    setSelectedPost(null);
                    setCurrentView('feed');
                }}
                onToggleSave={handleToggleSave}
                isPostSaved={isPostSaved}
            />
        ) : (
            <Feed
                posts={posts}
                onOpenCreate={() => setIsCreateModalOpen(true)}
                onPostClick={handlePostClick}
                onToggleSave={handleToggleSave}
                isPostSaved={isPostSaved}
                onTogglePin={handleTogglePin}
            />
        );
      default: return (
        <Feed
            posts={posts}
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onPostClick={handlePostClick}
            onToggleSave={handleToggleSave}
            isPostSaved={isPostSaved}
            onTogglePin={handleTogglePin}
        />
      );
    }
  };

  return (
    <ToastProvider>
      <div className={`h-screen font-sans transition-colors duration-200 overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#0B0E11] text-white' : 'bg-gray-50 text-gray-900'}`}>

        <CreatePostModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreatePost={handleCreatePost}
        />

        <div className="flex w-full h-full justify-center overflow-hidden">
          <Sidebar currentView={currentView} setView={setCurrentView} />

          <main className="flex-1 min-w-0 relative flex flex-col h-full bg-white dark:bg-[#0B0E11]">
              {/* Top Bar - Fixed at top of main column */}
              <div className="z-30 bg-white/80 dark:bg-[#0B0E11]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                 <div className="max-w-[720px] mx-auto w-full px-4 py-3 flex items-center justify-between">
                     {/* Mobile Logo */}
                     <img
                        src="https://www.zeeker.com/assets/images/logo-beta.png"
                        alt="Logo"
                        className="h-5 w-auto md:hidden mr-3 object-contain dark:brightness-0 dark:invert"
                     />
                     <div className="relative flex-1">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                         <input
                            type="text"
                            placeholder="Search Connect..."
                            className="w-full bg-gray-100 dark:bg-[#151A21] border border-gray-200 dark:border-gray-800 rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700 transition-shadow"
                         />
                     </div>
                     <div className="flex items-center gap-4 ml-4">
                         <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                         </button>
                         <div className="relative" title="Notifications">
                             <Bell size={20} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" />
                             <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0B0E11]"></div>
                         </div>

                         {/* Profile Dropdown */}
                         <div className="relative">
                             <button
                                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer ring-2 ring-gray-100 dark:ring-gray-800 focus:outline-none transition-transform active:scale-95"
                                onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); }}
                             >
                                 <img src={CURRENT_USER.avatar} alt="Me" className="w-full h-full object-cover" />
                             </button>

                             {showProfileMenu && (
                                <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-[#1A1F26] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{CURRENT_USER.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{CURRENT_USER.handle}</p>
                                    </div>

                                    <button onClick={() => { setCurrentView('profile'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors">
                                        <User size={16} className="text-gray-500" /> Profile
                                    </button>
                                    <button onClick={() => { setCurrentView('settings'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors">
                                        <SettingsIcon size={16} className="text-gray-500" /> Settings
                                    </button>
                                    <button onClick={() => { setCurrentView('saved'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors">
                                        <Bookmark size={16} className="text-gray-500" /> Saved
                                    </button>

                                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>

                                    <button onClick={() => setShowProfileMenu(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors">
                                        <HelpCircle size={16} className="text-gray-500" /> Help
                                    </button>
                                    <button onClick={() => setShowProfileMenu(false)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-3 font-medium transition-colors">
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                             )}
                         </div>
                     </div>
                 </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto scrollbar-hide relative pb-20 md:pb-0" id="scrollable-content">
                  {renderView()}
              </div>
          </main>

          <RightSidebar />
        </div>

        {/* Mobile Bottom Navigation & Action Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0B0E11]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50 px-2 safe-area-bottom flex justify-between items-end h-[60px] pb-2">

             {/* Home */}
             <button
                onClick={() => setCurrentView('feed')}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === 'feed' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
                <Home size={24} strokeWidth={currentView === 'feed' ? 2.5 : 2} />
                <span className="text-[10px] font-medium mt-0.5">Home</span>
            </button>

            {/* Saved */}
            <button
                onClick={() => setCurrentView('saved')}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === 'saved' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
                <Bookmark
                    size={24}
                    strokeWidth={currentView === 'saved' ? 2.5 : 2}
                    fill={currentView === 'saved' ? "currentColor" : "none"}
                />
                <span className="text-[10px] font-medium mt-0.5">Saved</span>
            </button>

            {/* Post */}
             <button
                onClick={() => setIsCreateModalOpen(true)}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isCreateModalOpen ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
                <PlusCircle size={24} strokeWidth={isCreateModalOpen ? 2.5 : 2} />
                <span className="text-[10px] font-medium mt-0.5">Post</span>
            </button>

            {/* DM */}
            <button
                onClick={() => setCurrentView('messages')}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === 'messages' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
                <Mail size={24} strokeWidth={currentView === 'messages' ? 2.5 : 2} />
                <span className="text-[10px] font-medium mt-0.5">DM</span>
            </button>

            {/* Likes (Activity) */}
            <div className="relative flex flex-col items-center justify-center w-full h-full">
                {/* Popover for reactions */}
                {showGlobalReactions && (
                    <div className="absolute bottom-full right-0 mb-4 bg-white dark:bg-[#1A1F26] p-2.5 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 flex gap-3 animate-in slide-in-from-bottom-2 fade-in z-50 min-w-[200px] justify-between">
                        {[
                            { emoji: '👍', label: 'Like' },
                            { emoji: '❤️', label: 'Love' },
                            { emoji: '😂', label: 'Haha' },
                            { emoji: '😮', label: 'Wow' },
                            { emoji: '🔥', label: 'Hot' }
                        ].map((reaction, i) => (
                            <div key={i} className="flex flex-col items-center gap-0.5 group cursor-pointer">
                                <span className="text-xl transform group-hover:scale-125 transition-transform duration-200">{reaction.emoji}</span>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                                    {(Math.floor(globalLikes / ((i + 1) * 2)) + (i * 12)).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowGlobalReactions(!showGlobalReactions);
                    }}
                    className="flex flex-col items-center justify-center w-full h-full"
                >
                    {/* Y-Axis Flip Animation */}
                    <div className={`transition-transform duration-1000 ease-in-out ${isFlipping ? '[transform:rotateY(360deg)]' : ''}`}>
                         <Heart
                            size={24}
                            className={`transition-colors duration-300 ${showGlobalReactions ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
                            strokeWidth={showGlobalReactions ? 0 : 2}
                         />
                    </div>
                    <span className={`text-[10px] font-medium mt-0.5 transition-colors duration-300 ${showGlobalReactions ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        Likes
                    </span>
                </button>
            </div>

        </div>
      </div>
    </ToastProvider>
  );
};
