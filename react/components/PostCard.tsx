import { BarChart2, Bookmark, Brain, CheckCircle, CheckCircle2, EyeOff, Flag, Heart, HelpCircle, MessageSquare, MoreHorizontal, Pin, Share2, Sparkles, Star, Trash2, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useToast } from '../contexts/ToastContext';
import { summarizePost } from '../services/geminiService';
import { PollOption, Post } from '../types';
import { SharePopup } from './SharePopup';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
  hideReplies?: boolean;
  isThreadParent?: boolean;
  isThreadChild?: boolean;
  variant?: 'card' | 'thread';
  onToggleSave?: () => void;
  isSaved?: boolean;
  onTogglePin?: () => void;
}

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

// Simple sanitize to prevent basic XSS for the demo
const sanitizeHTML = (html: string) => {
    // Basic strip of script tags
    return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
               .replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gm, "")
               .replace(/on\w+="[^"]*"/g, "");
};

export const PostCard: React.FC<PostCardProps> = ({
    post,
    onClick,
    hideReplies = false,
    isThreadParent,
    isThreadChild,
    variant = 'card',
    onToggleSave,
    isSaved = false,
    onTogglePin
}) => {
  // Reaction State Logic
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    const total = post.likes;

    if (total > 0) {
        if (total === 1) {
            counts['❤️'] = 1;
        } else {
            const hearts = Math.ceil(total * 0.6);
            const thumbs = Math.floor(total * 0.3);
            const laughs = Math.max(0, total - hearts - thumbs);
            if (hearts > 0) counts['❤️'] = hearts;
            if (thumbs > 0) counts['👍'] = thumbs;
            if (laughs > 0) counts['😂'] = laughs;
        }
    }
    return counts;
  });

  const [userReaction, setUserReaction] = useState<string | null>(null);

  const totalLikes = Object.values(reactionCounts).reduce((a, b) => a + b, 0);
  const topReactions = Object.entries(reactionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emoji]) => emoji);

  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const { showToast } = useToast();

  const [selectedPollOption, setSelectedPollOption] = useState<string | null>(null);
  const [pollData, setPollData] = useState<PollOption[]>(post.pollOptions || []);

  const [triviaSelection, setTriviaSelection] = useState<string | null>(null);
  const [isTriviaRevealed, setIsTriviaRevealed] = useState(false);

  // Helper to extract plain text for summarization
  const getPlainText = (html: string) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || "";
  }

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (summary) {
      setSummary(null);
      return;
    }
    setIsSummarizing(true);
    showToast('Summarizing post...');
    const plainContent = getPlainText(post.content);
    const result = await summarizePost(plainContent);
    setSummary(result);
    setIsSummarizing(false);
    showToast('Summary ready!');
  };

  const handleReaction = (emoji: string) => {
    const newCounts = { ...reactionCounts };
    if (userReaction) {
        if (newCounts[userReaction]) {
            newCounts[userReaction]--;
            if (newCounts[userReaction] <= 0) delete newCounts[userReaction];
        }
    }
    if (userReaction === emoji) {
        setUserReaction(null);
        showToast('Removed reaction');
    } else {
        setUserReaction(emoji);
        newCounts[emoji] = (newCounts[emoji] || 0) + 1;
        showToast(`Reacted with ${emoji}`);
    }
    setReactionCounts(newCounts);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userReaction) {
        handleReaction(userReaction);
    } else {
        handleReaction('❤️');
    }
  };

  const handleVote = (optionId: string) => {
      if (selectedPollOption) return;
      setSelectedPollOption(optionId);
      setPollData(prev => prev.map(opt =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      ));
      showToast('Vote recorded!');
  };

  const handleTriviaGuess = (optionId: string) => {
      if (isTriviaRevealed) return;
      setTriviaSelection(optionId);
      setIsTriviaRevealed(true);
      const isCorrect = optionId === post.correctOptionId;
      showToast(isCorrect ? 'Correct Answer! 🎉' : 'Wrong Answer 😅');
  };

  const handleMenuAction = (action: string) => {
      if (action === 'Pin' && onTogglePin) {
          onTogglePin();
          showToast(post.isPinned ? 'Post Unpinned' : 'Post Pinned');
      } else {
          showToast(`${action} action triggered`);
      }
      setShowMenu(false);
  }

  const handleReplyClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowReplyEditor(true);
  };

  const handleReplySubmit = (content: string) => {
      console.log('Reply submitted:', content);
      showToast('Reply posted!');
      // Here you would typically make an API call to post the reply
  };

  React.useEffect(() => {
    const handleClick = () => setShowMenu(false);
    if(showMenu) window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [showMenu]);

  const getBadgeIcon = (badge: string) => {
      switch(badge) {
          case 'POLL': return <BarChart2 size={10} className="stroke-[3]" />;
          case 'TRIVIA': return <Brain size={10} className="stroke-[3]" />;
          case 'Q&A': return <HelpCircle size={10} className="stroke-[3]" />;
          default: return null;
      }
  };

  // Render badge based on user state (Verified, New, or None)
  const renderUserBadge = () => {
    if (post.user.verified) {
      return (
        <span className="inline-flex items-center" title="Verified Account">
          <CheckCircle size={14} className="text-blue-500 fill-blue-500 text-white" />
        </span>
      );
    } else if (post.user.isNew) {
      return (
        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1" title="New Member">
           <Sparkles size={8} className="fill-current" /> NEW
        </span>
      );
    } else {
      // "Not verified" state - can be implicit or explicit based on request.
      // Assuming a subtle "Member" badge is what's needed to differentiate.
      return (
         <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded" title="Community Member">
            MEMBER
         </span>
      );
    }
  };

  const hasReplies = post.replies && post.replies.length > 0;
  const isThread = variant === 'thread';

  let containerClasses = `relative p-3 md:p-4 transition-all ${onClick ? 'cursor-pointer' : ''}`;

  if (isThread) {
      containerClasses += " overflow-visible";
  } else {
      containerClasses += ` bg-white dark:bg-[#151A21] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md group/card ${isThreadParent ? 'overflow-visible' : 'overflow-hidden'}`;
  }

  // --- SPECIAL LAYOUT FOR ARTICLE TYPE ---
  if (post.type === 'article') {
      return (
        <div onClick={onClick} className={containerClasses}>
            {/* Pinned Label */}
            {post.isPinned && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2 pl-4 md:pl-12">
                    <Pin size={12} className="fill-gray-500 dark:fill-gray-400" />
                    <span>Pinned</span>
                </div>
            )}

            {/* Thread Connecting Lines (if needed) */}
            {(isThread || (variant === 'card' && isThreadParent)) && (
                <>
                    {isThreadChild && (
                        <div className="absolute top-0 h-[36px] left-[32px] md:left-[36px] w-[2px] bg-gray-200 dark:bg-gray-800 -translate-x-1/2 z-0"></div>
                    )}
                    {isThreadParent && (
                        <div className="absolute top-[36px] bottom-0 left-[32px] md:left-[36px] w-[2px] bg-gray-200 dark:bg-gray-800 -translate-x-1/2 z-0"></div>
                    )}
                </>
            )}

            <div className="flex gap-3 relative z-10">
                {/* Left Col: Square Image/Avatar */}
                <div className="flex-shrink-0 flex flex-col items-center relative">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-gray-100 dark:ring-gray-800 z-20 relative">
                        <img src={post.articleImage || post.user.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                     {/* Internal Thread Line */}
                     {!isThread && !hideReplies && hasReplies && (
                        <div className="absolute top-10 -bottom-8 left-1/2 -translate-x-1/2 w-[2px] bg-gray-200 dark:bg-gray-800"></div>
                    )}
                </div>

                {/* Right Col: Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <div>
                             {/* Title First for Articles */}
                             <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight mb-0.5">
                                {post.reviewTitle || "Untitled Article"}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{post.user.name}</span>
                                {renderUserBadge()}
                                <span>•</span>
                                <span>{post.timestamp}</span>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                                className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors -mr-2"
                                title="More options"
                            >
                                <MoreHorizontal size={18} />
                            </button>
                            {/* Menu Dropdown - reusing logic */}
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1A1F26] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                    {onToggleSave && (
                                        <button onClick={(e) => { e.stopPropagation(); onToggleSave(); setShowMenu(false); showToast(isSaved ? 'Post Unsaved' : 'Post Saved'); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                            <Bookmark size={14} className={isSaved ? "fill-current" : ""} /> {isSaved ? "Unsave Post" : "Save Post"}
                                        </button>
                                    )}
                                    {onTogglePin && (
                                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction('Pin'); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                            <Pin size={14} className={post.isPinned ? "fill-current" : ""} /> {post.isPinned ? "Unpin Post" : "Pin Post"}
                                        </button>
                                    )}
                                    <button onClick={(e) => { e.stopPropagation(); handleMenuAction('Hide'); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                        <EyeOff size={14} /> Not Interested
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2 prose-lite"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
                    />

                    {/* Action Bar */}
                    <div className="flex items-center justify-between -ml-2 mt-1">
                        {/* Simplified Actions for Article */}
                         <div className="relative group">
                            <button
                                onClick={toggleLike}
                                className={`flex items-center gap-2 text-sm font-medium transition-all p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/10 group ${userReaction ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}
                                title="Like"
                            >
                                <Heart size={16} fill={userReaction ? "currentColor" : "none"} strokeWidth={userReaction ? 0 : 2} />
                                <span className="text-xs">{totalLikes || 'Like'}</span>
                            </button>
                        </div>
                         <button
                            onClick={handleReplyClick}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors p-2 rounded-full"
                            title="Reply"
                        >
                            <MessageSquare size={16} />
                            <span className="text-xs">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors p-2 rounded-full" title="Share">
                            <Share2 size={16} />
                            <span className="text-xs">{post.shares}</span>
                        </button>
                    </div>
                </div>
            </div>
             {/* Reply Section for Article - Hidden when hideReplies is true */}
            {!hideReplies && hasReplies && !isThread && (
                <div className="mt-0">
                     {post.replies!.slice(0, 1).map(reply => (
                        <div key={reply.id} className="flex gap-3 relative pt-2">
                             {/* Connector Column for Article Reply */}
                             <div className="w-10 flex-shrink-0 relative">
                                  <div className="absolute top-[-10px] left-1/2 -translate-x-[1px] w-[20px] h-[26px] border-l-[2px] border-b-[2px] border-gray-200 dark:border-gray-800 rounded-bl-xl"></div>
                             </div>
                            <div className="flex-1 flex gap-3">
                                <div className="flex-shrink-0">
                                    <img src={reply.user.avatar} alt={reply.user.name} className="w-5 h-5 rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-800" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-xs font-bold text-gray-900 dark:text-white">{reply.user.name}</span>
                                        <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                    </div>
                                    <div
                                        className="text-sm text-gray-800 dark:text-gray-200 prose-lite"
                                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(reply.content) }}
                                    />
                                </div>
                            </div>
                        </div>
                     ))}
                </div>
            )}
        </div>
      );
  }

  // --- DEFAULT CARD LAYOUT ---
  return (
    <div onClick={onClick} className={containerClasses}>

      {/* Pinned Label */}
      {post.isPinned && (
         <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2 pl-12">
             <Pin size={12} className="fill-gray-500 dark:fill-gray-400" />
             <span>Pinned</span>
         </div>
      )}

      {/* Thread Connecting Lines */}
      {(isThread || (variant === 'card' && isThreadParent)) && (
          <>
            {isThreadChild && (
                <div className="absolute top-0 h-[36px] left-[32px] md:left-[36px] w-[2px] bg-gray-200 dark:bg-gray-800 -translate-x-1/2 z-0"></div>
            )}

            {isThreadParent && (
                <div className="absolute top-[36px] bottom-0 left-[32px] md:left-[36px] w-[2px] bg-gray-200 dark:bg-gray-800 -translate-x-1/2 z-0"></div>
            )}
          </>
      )}

      {/* Main Post Section */}
      <div className="flex gap-3 relative z-10">
        {/* Avatar Column */}
        <div className="flex-shrink-0 flex flex-col items-center relative">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className={`w-10 h-10 rounded-full object-cover z-20 relative bg-white dark:bg-[#151A21] ${isThread ? 'ring-4 ring-gray-50 dark:ring-[#0B0E11]' : ''}`}
            />

            {!isThread && !hideReplies && hasReplies && (
                <div className="absolute top-10 -bottom-8 left-1/2 -translate-x-1/2 w-[2px] bg-gray-200 dark:bg-gray-800"></div>
            )}
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-1.5 flex-wrap leading-tight">
                    <span className="font-bold text-gray-900 dark:text-white text-[15px]">{post.user.name}</span>

                    {/* User Badges */}
                    {renderUserBadge()}

                    <span className="text-gray-500 text-[13px]">{post.user.handle}</span>
                    <span className="text-gray-300 dark:text-gray-700 text-[10px]">•</span>
                    <span className="text-gray-500 text-[13px] hover:underline cursor-pointer" title={post.timestamp}>{post.timestamp}</span>

                    {post.badge && (
                        <span className={`ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded border opacity-90 flex items-center gap-1 ${
                            post.badge === 'POLL' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                            post.badge === 'TRIVIA' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                            post.badge === 'Q&A' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                            'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                            {getBadgeIcon(post.badge)}
                            {post.badge}
                        </span>
                    )}
                </div>

                <div className="relative z-10">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                        className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors -mr-2"
                        title="More options"
                    >
                        <MoreHorizontal size={18} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1A1F26] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                            {onToggleSave && (
                                <button onClick={(e) => { e.stopPropagation(); onToggleSave(); setShowMenu(false); showToast(isSaved ? 'Post Unsaved' : 'Post Saved'); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                    <Bookmark size={14} className={isSaved ? "fill-current" : ""} /> {isSaved ? "Unsave Post" : "Save Post"}
                                </button>
                            )}
                            {onTogglePin && (
                                <button onClick={(e) => { e.stopPropagation(); handleMenuAction('Pin'); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                    <Pin size={14} className={post.isPinned ? "fill-current" : ""} /> {post.isPinned ? "Unpin Post" : "Pin Post"}
                                </button>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); handleMenuAction('Hide'); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                <EyeOff size={14} /> Not Interested
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleMenuAction('Report'); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                <Flag size={14} /> Report
                            </button>
                            <div className="h-px bg-gray-100 dark:bg-gray-700 my-0.5"></div>
                            <button onClick={(e) => { e.stopPropagation(); handleMenuAction('Delete'); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 font-medium">
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Post Content Body */}
            <div>
                {/* Review Title */}
                {post.reviewTitle && (
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">{post.reviewTitle}</h3>
                        <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(star => (
                                <Star key={star} size={12} fill={star <= (post.rating || 0) ? "#FACC15" : "none"} className={star <= (post.rating || 0) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Text Content (Rich HTML) */}
                <div className={`text-gray-900 dark:text-gray-100 text-[15px] leading-normal mb-3 font-normal prose-lite ${post.type === 'qna' ? 'flex gap-3' : ''}`}>
                    {post.type === 'qna' && (
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400">
                             <HelpCircle size={18} />
                        </div>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }} />
                </div>

                {/* Poll Renderer */}
                {post.type === 'poll' && pollData && (
                    <div className="flex flex-col gap-2 mt-3 mb-2 w-full" onClick={e => e.stopPropagation()}>
                        {pollData.map(option => {
                            const total = pollData.reduce((acc, curr) => acc + curr.votes, 0);
                            const percent = total > 0 ? Math.round((option.votes / total) * 100) : 0;
                            const isSelected = selectedPollOption === option.id;
                            const hasVoted = !!selectedPollOption;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleVote(option.id)}
                                    disabled={hasVoted}
                                    className={`
                                        relative w-full text-left rounded-xl overflow-hidden transition-all duration-200
                                        min-h-[40px] flex items-center group
                                        ${!hasVoted
                                            ? 'border border-blue-200 dark:border-blue-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-[0.98] cursor-pointer shadow-sm'
                                            : 'border border-transparent bg-gray-50 dark:bg-[#0F1216] cursor-default'}
                                    `}
                                >
                                    {hasVoted && (
                                        <div
                                            className={`absolute inset-y-0 left-0 h-full transition-all duration-700 ease-out rounded-r-lg ${
                                                isSelected
                                                    ? 'bg-blue-100 dark:bg-blue-500/20'
                                                    : 'bg-gray-200 dark:bg-gray-800'
                                            }`}
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    )}

                                    <div className="relative z-10 w-full flex items-center justify-between px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            {isSelected && (
                                                <div className="bg-blue-500 rounded-full p-0.5 animate-in zoom-in duration-200">
                                                    <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
                                                </div>
                                            )}
                                            <span className={`text-[14px] font-medium leading-snug ${
                                                isSelected
                                                    ? 'text-blue-700 dark:text-blue-300'
                                                    : hasVoted
                                                        ? 'text-gray-700 dark:text-gray-300'
                                                        : 'text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300'
                                            }`}>
                                                {option.text}
                                            </span>
                                        </div>

                                        {hasVoted && (
                                            <span className={`text-xs font-bold ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {percent}%
                                            </span>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                        <div className="px-1 flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                            <span>{post.totalVotes?.toLocaleString()} votes</span>
                            <span>{selectedPollOption ? 'Final results' : 'Poll open'}</span>
                        </div>
                    </div>
                )}

                {/* Trivia Renderer */}
                {post.type === 'trivia' && post.pollOptions && (
                    <div className="flex flex-col gap-2 mt-3 mb-2 w-full" onClick={e => e.stopPropagation()}>
                        {post.pollOptions.map(option => {
                            const isSelected = triviaSelection === option.id;
                            const isCorrect = option.id === post.correctOptionId;

                            let containerClasses = "relative w-full text-left rounded-xl border transition-all duration-200 min-h-[40px] flex items-center px-4 py-2.5 group shadow-sm";
                            let textClasses = "text-[14px] font-medium leading-snug flex-1";
                            let IconComponent = null;

                            if (!isTriviaRevealed) {
                                containerClasses += " border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151A21] hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98] cursor-pointer hover:border-gray-300 dark:hover:border-gray-700";
                                textClasses += " text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white";
                            } else {
                                if (isCorrect) {
                                    containerClasses += " border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500/20";
                                    textClasses += " text-green-700 dark:text-green-300 font-bold";
                                    IconComponent = <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" strokeWidth={3} />;
                                } else if (isSelected) {
                                    containerClasses += " border-red-500 bg-red-50 dark:bg-red-900/20";
                                    textClasses += " text-red-700 dark:text-red-300";
                                    IconComponent = <XCircle size={18} className="text-red-500 dark:text-red-400" strokeWidth={3} />;
                                } else {
                                    containerClasses += " border-transparent bg-gray-50 dark:bg-gray-900 opacity-50";
                                    textClasses += " text-gray-500 dark:text-gray-500";
                                }
                            }

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleTriviaGuess(option.id)}
                                    disabled={isTriviaRevealed}
                                    className={containerClasses}
                                >
                                    <span className={textClasses}>{option.text}</span>
                                    {IconComponent && (
                                        <div className="animate-in zoom-in duration-300 ml-3">
                                            {IconComponent}
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                        <div className="px-1 flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                            <span>Trivia Challenge</span>
                            <span>
                                {isTriviaRevealed
                                    ? (triviaSelection === post.correctOptionId ? 'Correct! 🎉' : 'Incorrect 😅')
                                    : 'Select an answer'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Q&A Tags */}
                {post.type === 'qna' && post.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.map(tag => (
                            <span key={tag} className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Article Image or Link Preview */}
                {(post.articleImage || post.linkPreview) && (
                    <div className="mb-3 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-[#0F1216] hover:bg-gray-100 dark:hover:bg-[#16191D] transition-colors cursor-pointer group/link">
                        {post.articleImage ? (
                             <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 relative">
                                 <img src={post.articleImage} alt="Article" className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                                     <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{post.reviewTitle || "Read full article"}</h3>
                                 </div>
                             </div>
                        ) : (
                            <div className="flex">
                                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                                    <img src={post.linkPreview!.image} alt="Preview" className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover/link:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-3 flex flex-col justify-center min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate group-hover/link:text-blue-500 dark:group-hover/link:text-blue-400 transition-colors">{post.linkPreview!.title}</h3>
                                    <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">{post.linkPreview!.description}</p>
                                    <span className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></span>
                                        {new URL(post.linkPreview!.url).hostname}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* AI Summary */}
                {summary && (
                    <div className="mb-3 p-3 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-[#151A21] border border-purple-100 dark:border-purple-500/10 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">AI Summary</span>
                        </div>
                        <p className="text-[13px] text-gray-700 dark:text-gray-300 italic leading-relaxed">"{summary}"</p>
                    </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between -ml-2 mt-1">
                    {/* Like / Reaction Group */}
                    <div className="relative group">
                        {/* Reaction Popover */}
                        <div className="absolute bottom-full left-0 mb-1 bg-white dark:bg-[#1A1F26] rounded-full shadow-xl border border-gray-200 dark:border-gray-700 p-1 flex gap-0.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 scale-90 group-hover:scale-100 origin-bottom-left">
                            {REACTIONS.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={(e) => { e.stopPropagation(); handleReaction(emoji); }}
                                    className={`w-8 h-8 flex items-center justify-center hover:scale-125 transition-transform text-lg ${userReaction === emoji ? 'bg-gray-100 dark:bg-gray-800 rounded-full' : ''}`}
                                    title={`React with ${emoji}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={toggleLike}
                            className={`flex items-center gap-2 text-sm font-medium transition-all p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/10 group ${userReaction ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}
                            title="Like"
                        >
                            {topReactions.length > 0 ? (
                                <div className="flex -space-x-1.5 items-center mr-0.5">
                                    {topReactions.map((emoji, idx) => (
                                        <div
                                            key={emoji}
                                            className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[11px] ring-2 ring-white dark:ring-[#151A21] shadow-sm relative z-[1]"
                                            style={{ zIndex: 3 - idx }}
                                        >
                                            {emoji}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Heart size={18} fill={userReaction ? "currentColor" : "none"} strokeWidth={userReaction ? 0 : 2} />
                            )}

                            <span className={`text-xs ${userReaction ? 'font-bold' : ''}`}>{totalLikes || 'Like'}</span>
                        </button>
                    </div>

                    <button
                        onClick={handleReplyClick}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors p-2 rounded-full"
                        title="Reply"
                    >
                        <MessageSquare size={18} />
                        <span className="text-xs">{post.comments}</span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowShare(!showShare); }}
                            className={`flex items-center gap-1.5 text-sm font-medium transition-colors p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/10 ${showShare ? 'text-green-500' : 'text-gray-500 dark:text-gray-400 hover:text-green-500'}`}
                            title="Share"
                        >
                            <Share2 size={18} />
                            <span className="text-xs">{post.shares}</span>
                        </button>
                        {showShare && (
                            <div className="absolute bottom-full right-0 mb-2 z-20" onClick={e => e.stopPropagation()}>
                                <SharePopup onClose={() => setShowShare(false)} />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSummarize}
                        disabled={isSummarizing}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/10 ${summary ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400 hover:text-purple-600'}`}
                        title="AI Summarize"
                    >
                        <Sparkles size={18} className={isSummarizing ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Reply Section - Hidden when hideReplies is true */}
      {!hideReplies && hasReplies && !isThread && (
          <div className="mt-0">
            {post.replies!.slice(0, 1).map(reply => (
                <div key={reply.id} className="flex gap-3 relative pt-2">
                     <div className="w-10 flex-shrink-0 relative">
                         <div className="absolute top-[-20px] left-1/2 -translate-x-[1px] w-[22px] h-[34px] border-l-[2px] border-b-[2px] border-gray-200 dark:border-gray-800 rounded-bl-xl"></div>
                     </div>
                     <div className="flex-1 flex gap-3">
                         <div className="flex-shrink-0">
                             <img src={reply.user.avatar} alt={reply.user.name} className="w-6 h-6 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800" />
                         </div>
                         <div className="flex-1">
                             <div className="flex items-center gap-1.5">
                                 <span className="text-xs font-bold text-gray-900 dark:text-white">{reply.user.name}</span>
                                 <span className="text-xs text-gray-500">{reply.timestamp}</span>
                             </div>
                             <div
                                className="text-sm text-gray-800 dark:text-gray-200 mt-0.5 prose-lite"
                                dangerouslySetInnerHTML={{ __html: sanitizeHTML(reply.content) }}
                             />
                             <div className="flex items-center gap-3 mt-1.5">
                                 <button className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
                                     <Heart size={12} /> {reply.likes}
                                 </button>
                                 <button className="text-xs text-gray-400 hover:text-blue-500">Reply</button>
                             </div>
                         </div>
                     </div>
                </div>
            ))}
          </div>
      )}

      {/* Reply Editor Modal */}
      <ReplyEditor
          isOpen={showReplyEditor}
          onClose={() => setShowReplyEditor(false)}
          replyingTo={post}
          onSubmit={handleReplySubmit}
          mode="reply"
      />
    </div>
  );
};
