import { ArrowLeft, Bookmark, Globe, MoreHorizontal, Pin, Send, Share2, Sparkles } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { CURRENT_USER } from '../constants';
import { useToast } from '../contexts/ToastContext';
import { Post, Reply } from '../types';
import { CreatePostModal } from './CreatePostModal';
import { PostCard } from './PostCard';
import { SharePopup } from './SharePopup';

interface ThreadViewProps {
  post: Post;
  onBack: () => void;
  onToggleSave: (post: Post) => void;
  isPostSaved: (id: string) => boolean;
}

export const ThreadView: React.FC<ThreadViewProps> = ({ post, onBack, onToggleSave, isPostSaved }) => {
  const [replies, setReplies] = useState<Reply[]>(post.replies || []);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { showToast } = useToast();

  const isSaved = isPostSaved(post.id);

  // Scroll visibility logic
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const container = scrollContainerRef.current;
    if (container) {
        container.addEventListener('scroll', handleScroll);
    }

    return () => {
        if (container) {
            container.removeEventListener('scroll', handleScroll);
        }
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const handleCreateReply = (post: Post) => {
    const newReply: Reply = {
      id: post.id,
      user: post.user,
      content: post.content,
      timestamp: 'Just now',
      likes: 0
    };

    setReplies(prev => [...prev, newReply]);
    showToast('Reply sent');
  };

  const hasReplies = replies.length > 0;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0B0E11] transition-colors relative">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#0B0E11]/90 backdrop-blur-md px-4 py-2 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Thread</h2>
      </div>

      {/* Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-[720px] mx-auto pt-4">

            {/* Main Post Section */}
            <div className="p-0">
               {post.type === 'article' ? (
                   // Custom Article Layout
                   <div className="relative p-3 md:p-4 bg-white dark:bg-[#151A21] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible mb-4 group z-20">

                        {post.isPinned && (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2 pl-4 md:pl-12">
                                <Pin size={12} className="fill-gray-500 dark:fill-gray-400" />
                                <span>Pinned</span>
                            </div>
                        )}

                        {/* Thread Connector Line (Spine) */}
                        {hasReplies && (
                            <div className="absolute left-[32px] md:left-[36px] top-[36px] -bottom-4 w-[2px] bg-gray-200 dark:bg-gray-700 z-0"></div>
                        )}

                        <div className="flex gap-3 relative z-10">
                            {/* Left Col: Image */}
                            <div className="flex-shrink-0 flex flex-col items-center relative">
                                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden ring-2 ring-gray-50 dark:ring-[#0B0E11] z-20 relative">
                                    <img src={post.articleImage || post.user.avatar} className="w-full h-full object-cover" alt="" />
                                </div>
                            </div>

                            {/* Right Col: Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                                            {post.reviewTitle || post.content.substring(0, 30)}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                            <span>{post.user.name}</span>
                                            <span>•</span>
                                            <span>{post.timestamp}</span>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-full -mr-2">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                                    {post.content}
                                </p>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => { onToggleSave(post); showToast(isSaved ? 'Post Unsaved' : 'Post Saved'); }}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${isSaved ? 'bg-primary/10 text-primary border-primary/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                    >
                                        <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "" : ""} />
                                        {isSaved ? 'Saved' : 'Save'}
                                    </button>

                                    <div className="relative">
                                        <button
                                            onClick={() => setShowShare(!showShare)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
                                        >
                                            <Share2 size={14} />
                                            Share
                                        </button>
                                        {showShare && (
                                            <div className="absolute top-full left-0 mt-2 z-20">
                                                <SharePopup onClose={() => setShowShare(false)} />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => window.open('#', '_blank')}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400 transition-colors border border-blue-100 dark:border-blue-900/50"
                                    >
                                        <Globe size={14} />
                                        Open Web
                                    </button>
                                </div>
                            </div>
                        </div>
                   </div>
               ) : (
                   // Standard Post Card
                   <div className="relative mb-4 z-20">
                      {hasReplies && (
                          // Bridge line to cross the margin-bottom gap
                          <div className="absolute left-[32px] md:left-[36px] top-full h-4 w-[2px] bg-gray-200 dark:bg-gray-700 z-0"></div>
                      )}
                      <PostCard
                          post={{...post, replies: []}}
                          hideReplies={true}
                          isThreadParent={hasReplies}
                          variant="card"
                          onToggleSave={() => onToggleSave(post)}
                          isSaved={isSaved}
                      />
                   </div>
               )}
            </div>

            {/* Replies List */}
            <div className="flex flex-col relative">
              {replies.map((reply, index) => {
                const replyPost: Post = {
                  ...reply,
                  type: 'text',
                  comments: 0,
                  shares: 0,
                  replies: [],
                  id: reply.id,
                };

                const isLast = index === replies.length - 1;

                return (
                  <div key={reply.id} className="relative pb-4">
                      {/* L-Shape Connector */}
                      <div className="absolute left-[32px] md:left-[36px] top-0 w-[10px] md:w-[40px] h-[36px] rounded-bl-lg md:rounded-bl-xl border-b-2 border-l-2 border-gray-200 dark:border-gray-700 z-10 pointer-events-none"></div>

                      {/* Vertical Extension */}
                      {!isLast && (
                          <div className="absolute left-[32px] md:left-[36px] top-[36px] bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700 z-10 pointer-events-none"></div>
                      )}

                      {/* Indented Post Card */}
                      <div className="pl-[46px] md:pl-[88px]">
                          <PostCard
                            post={replyPost}
                            hideReplies={true}
                            variant="card"
                            isThreadChild={false}
                            isThreadParent={false}
                          />
                      </div>
                  </div>
                );
              })}

              {replies.length === 0 && (
                  <div className="p-8 text-center text-gray-400 dark:text-gray-600">
                      No replies yet. Be the first to start the conversation!
                  </div>
              )}
            </div>
        </div>
      </div>

      <div className={`absolute bottom-4 left-0 right-0 z-30 px-4 transition-all duration-300 transform ${isScrolling ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div
            onClick={() => setIsReplyModalOpen(true)}
            className="relative rounded-full p-[1px] overflow-hidden pointer-events-auto shadow-2xl max-w-[720px] mx-auto cursor-pointer group"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-indigo-500 to-pink-500 animate-gradient-x opacity-100" />
            <div className="relative bg-white dark:bg-[#151A21] rounded-full pl-2 pr-2 flex items-center gap-2 h-[44px]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-pink-600 flex-shrink-0 flex items-center justify-center ml-0.5">
                    <img src={CURRENT_USER.avatar} className="w-full h-full rounded-full p-[1.5px] object-cover" alt="Me" />
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm flex-1 font-medium group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                    Post your reply...
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

      <CreatePostModal
          isOpen={isReplyModalOpen}
          onClose={() => setIsReplyModalOpen(false)}
          onCreatePost={handleCreateReply}
          hideTabs={true}
          initialContent=""
      />
    </div>
  );
};
