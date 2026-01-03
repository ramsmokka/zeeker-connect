import {
    AtSign,
    BarChart2,
    Brain,
    HelpCircle,
    Image,
    MapPin,
    Send,
    Smile,
    Sparkles,
    Star,
    X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Post } from '../types';

interface ReplyEditorProps {
  isOpen: boolean;
  onClose: () => void;
  replyingTo?: Post | null;
  onSubmit: (content: string) => void;
  mode?: 'reply' | 'create';
  placeholder?: string;
}

export const ReplyEditor: React.FC<ReplyEditorProps> = ({
  isOpen,
  onClose,
  replyingTo,
  onSubmit,
  mode = 'reply',
  placeholder = "What's on your mind? (Use toolbar for formatting)"
}) => {
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'post' | 'review' | 'poll' | 'trivia' | 'qna'>('post');
  const quillRef = useRef<ReactQuill>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Reset content when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setContent('');
      setActiveTab('post');
    }
  }, [isOpen]);

  // Auto-focus editor when opened
  useEffect(() => {
    if (isOpen && quillRef.current) {
      const editor = quillRef.current.getEditor();
      setTimeout(() => {
        if (editor) {
          editor.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent('');
      onClose();
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script', 'sub', 'super',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'align', 'direction',
    'link', 'image', 'video', 'formula'
  ];

  if (!isOpen) return null;

  const getTabIcon = (tab: string) => {
    switch(tab) {
      case 'review': return <Star size={16} className="stroke-[2.5]" />;
      case 'poll': return <BarChart2 size={16} className="stroke-[2.5]" />;
      case 'trivia': return <Brain size={16} className="stroke-[2.5]" />;
      case 'qna': return <HelpCircle size={16} className="stroke-[2.5]" />;
      default: return <Sparkles size={16} className="stroke-[2.5]" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-start justify-center z-[9999] p-4 pt-12 overflow-y-auto">
        <div
          className="bg-[#1C2127] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-700/50 animate-in zoom-in-95 slide-in-from-top-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white">
              {mode === 'reply' && replyingTo ? 'Reply to ' + replyingTo.user.name : 'Create Post'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full p-2 transition-all duration-200 active:scale-95"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Replying To Context */}
          {mode === 'reply' && replyingTo && (
            <div className="mx-6 mt-4 p-4 bg-[#151A21] rounded-xl border border-gray-700/30 animate-in slide-in-from-top-2 duration-300">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <img
                    src={replyingTo.user.avatar}
                    alt={replyingTo.user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-700/50"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{replyingTo.user.name}</span>
                    <span className="text-gray-500 text-xs">@{replyingTo.user.handle}</span>
                    <span className="text-gray-600 text-xs">• {replyingTo.timestamp}</span>
                  </div>
                  <div className="text-gray-300 text-sm mb-1">
                    <span className="text-gray-500 text-xs mb-1 block">Replying to this</span>
                  </div>
                  <div
                    className="text-gray-400 text-sm line-clamp-2 prose prose-sm prose-invert"
                    dangerouslySetInnerHTML={{ __html: replyingTo.content }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-gray-700/30">
            <button
              onClick={() => setActiveTab('post')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'post'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              Post
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'review'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              {getTabIcon('review')}
              Review
            </button>
            <button
              onClick={() => setActiveTab('poll')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'poll'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              {getTabIcon('poll')}
              Poll
            </button>
            <button
              onClick={() => setActiveTab('trivia')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'trivia'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              {getTabIcon('trivia')}
              Trivia
            </button>
            <button
              onClick={() => setActiveTab('qna')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'qna'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              {getTabIcon('qna')}
              Q&A
            </button>
          </div>

          {/* Editor Container */}
          <div className={`relative transition-all duration-300 ${isFocused ? 'ring-2 ring-blue-500/50 m-6 rounded-xl' : 'm-6'}`}>
            <div className="quill-wrapper">
              <style>{`
                /* Quill Editor Custom Styling */
                .quill-wrapper .ql-container {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  font-size: 15px;
                  min-height: 200px;
                  max-height: 400px;
                  overflow-y: auto;
                  background: #1C2127;
                  border: 2px solid rgba(107, 114, 128, 0.3);
                  border-radius: 12px;
                  padding: 12px;
                  transition: all 0.2s;
                }

                .quill-wrapper .ql-container.ql-snow {
                  border-top: none;
                  border-bottom-left-radius: 12px;
                  border-bottom-right-radius: 12px;
                }

                .quill-wrapper .ql-toolbar.ql-snow {
                  background: #151A21;
                  border: 2px solid rgba(107, 114, 128, 0.3);
                  border-bottom: none;
                  border-top-left-radius: 12px;
                  border-top-right-radius: 12px;
                  padding: 12px;
                  display: flex;
                  flex-wrap: wrap;
                  gap: 4px;
                }

                .quill-wrapper .ql-toolbar .ql-stroke {
                  stroke: #9CA3AF;
                  transition: stroke 0.2s;
                }

                .quill-wrapper .ql-toolbar .ql-fill {
                  fill: #9CA3AF;
                  transition: fill 0.2s;
                }

                .quill-wrapper .ql-toolbar button:hover .ql-stroke,
                .quill-wrapper .ql-toolbar button.ql-active .ql-stroke {
                  stroke: #3B82F6;
                }

                .quill-wrapper .ql-toolbar button:hover .ql-fill,
                .quill-wrapper .ql-toolbar button.ql-active .ql-fill {
                  fill: #3B82F6;
                }

                .quill-wrapper .ql-toolbar button {
                  width: 32px !important;
                  height: 32px !important;
                  padding: 4px !important;
                  border-radius: 6px !important;
                  transition: all 0.2s;
                }

                .quill-wrapper .ql-toolbar button:hover {
                  background: rgba(59, 130, 246, 0.1);
                }

                .quill-wrapper .ql-toolbar button.ql-active {
                  background: rgba(59, 130, 246, 0.2);
                }

                .quill-wrapper .ql-editor {
                  color: #F3F4F6;
                  padding: 16px;
                  line-height: 1.6;
                }

                .quill-wrapper .ql-editor.ql-blank::before {
                  color: #6B7280;
                  font-style: italic;
                  content: attr(data-placeholder);
                }

                .quill-wrapper .ql-editor p,
                .quill-wrapper .ql-editor ol,
                .quill-wrapper .ql-editor ul,
                .quill-wrapper .ql-editor pre,
                .quill-wrapper .ql-editor blockquote,
                .quill-wrapper .ql-editor h1,
                .quill-wrapper .ql-editor h2,
                .quill-wrapper .ql-editor h3 {
                  margin-bottom: 8px;
                }

                .quill-wrapper .ql-editor h1 {
                  font-size: 2em;
                  font-weight: bold;
                  color: #fff;
                }

                .quill-wrapper .ql-editor h2 {
                  font-size: 1.5em;
                  font-weight: bold;
                  color: #fff;
                }

                .quill-wrapper .ql-editor h3 {
                  font-size: 1.17em;
                  font-weight: bold;
                  color: #fff;
                }

                .quill-wrapper .ql-editor a {
                  color: #3B82F6;
                  text-decoration: underline;
                }

                .quill-wrapper .ql-editor blockquote {
                  border-left: 4px solid #3B82F6;
                  padding-left: 16px;
                  color: #9CA3AF;
                  font-style: italic;
                  margin-left: 0;
                }

                .quill-wrapper .ql-editor pre {
                  background: #0F1216;
                  border-radius: 8px;
                  padding: 12px;
                  color: #10B981;
                  overflow-x: auto;
                }

                .quill-wrapper .ql-editor code {
                  background: #0F1216;
                  padding: 2px 6px;
                  border-radius: 4px;
                  color: #10B981;
                  font-family: 'Monaco', 'Courier New', monospace;
                  font-size: 0.9em;
                }

                .quill-wrapper .ql-editor ul,
                .quill-wrapper .ql-editor ol {
                  padding-left: 24px;
                }

                .quill-wrapper .ql-editor li {
                  margin-bottom: 4px;
                }

                /* Dropdown Styling */
                .quill-wrapper .ql-toolbar .ql-picker-label {
                  color: #9CA3AF;
                  border: 1px solid rgba(107, 114, 128, 0.3);
                  border-radius: 6px;
                  padding: 4px 8px;
                  transition: all 0.2s;
                }

                .quill-wrapper .ql-toolbar .ql-picker-label:hover {
                  color: #3B82F6;
                  background: rgba(59, 130, 246, 0.1);
                }

                .quill-wrapper .ql-toolbar .ql-picker-options {
                  background: #1C2127;
                  border: 1px solid rgba(107, 114, 128, 0.3);
                  border-radius: 8px;
                  padding: 4px;
                }

                .quill-wrapper .ql-toolbar .ql-picker-item {
                  color: #9CA3AF;
                  padding: 6px 12px;
                  border-radius: 4px;
                  transition: all 0.2s;
                }

                .quill-wrapper .ql-toolbar .ql-picker-item:hover {
                  color: #fff;
                  background: rgba(59, 130, 246, 0.2);
                }

                /* Scrollbar Styling */
                .quill-wrapper .ql-editor::-webkit-scrollbar {
                  width: 8px;
                }

                .quill-wrapper .ql-editor::-webkit-scrollbar-track {
                  background: #0F1216;
                  border-radius: 4px;
                }

                .quill-wrapper .ql-editor::-webkit-scrollbar-thumb {
                  background: #374151;
                  border-radius: 4px;
                }

                .quill-wrapper .ql-editor::-webkit-scrollbar-thumb:hover {
                  background: #4B5563;
                }
              `}</style>

              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-green-400 hover:bg-green-500/10 p-2 rounded-lg transition-all duration-200 active:scale-95" title="Add Image">
                  <Image size={20} />
                </button>
                <button className="text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 p-2 rounded-lg transition-all duration-200 active:scale-95" title="Add Emoji">
                  <Smile size={20} />
                </button>
                <button className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 p-2 rounded-lg transition-all duration-200 active:scale-95" title="Mention Someone">
                  <AtSign size={20} />
                </button>
                <button className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200 active:scale-95" title="Add Location">
                  <MapPin size={20} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                content.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-[0.98] shadow-blue-500/25 hover:shadow-blue-500/40'
                  : 'bg-gray-700 cursor-not-allowed opacity-50'
              }`}
            >
              <span>Post</span>
              <Send size={18} className={content.trim() ? 'animate-pulse' : ''} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
