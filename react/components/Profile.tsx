import { AtSign, Calendar, Camera, CheckCircle, ChevronUp, Edit3, Heart, Image as ImageIcon, Link as LinkIcon, List, Lock, MapPin, MessageCircle, Share2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { CURRENT_USER, MOCK_POSTS } from '../constants';
import { useToast } from '../contexts/ToastContext';
import { Post } from '../types';
import { PostCard } from './PostCard';
import { SharePopup } from './SharePopup';

interface ProfileProps {
    onPostClick?: (post: Post) => void;
    onToggleSave: (post: Post) => void;
    isPostSaved: (id: string) => boolean;
    onTogglePin?: (post: Post) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onPostClick, onToggleSave, isPostSaved, onTogglePin }) => {
  const [activeTab, setActiveTab] = useState('Posts');
  const [showShare, setShowShare] = useState(false);
  const { showToast } = useToast();

  // User State
  const [currentUser, setCurrentUser] = useState(CURRENT_USER);

  // Edit Mode State
  const [editMode, setEditMode] = useState<'none' | 'profile' | 'password'>('none');

  // Form Data
  const [editFormData, setEditFormData] = useState({
      name: currentUser.name,
      bio: currentUser.bio || '',
      location: currentUser.location || '',
      website: currentUser.website || ''
  });

  const [passwordData, setPasswordData] = useState({
      current: '',
      new: '',
      confirm: ''
  });

  // File Refs
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setCurrentUser(prev => ({ ...prev, avatar: reader.result as string }));
              showToast('Profile picture updated successfully');
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveProfile = () => {
      setCurrentUser(prev => ({
          ...prev,
          name: editFormData.name,
          bio: editFormData.bio,
          location: editFormData.location,
          website: editFormData.website
      }));
      setEditMode('none');
      showToast('Profile details updated');
  };

  const handleSavePassword = () => {
      if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
          showToast('Please fill in all fields');
          return;
      }
      if (passwordData.new !== passwordData.confirm) {
          showToast('New passwords do not match');
          return;
      }
      setEditMode('none');
      setPasswordData({ current: '', new: '', confirm: '' });
      showToast('Password updated successfully');
  };

  const TABS = [
    { id: 'Posts', icon: List },
    { id: 'Replies', icon: MessageCircle },
    { id: 'Media', icon: ImageIcon },
    { id: 'Likes', icon: Heart },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Posts':
        return (
          <div className="flex flex-col gap-4 pb-20">
             {MOCK_POSTS.map(post => (
                 <PostCard
                    key={post.id}
                    post={{...post, user: currentUser}}
                    onClick={onPostClick ? () => onPostClick({...post, user: currentUser}) : undefined}
                    onToggleSave={() => onToggleSave(post)}
                    isSaved={isPostSaved(post.id)}
                    onTogglePin={() => onTogglePin && onTogglePin(post)}
                 />
             ))}
          </div>
        );
      case 'Replies':
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white dark:bg-[#151A21] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <MessageCircle size={48} className="mb-4 opacity-20" />
                <p className="font-medium">No replies yet</p>
                <p className="text-sm mt-1 opacity-70">When you reply to posts, they will appear here.</p>
            </div>
        );
      case 'Media':
        return (
            <div className="grid grid-cols-3 gap-1 md:gap-2 pb-20">
                {[1,2,3,4,5,6,7,8,9].map(i => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 relative group overflow-hidden cursor-pointer rounded-xl">
                         <img
                            src={`https://picsum.photos/seed/media${i}/400/400`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            alt="Media"
                         />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                ))}
            </div>
        );
      case 'Likes':
         return (
             <div className="flex flex-col gap-4 pb-20">
                 {MOCK_POSTS.slice(0, 2).map(post => (
                     <PostCard
                        key={`liked-${post.id}`}
                        post={post}
                        onClick={onPostClick ? () => onPostClick(post) : undefined}
                        onToggleSave={() => onToggleSave(post)}
                        isSaved={isPostSaved(post.id)}
                        onTogglePin={() => onTogglePin && onTogglePin(post)}
                     />
                 ))}
             </div>
         );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-full bg-gray-50/50 dark:bg-[#0B0E11] transition-colors duration-200 flex flex-col items-center p-3 md:p-6">
        <div className="w-full max-w-[720px] space-y-6">

            {/* Hidden Input for Avatar */}
            <input
                type="file"
                ref={avatarInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />

            {/* Profile ID Card */}
            <div className="bg-white dark:bg-[#151A21] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden group">

                {/* Decorative background blob */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10">

                    {/* Left Column: Avatar & Stats */}
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-6 w-full md:w-auto">
                        <div className="relative group/avatar shrink-0">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                                <img
                                    src={currentUser.avatar}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 rounded-2xl cursor-pointer backdrop-blur-[2px]"
                            >
                                <Camera size={24} className="text-white drop-shadow-md" />
                            </button>
                        </div>

                        {/* Stats - Horizontal on Mobile, Stacked on Desktop if needed, but horizontal looks good generally */}
                        <div className="flex gap-4 md:gap-6 ml-auto md:ml-0">
                             <div className="text-center md:text-left cursor-pointer hover:opacity-70 transition-opacity" onClick={() => showToast('Following list')}>
                                 <div className="text-lg font-black text-gray-900 dark:text-white leading-none">{currentUser.following?.toLocaleString()}</div>
                                 <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Following</div>
                             </div>
                             <div className="w-px bg-gray-200 dark:bg-gray-800 h-8 self-center"></div>
                             <div className="text-center md:text-left cursor-pointer hover:opacity-70 transition-opacity" onClick={() => showToast('Followers list')}>
                                 <div className="text-lg font-black text-gray-900 dark:text-white leading-none">{currentUser.followers?.toLocaleString()}</div>
                                 <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Followers</div>
                             </div>
                        </div>
                    </div>

                    {/* Right Column: Info & Actions */}
                    <div className="flex-1 w-full min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight flex items-center gap-2">
                                    {currentUser.name}
                                    {currentUser.verified && (
                                        <CheckCircle size={22} className="text-blue-500 fill-blue-500 text-white" />
                                    )}
                                </h1>
                                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 font-medium mt-1">
                                    <AtSign size={14} className="opacity-50" />
                                    <span>{currentUser.handle.replace('@', '')}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowShare(!showShare)}
                                        className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                    {showShare && (
                                        <div className="absolute top-full right-0 mt-2 z-30">
                                            <SharePopup onClose={() => setShowShare(false)} />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setEditMode(prev => prev === 'password' ? 'none' : 'password')}
                                    className={`p-2.5 rounded-xl transition-colors ${editMode === 'password' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    <Lock size={18} />
                                </button>
                                <button
                                    onClick={() => setEditMode(prev => prev === 'profile' ? 'none' : 'profile')}
                                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                                        editMode === 'profile'
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                                    }`}
                                >
                                    {editMode === 'profile' ? <ChevronUp size={16} /> : <Edit3 size={16} />}
                                    <span>{editMode === 'profile' ? 'Close' : 'Edit'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Bio */}
                        {currentUser.bio && (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px] whitespace-pre-wrap mb-5 max-w-xl">
                                {currentUser.bio}
                            </p>
                        )}

                        {/* Metadata Grid */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                            {currentUser.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400 dark:text-gray-500" />
                                    <span>{currentUser.location}</span>
                                </div>
                            )}
                            {currentUser.website && (
                                <a
                                    href={`https://${currentUser.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline transition-colors font-medium"
                                >
                                    <LinkIcon size={16} />
                                    {currentUser.website}
                                </a>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
                                <span>{currentUser.joinedDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inline Edit Panel (Accordion) */}
                <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${editMode !== 'none' ? 'max-h-[800px] opacity-100 mt-8 border-t border-gray-100 dark:border-gray-800 pt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                    {editMode === 'profile' && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                Update Public Profile
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Display Name</label>
                                    <input
                                        type="text"
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData(prev => ({...prev, name: e.target.value}))}
                                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Location</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={editFormData.location}
                                            onChange={(e) => setEditFormData(prev => ({...prev, location: e.target.value}))}
                                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Bio</label>
                                    <textarea
                                        value={editFormData.bio}
                                        onChange={(e) => setEditFormData(prev => ({...prev, bio: e.target.value}))}
                                        rows={3}
                                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none font-medium"
                                        placeholder="Tell the world about yourself..."
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Website</label>
                                    <div className="relative">
                                        <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={editFormData.website}
                                            onChange={(e) => setEditFormData(prev => ({...prev, website: e.target.value}))}
                                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setEditMode('none')}
                                    className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {editMode === 'password' && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                Change Password
                            </h3>
                            <div className="space-y-4 max-w-md">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData(prev => ({...prev, current: e.target.value}))}
                                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData(prev => ({...prev, new: e.target.value}))}
                                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData(prev => ({...prev, confirm: e.target.value}))}
                                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setEditMode('none')}
                                    className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSavePassword}
                                    className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    Update Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Segmented Tabs */}
            <div className="bg-gray-200/50 dark:bg-[#151A21] p-1.5 rounded-2xl flex relative overflow-hidden">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                                isActive
                                ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm scale-100'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-300/30 dark:hover:bg-white/5'
                            }`}
                        >
                            <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="hidden md:inline">{tab.id}</span>
                        </button>
                    )
                })}
            </div>

            {/* Content Area */}
            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                 {renderTabContent()}
            </div>
        </div>
    </div>
  );
};
