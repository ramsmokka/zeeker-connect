import React, { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, Phone, Video, Send, ArrowLeft, Image, Smile, ShieldCheck, CheckCheck, Users, UserCog } from 'lucide-react';
import { CURRENT_USER } from '../constants';

interface Message {
    id: string;
    text: string;
    senderId: string; // 'me' or 'other'
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
    id: string;
    user: {
        name: string;
        handle: string;
        avatar: string;
        verified?: boolean;
        isAdmin?: boolean;
        isOnline?: boolean;
    };
    lastMessage: string;
    time: string;
    unread: number;
}

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'admin',
        user: {
            name: 'Connect Admin',
            handle: '@admin',
            avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',
            verified: true,
            isAdmin: true,
            isOnline: true
        },
        lastMessage: 'Welcome to Connect! Let us know if you need help.',
        time: '1d',
        unread: 1
    },
    {
        id: 'sarah',
        user: {
            name: 'Sarah Miller',
            handle: '@sarahm',
            avatar: 'https://picsum.photos/seed/sarah/200/200',
            verified: true,
            isOnline: false
        },
        lastMessage: 'Thanks for the feedback on the post!',
        time: '2h',
        unread: 0
    },
    {
        id: 'david',
        user: {
            name: 'David Kim',
            handle: '@davidk',
            avatar: 'https://picsum.photos/seed/david/200/200',
            isOnline: true
        },
        lastMessage: 'Are you going to the hackathon?',
        time: '4h',
        unread: 3
    }
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
    'admin': [
        { id: '1', text: 'Hi Alex! Welcome to the Connect platform. 🚀', senderId: 'other', timestamp: 'Yesterday 10:00 AM', status: 'read' },
        { id: '2', text: 'We are thrilled to have you here. Feel free to message us directly here if you spot any bugs or have feature requests.', senderId: 'other', timestamp: 'Yesterday 10:01 AM', status: 'read' }
    ],
    'sarah': [
        { id: '1', text: 'Hey Sarah, great article on Gemini.', senderId: 'me', timestamp: '2:30 PM', status: 'read' },
        { id: '2', text: 'Thanks for the feedback on the post!', senderId: 'other', timestamp: '2:35 PM', status: 'read' }
    ]
};

export const Messages: React.FC = () => {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
    const [messagesData, setMessagesData] = useState(INITIAL_MESSAGES);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find(c => c.id === activeChatId);
    const activeMessages = activeChatId ? (messagesData[activeChatId] || []) : [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages, activeChatId]);

    const handleSendMessage = () => {
        if (!inputValue.trim() || !activeChatId) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            senderId: 'me',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        setMessagesData(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), newMessage]
        }));

        setInputValue('');

        // Simulate reply from Admin
        if (activeChatId === 'admin') {
            setTimeout(() => {
                const reply: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Thanks for reaching out! An admin will review your message shortly.",
                    senderId: 'other',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: 'read'
                };
                setMessagesData(prev => ({
                    ...prev,
                    [activeChatId]: [...(prev[activeChatId] || []), reply]
                }));
            }, 1500);
        }
    };

    const handleChatSelect = (id: string) => {
        setActiveChatId(id);
        // Mark as read
        setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    };

    // --- LIST VIEW ---
    if (!activeChatId) {
        return (
            <div className="max-w-[720px] mx-auto min-h-full bg-white dark:bg-[#0B0E11] flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/90 dark:bg-[#0B0E11]/90 backdrop-blur z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
                        {/* View Toggle */}
                        <div className="flex bg-gray-100 dark:bg-[#151A21] p-1 rounded-full border border-gray-200 dark:border-gray-800">
                            <button className="px-3 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm flex items-center gap-1.5 cursor-default transition-all">
                                <Users size={14}/> User
                            </button>
                            <button 
                                onClick={() => handleChatSelect('admin')}
                                className="px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-all"
                            >
                                <UserCog size={14}/> Admin
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search messages..." 
                            className="w-full bg-gray-100 dark:bg-[#151A21] border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => handleChatSelect(chat.id)}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#151A21] cursor-pointer border-b border-gray-100 dark:border-gray-800/50 transition-colors relative"
                        >
                            <div className="relative">
                                <img src={chat.user.avatar} alt={chat.user.name} className="w-12 h-12 rounded-full object-cover" />
                                {chat.user.isOnline && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0B0E11] rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{chat.user.name}</h3>
                                        {chat.user.verified && <ShieldCheck size={14} className="text-blue-500 fill-blue-500 text-white" />}
                                        {chat.user.isAdmin && <span className="bg-gray-200 dark:bg-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">ADMIN</span>}
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-sm truncate pr-2 ${chat.unread > 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
                                        {chat.lastMessage}
                                    </p>
                                    {chat.unread > 0 && (
                                        <div className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- CHAT VIEW ---
    return (
        <div className="max-w-[720px] mx-auto h-full flex flex-col bg-white dark:bg-[#0B0E11]">
            {/* Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white/95 dark:bg-[#0B0E11]/95 backdrop-blur z-20 sticky top-0">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setActiveChatId(null)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-[#151A21] rounded-full transition-colors text-gray-600 dark:text-gray-400"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="relative">
                        <img src={activeConversation?.user.avatar} alt="User" className="w-10 h-10 rounded-full object-cover" />
                        {activeConversation?.user.isOnline && (
                             <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#0B0E11] rounded-full"></div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <h2 className="font-bold text-gray-900 dark:text-white text-sm">{activeConversation?.user.name}</h2>
                            {activeConversation?.user.verified && <ShieldCheck size={14} className="text-blue-500" />}
                            {activeConversation?.user.isAdmin && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-bold px-1 rounded">ADMIN</span>}
                        </div>
                        <p className="text-xs text-gray-500">{activeConversation?.user.isOnline ? 'Online now' : 'Offline'}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-1 text-primary">
                    {activeChatId === 'admin' ? (
                        <div className="flex bg-gray-100 dark:bg-[#151A21] p-1 rounded-full border border-gray-200 dark:border-gray-800">
                            <button 
                                onClick={() => setActiveChatId(null)}
                                className="px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-all"
                            >
                                <Users size={14}/> User
                            </button>
                            <button className="px-3 py-1.5 rounded-full text-xs font-bold bg-black dark:bg-white text-white dark:text-black shadow-sm flex items-center gap-1.5 cursor-default transition-all">
                                <UserCog size={14}/> Admin
                            </button>
                        </div>
                    ) : (
                        <>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#151A21] rounded-full transition-colors">
                                <Phone size={20} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#151A21] rounded-full transition-colors">
                                <Video size={20} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#151A21] rounded-full transition-colors text-gray-400">
                                <MoreVertical size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0B0E11]">
                <div className="text-center my-4">
                    <span className="text-[10px] text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-full font-medium">
                        {activeConversation?.user.isAdmin ? 'Official Support Channel' : 'Conversation Started'}
                    </span>
                </div>
                
                {activeMessages.map((msg, idx) => {
                    const isMe = msg.senderId === 'me';
                    const showAvatar = !isMe && (idx === activeMessages.length - 1 || activeMessages[idx + 1]?.senderId === 'me');
                    
                    return (
                        <div key={msg.id} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {!isMe && (
                                <div className="w-8 flex-shrink-0 flex items-end">
                                    {showAvatar ? (
                                        <img src={activeConversation?.user.avatar} className="w-6 h-6 rounded-full mb-1" alt="" />
                                    ) : (
                                        <div className="w-6"></div>
                                    )}
                                </div>
                            )}
                            
                            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                                isMe 
                                ? 'bg-primary text-white rounded-br-none' 
                                : 'bg-white dark:bg-[#151A21] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 rounded-bl-none'
                            }`}>
                                <p>{msg.text}</p>
                                <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {msg.timestamp}
                                    {isMe && <CheckCheck size={12} className="opacity-70" />}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-[#0B0E11] border-t border-gray-200 dark:border-gray-800 sticky bottom-0 z-20">
                <div className="flex items-end gap-2 bg-gray-100 dark:bg-[#151A21] rounded-2xl p-2 border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-700 transition-colors">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                        <Image size={20} />
                    </button>
                    <textarea 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white text-sm max-h-32 min-h-[24px] py-2 resize-none placeholder-gray-500"
                        rows={1}
                        style={{ height: 'auto', minHeight: '40px' }}
                    />
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                        <Smile size={20} />
                    </button>
                    <button 
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className={`p-2 rounded-xl transition-all ${
                            inputValue.trim() 
                            ? 'bg-primary text-white shadow-md hover:bg-indigo-600' 
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <Send size={18} className={inputValue.trim() ? 'ml-0.5' : ''} />
                    </button>
                </div>
            </div>
        </div>
    );
};