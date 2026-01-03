
export type View = 'feed' | 'communities' | 'profile' | 'saved' | 'settings' | 'messages' | 'thread';
export type PostType = 'text' | 'poll' | 'trivia' | 'review' | 'qna' | 'article';

export interface User {
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  isPro?: boolean;
  isNew?: boolean;
  bio?: string;
  location?: string;
  website?: string;
  joinedDate?: string;
  following?: number;
  followers?: number;
}

export interface LinkPreview {
  image: string;
  title: string;
  description: string;
  url: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Reply {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Post {
  id: string;
  user: User;
  type: PostType;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  linkPreview?: LinkPreview;
  isPinned?: boolean;
  badge?: string;
  replies?: Reply[];
  
  // Type specific data
  pollOptions?: PollOption[];
  totalVotes?: number;
  
  // Trivia
  correctOptionId?: string;
  
  // Review
  rating?: number; // 1-5
  reviewTitle?: string;
  
  // Q&A
  tags?: string[];

  // Article
  articleImage?: string;
}

export interface Community {
  id: string;
  name: string;
  members: string;
  color: string;
  icon: string;
  description: string;
  isJoined?: boolean;
  logo: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: number;
  isOnline: boolean;
}

export interface TrendingTopic {
  id: string;
  category: string;
  title: string;
}