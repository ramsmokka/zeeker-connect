import { MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { Post } from '../types';
import { ReplyEditor } from './ReplyEditor';

// Example demo component showing how to integrate the ReplyEditor
export const ReplyEditorDemo: React.FC = () => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Example post to reply to
  const examplePost: Post = {
    id: '1',
    user: {
      name: 'Alex Chen',
      handle: 'alexc',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      verified: true,
      isNew: false
    },
    content: '<p>Thinking about the future of AI in software development. It\'s not about replacing coders, but empowering them to build faster. 🚀✨</p>',
    timestamp: 'Just now',
    likes: 142,
    comments: 23,
    shares: 8,
    type: 'text'
  };

  const handleSubmitReply = (content: string) => {
    console.log('Reply submitted:', content);
    // Handle the submission logic here (e.g., API call)
  };

  const handleSubmitPost = (content: string) => {
    console.log('Post submitted:', content);
    // Handle the submission logic here (e.g., API call)
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">Quill Rich Text Editor Integration</h1>

        {/* Example Post Card */}
        <div className="bg-[#151A21] rounded-2xl border border-gray-800 p-6">
          <div className="flex gap-3 mb-4">
            <img
              src={examplePost.user.avatar}
              alt={examplePost.user.name}
              className="w-12 h-12 rounded-full ring-2 ring-gray-700"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white">{examplePost.user.name}</span>
                <span className="text-gray-500 text-sm">@{examplePost.user.handle}</span>
                <span className="text-gray-600 text-sm">• {examplePost.timestamp}</span>
              </div>
              <div
                className="text-gray-300 mb-4"
                dangerouslySetInnerHTML={{ __html: examplePost.content }}
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsReplyOpen(true)}
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <MessageSquare size={18} />
                  <span className="text-sm font-medium">Reply</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Create Post Button */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
        >
          Create New Post
        </button>

        {/* Integration Instructions */}
        <div className="bg-[#151A21] rounded-2xl border border-gray-800 p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Integration Guide</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">1. Import the Component</h3>
              <pre className="bg-[#0B0E11] p-3 rounded-lg text-sm text-green-400 overflow-x-auto">
{`import { ReplyEditor } from './components/ReplyEditor';`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">2. Set Up State</h3>
              <pre className="bg-[#0B0E11] p-3 rounded-lg text-sm text-green-400 overflow-x-auto">
{`const [isOpen, setIsOpen] = useState(false);
const [replyingTo, setReplyingTo] = useState<Post | null>(null);`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">3. Use the Component</h3>
              <pre className="bg-[#0B0E11] p-3 rounded-lg text-sm text-green-400 overflow-x-auto">
{`<ReplyEditor
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  replyingTo={replyingTo}
  onSubmit={(content) => {
    console.log('Submitted:', content);
  }}
  mode="reply" // or "create"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Features Included:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Full Quill Rich Text Editor with all formatting options</li>
                <li>Shows reply context with user info and original post</li>
                <li>Tab navigation for different post types (Post, Review, Poll, Trivia, Q&A)</li>
                <li>Smooth animations and transitions</li>
                <li>Dark mode optimized styling</li>
                <li>Auto-focus on open</li>
                <li>Premium toolbar with all formatting options</li>
                <li>Modal backdrop with click-outside to close</li>
                <li>Responsive design</li>
                <li>Custom scrollbar styling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Editor */}
      <ReplyEditor
        isOpen={isReplyOpen}
        onClose={() => setIsReplyOpen(false)}
        replyingTo={examplePost}
        onSubmit={handleSubmitReply}
        mode="reply"
      />

      {/* Create Post Editor */}
      <ReplyEditor
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleSubmitPost}
        mode="create"
        placeholder="What's on your mind? (Use toolbar for formatting)"
      />
    </div>
  );
};
