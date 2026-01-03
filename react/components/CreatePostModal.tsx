import { BarChart2, Bold, Brain, CheckCircle2, Code, Hash, Heading1, Heading2, HelpCircle, Image, Italic, Link as LinkIcon, List, ListOrdered, MapPin, MoreHorizontal, Plus, Quote, Send, Smile, Sparkles, Star, Trash2, Type, Underline, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { CURRENT_USER } from '../constants';
import { useToast } from '../contexts/ToastContext';
import { generatePostDraft } from '../services/geminiService';
import { Post } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent?: string;
  onCreatePost: (post: Post) => void;
  hideTabs?: boolean;
}

type PostType = 'text' | 'poll' | 'trivia' | 'review' | 'qna';

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, initialContent = '', onCreatePost, hideTabs = false }) => {
  const [activeType, setActiveType] = useState<PostType>('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast } = useToast();

  // Rich Text Editor State
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState(initialContent);

  // Poll & Trivia State
  const [options, setOptions] = useState([
      { id: '1', text: '' },
      { id: '2', text: '' }
  ]);
  const [correctOption, setCorrectOption] = useState<string | null>(null);

  // Review State
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');

  // Q&A State
  const [tags, setTags] = useState('');

  // Animation state
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
        // Reset editor content when opening if starting fresh
        if (!initialContent && editorRef.current) {
            editorRef.current.innerHTML = '';
            setHtmlContent('');
        }
    } else {
        const timer = setTimeout(() => setIsVisible(false), 500);
        document.body.style.overflow = 'unset';
        return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, initialContent]);

  // Sync content for AI drafts
  useEffect(() => {
      if (editorRef.current && htmlContent !== editorRef.current.innerHTML) {
          // If state updated externally (e.g. AI draft), sync div
          editorRef.current.innerHTML = htmlContent;
      }
  }, [htmlContent]);

  // Rich Text Commands
  const execCmd = (command: string, value: string | undefined = undefined) => {
      document.execCommand(command, false, value);
      if (editorRef.current) {
          editorRef.current.focus();
          setHtmlContent(editorRef.current.innerHTML);
      }
  };

  const handleLink = () => {
      const url = prompt("Enter URL:");
      if (url) execCmd('createLink', url);
  };

  const handleGenerateAI = async () => {
      // Get plain text for context
      const currentText = editorRef.current?.innerText || '';

      if (!currentText.trim() && activeType === 'text') {
           showToast("Please enter a topic first");
           return;
      }
      setIsGenerating(true);
      const draft = await generatePostDraft(currentText || "Trending tech topic", "Professional but engaging");

      // Convert plain text draft to simple HTML paragraphs
      const formattedDraft = draft.split('\n').map(line => line ? `<p>${line}</p>` : '<br>').join('');

      setHtmlContent(formattedDraft);
      setIsGenerating(false);
      showToast("Draft generated!");
  };

  const handleAddOption = () => {
      if (options.length < 4) {
          setOptions([...options, { id: Date.now().toString(), text: '' }]);
      }
  };

  const handleRemoveOption = (id: string) => {
      if (options.length > 2) {
          setOptions(options.filter(o => o.id !== id));
          if (correctOption === id) setCorrectOption(null);
      }
  };

  const handleOptionChange = (id: string, text: string) => {
      setOptions(options.map(o => o.id === id ? { ...o, text } : o));
  };

  const handleSubmit = () => {
      // Get content
      const finalContent = editorRef.current?.innerHTML || '';
      const cleanText = editorRef.current?.innerText || '';

      // Validation
      if (!cleanText.trim() && !finalContent.includes('<img') && activeType === 'text') {
        showToast("Please write something!");
        return;
      }

      // Construct Post Object
      const newPost: Post = {
          id: Date.now().toString(),
          user: CURRENT_USER,
          type: activeType,
          content: finalContent, // Store HTML
          timestamp: 'Just now',
          likes: 0,
          comments: 0,
          shares: 0,
      };

      // Type-specific data construction
      if (activeType === 'poll') {
          if(options.some(o => !o.text.trim())) {
              showToast("Please fill all poll options");
              return;
          }
          newPost.pollOptions = options.map(o => ({ ...o, votes: 0 }));
          newPost.badge = 'POLL';
          newPost.totalVotes = 0;
      } else if (activeType === 'trivia') {
          if (!correctOption) {
              showToast("Please select the correct answer!");
              return;
          }
          if(options.some(o => !o.text.trim())) {
              showToast("Please fill all trivia options");
              return;
          }
          newPost.pollOptions = options.map(o => ({ ...o, votes: 0 }));
          newPost.correctOptionId = correctOption;
          newPost.badge = 'TRIVIA';
      } else if (activeType === 'review') {
          if (!reviewTitle.trim() || rating === 0) {
              showToast("Please provide a title and rating");
              return;
          }
          newPost.reviewTitle = reviewTitle;
          newPost.rating = rating;
      } else if (activeType === 'qna') {
          if (!tags.trim()) {
              showToast("Please add at least one tag");
              return;
          }
          newPost.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
          newPost.badge = 'Q&A';
      }

      onCreatePost(newPost);
      showToast("Post created successfully!");
      onClose();

      // Reset states
      setTimeout(() => {
          setHtmlContent('');
          if(editorRef.current) editorRef.current.innerHTML = '';
          setActiveType('text');
          setOptions([{ id: '1', text: '' }, { id: '2', text: '' }]);
          setRating(0);
          setTags('');
          setReviewTitle('');
          setCorrectOption(null);
      }, 300);
  };

  const ToolbarButton = ({ icon: Icon, cmd, val, title, isActive = false }: any) => (
      <button
        onMouseDown={(e) => { e.preventDefault(); execCmd(cmd, val); }}
        className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
        title={title}
      >
          <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
      </button>
  );

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[1000] flex items-end justify-center transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>

        {/* Backdrop */}
        <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        />

        {/* Modal Panel */}
        <div className={`
            bg-white dark:bg-[#151A21]
            w-full md:max-w-2xl
            rounded-t-3xl rounded-b-none md:rounded-2xl md:mb-6
            shadow-2xl border-t border-x md:border border-gray-200 dark:border-gray-800
            overflow-hidden flex flex-col
            max-h-[90vh] h-auto
            relative z-10
            transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)
            transform
            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        `}>

            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/50 dark:bg-[#151A21]/50 backdrop-blur-md z-10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {hideTabs ? 'Reply' : 'Create Post'}
                </h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Type Selector Tabs - Hidden if hideTabs is true */}
            {!hideTabs && (
                <div className="flex px-3 py-2 gap-2 overflow-x-auto scrollbar-hide border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-black/10">
                    {[
                        { id: 'text', label: 'Post', icon: Type },
                        { id: 'review', label: 'Review', icon: Star },
                        { id: 'poll', label: 'Poll', icon: BarChart2 },
                        { id: 'trivia', label: 'Trivia', icon: Brain },
                        { id: 'qna', label: 'Q&A', icon: HelpCircle },
                    ].map((type) => {
                        const Icon = type.icon;
                        const isActive = activeType === type.id;
                        return (
                            <button
                                key={type.id}
                                onClick={() => setActiveType(type.id as PostType)}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                    isActive
                                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-sm'
                                }`}
                            >
                                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                {type.label}
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-hide bg-gray-50/20 dark:bg-black/20">

                {/* Review Specific Inputs */}
                {activeType === 'review' && !hideTabs && (
                    <div className="mb-4 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <input
                            type="text"
                            placeholder="What are you reviewing?"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            className="w-full bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-gray-400"
                        />
                        <div className="flex items-center gap-2 p-3 bg-white dark:bg-[#1A1F26] rounded-xl border border-gray-200 dark:border-gray-800">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Rating:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setRating(star)} className="focus:outline-none transform hover:scale-110 transition-transform">
                                    <Star
                                        size={28}
                                        className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* RICH TEXT EDITOR AREA */}
                <div className="bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all flex flex-col group min-h-[200px]">
                    {/* Functional Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-[#0B0E11]/50 backdrop-blur-sm sticky top-0 z-10">
                        {/* Headers */}
                        <div className="flex items-center gap-0.5 border-r border-gray-200 dark:border-gray-700 pr-2 mr-1">
                            <ToolbarButton icon={Type} cmd="formatBlock" val="p" title="Normal Text" />
                            <ToolbarButton icon={Heading1} cmd="formatBlock" val="h1" title="Large Heading" />
                            <ToolbarButton icon={Heading2} cmd="formatBlock" val="h2" title="Medium Heading" />
                        </div>

                        {/* Styles */}
                        <div className="flex items-center gap-0.5 border-r border-gray-200 dark:border-gray-700 pr-2 mr-1">
                            <ToolbarButton icon={Bold} cmd="bold" title="Bold" />
                            <ToolbarButton icon={Italic} cmd="italic" title="Italic" />
                            <ToolbarButton icon={Underline} cmd="underline" title="Underline" />
                            <ToolbarButton icon={Code} cmd="formatBlock" val="pre" title="Code Block" />
                            <ToolbarButton icon={Quote} cmd="formatBlock" val="blockquote" title="Quote" />
                        </div>

                        {/* Lists */}
                        <div className="flex items-center gap-0.5 border-r border-gray-200 dark:border-gray-700 pr-2 mr-1">
                             <ToolbarButton icon={List} cmd="insertUnorderedList" title="Bullet List" />
                             <ToolbarButton icon={ListOrdered} cmd="insertOrderedList" title="Numbered List" />
                        </div>

                        {/* Insert */}
                        <button
                            onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
                            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            title="Insert Link"
                        >
                            <LinkIcon size={16} />
                        </button>

                        <div className="flex-1"></div>

                        {/* AI Action */}
                        <button
                            onClick={handleGenerateAI}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${isGenerating ? 'bg-purple-100 text-purple-600 border-purple-200' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40'}`}
                        >
                            <Sparkles size={14} className={isGenerating ? 'animate-spin' : ''} />
                            {isGenerating ? 'Drafting...' : 'AI Draft'}
                        </button>
                    </div>

                    {/* Content Editable Area */}
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={(e) => setHtmlContent(e.currentTarget.innerHTML)}
                        className="rich-editor w-full flex-1 p-5 outline-none overflow-y-auto text-[15px] leading-relaxed text-gray-900 dark:text-gray-100 min-h-[160px] prose-lite"
                        data-placeholder={
                            activeType === 'qna' ? "Ask your question..." :
                            activeType === 'poll' ? "Ask a question for your poll..." :
                            activeType === 'trivia' ? "What's the trivia question?" :
                            activeType === 'review' ? "Write your review..." :
                            hideTabs ? "Post your reply..." : "What's on your mind? (Use toolbar for formatting)"
                        }
                    />
                </div>

                {/* Poll / Trivia Options */}
                {((activeType === 'poll' || activeType === 'trivia') && !hideTabs) && (
                    <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Options</label>
                            <span className="text-[10px] text-gray-400">{options.length}/4</span>
                        </div>

                        {options.map((opt, idx) => (
                            <div key={opt.id} className="flex items-center gap-2 group">
                                {activeType === 'trivia' && (
                                    <button
                                        onClick={() => setCorrectOption(opt.id)}
                                        title="Mark as correct answer"
                                        className={`p-2 rounded-full transition-colors ${correctOption === opt.id ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-gray-300 hover:text-green-500'}`}
                                    >
                                        <CheckCircle2 size={20} className={correctOption === opt.id ? 'fill-current' : ''} />
                                    </button>
                                )}
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={opt.text}
                                        onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                                        placeholder={`Option ${idx + 1}`}
                                        className={`w-full bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${activeType === 'trivia' && correctOption === opt.id ? 'border-green-500 ring-1 ring-green-500/20' : ''}`}
                                    />
                                </div>
                                {options.length > 2 && (
                                    <button
                                        onClick={() => handleRemoveOption(opt.id)}
                                        className="p-2.5 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {options.length < 4 && (
                            <button
                                onClick={handleAddOption}
                                className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors px-2 py-1 mt-2"
                            >
                                <Plus size={16} /> Add Option
                            </button>
                        )}

                        {activeType === 'trivia' && !correctOption && (
                            <p className="text-xs text-amber-500 mt-2 flex items-center gap-1 animate-pulse font-medium">
                                <Brain size={14} /> Please select the correct answer by clicking the circle next to an option.
                            </p>
                        )}
                    </div>
                )}

                {/* Q&A Specific Inputs */}
                {activeType === 'qna' && !hideTabs && (
                    <div className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                         <div className="relative">
                            <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Add tags (e.g. react, career, advice)..."
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                    </div>
                )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#151A21]/90 backdrop-blur-md z-20">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Add to your {hideTabs ? 'reply' : 'post'}</span>

                        <div className="flex items-center gap-1">
                             {/* Photo/Video */}
                             <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-green-600 dark:text-green-500 transition-all" title="Photo/Video">
                                <Image size={20} />
                             </button>

                             {/* Tag People */}
                             <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-500 transition-all" title="Tag People">
                                <User size={20} />
                             </button>

                             {/* Feeling/Activity */}
                             <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-yellow-600 dark:text-yellow-500 transition-all" title="Feeling/Activity">
                                <Smile size={20} />
                             </button>

                             {/* Check In */}
                             <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-500 transition-all" title="Check In">
                                <MapPin size={20} />
                             </button>

                             {/* More */}
                             <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all">
                                <MoreHorizontal size={20} />
                             </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                        {hideTabs ? 'Reply' : 'Post'} <Send size={18} className="ml-1" />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
