import React, { useState } from 'react';
import { Search, Plus, ArrowUpRight, Users, Zap, Hash, Globe, TrendingUp } from 'lucide-react';
import { COMMUNITIES } from '../constants';

export const Communities: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES = ['All', 'Technology', 'Design', 'Science', 'Business', 'Lifestyle', 'Gaming'];

  return (
    <div className="bg-white dark:bg-[#0B0E11] min-h-full transition-colors duration-200 pb-20">
        
        {/* Hero Section */}
        <div className="relative bg-gray-900 dark:bg-black text-white py-16 px-6 overflow-hidden mb-8">
             {/* Background Effects */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>

             <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
                 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium mb-6 backdrop-blur-md text-indigo-300">
                    <Zap size={12} className="fill-current" />
                    <span>Discover 10,000+ active communities</span>
                 </div>
                 
                 <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Tribe</span>
                 </h1>
                 
                 <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Connect with thousands of like-minded people. Discuss your favorite topics, share knowledge, and grow together in spaces designed for you.
                 </p>
                 
                 {/* Search Bar */}
                 <div className="w-full max-w-lg relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="relative bg-white dark:bg-[#151A21] rounded-full flex items-center p-2 shadow-2xl border border-gray-100 dark:border-gray-700">
                        <Search className="ml-3 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search for topics, interests, or keywords..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none px-3 text-gray-900 dark:text-white placeholder-gray-500 h-10"
                        />
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-bold transition-colors">
                            Search
                        </button>
                    </div>
                 </div>

                 {/* Stats */}
                 <div className="flex gap-8 mt-12 text-sm font-medium text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>1.2M Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>5M+ Members</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Hash size={14} />
                        <span>85k Topics</span>
                    </div>
                 </div>
             </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            
            {/* Filter Tabs */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-2">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                                activeCategory === cat 
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg transform scale-105' 
                                : 'bg-gray-100 dark:bg-[#151A21] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1A1F26]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                <button className="hidden md:flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-4">
                    <Plus size={16} /> Create Community
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COMMUNITIES.map((community) => (
                    <div key={community.id} className="group bg-white dark:bg-[#151A21] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-indigo-900/10 flex flex-col relative">
                        
                        {/* Card Header / Banner */}
                        <div className={`h-24 bg-gradient-to-r ${community.color} relative`}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>

                        {/* Content */}
                        <div className="p-5 pt-12 relative flex-1 flex flex-col">
                            {/* Floating Logo */}
                            <div className="absolute -top-10 left-5">
                                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#0B0E11] p-1.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <img 
                                        src={community.logo} 
                                        alt={community.name} 
                                        className="w-full h-full object-cover rounded-xl bg-gray-50 dark:bg-gray-800"
                                    />
                                </div>
                            </div>
                            
                            {/* Top Right Actions */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button className="p-2 rounded-full bg-gray-50 dark:bg-[#0B0E11] text-gray-400 hover:text-indigo-500 transition-colors border border-gray-100 dark:border-gray-800">
                                    <ArrowUpRight size={18} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{community.name}</h3>
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                    <Globe size={12} />
                                    <span>Public Group</span>
                                    <span>•</span>
                                    <span>{community.members}</span>
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed line-clamp-2 flex-1">
                                {community.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800/50 mt-auto">
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-[#151A21]">
                                            <img src={`https://picsum.photos/seed/${community.id + i}/100/100`} className="w-full h-full rounded-full" alt="" />
                                        </div>
                                    ))}
                                    <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 ring-2 ring-white dark:ring-[#151A21] flex items-center justify-center text-[10px] font-bold text-gray-500">
                                        +99
                                    </div>
                                </div>
                                
                                <button 
                                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                                        community.isJoined 
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700' 
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                                    }`}
                                >
                                    {community.isJoined ? 'Joined' : 'Join Group'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create New Card */}
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-500/50 hover:bg-gray-50 dark:hover:bg-[#151A21]/50 transition-all cursor-pointer group min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus size={32} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Create your own</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">
                        Start a new community around a topic you are passionate about.
                    </p>
                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold group-hover:underline">Get Started &rarr;</span>
                </div>
            </div>

            {/* Trending Section */}
            <div className="mt-16 mb-12">
                 <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-indigo-500" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Topics</h2>
                 </div>
                 <div className="flex flex-wrap gap-3">
                    {['#ArtificialIntelligence', '#WebDevelopment', '#SpaceX', '#SustainableLiving', '#DigitalArt', '#RemoteWork', '#CyberSecurity', '#GamingSetup', '#BookClub', '#Photography'].map(tag => (
                        <span key={tag} className="px-4 py-2 bg-white dark:bg-[#151A21] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-500 cursor-pointer transition-colors">
                            {tag}
                        </span>
                    ))}
                 </div>
            </div>

        </div>
    </div>
  );
};
