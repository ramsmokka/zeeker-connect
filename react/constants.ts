import { Post, Community, Event, TrendingTopic, User } from './types';

export const CURRENT_USER: User = {
  name: 'Alex Chen',
  handle: '@alexc',
  avatar: 'https://picsum.photos/seed/alex/200/200',
  bio: 'Frontend Engineer exploring the intersection of Design and AI. Building cool things.',
  location: 'San Francisco, CA',
  website: 'alexchen.dev',
  joinedDate: 'Joined September 2023',
  following: 1204,
  followers: 8492,
  isNew: true
};

// Extended User type locally for this specific UI requirement if needed, 
// but we'll just add the properties here and let TS infer or cast if strictly typed in types.ts
export const WHO_TO_FOLLOW = [
  {
    name: 'Elena Fisher',
    handle: '@elenadesign',
    avatar: 'https://picsum.photos/seed/elena/200/200',
    verified: true,
    followers: 15400,
    latestPostSnippet: "Just released the new Figma kit! 🎨",
    totalComments: 124
  },
  {
    name: 'Tech Insider',
    handle: '@techinsider',
    avatar: 'https://picsum.photos/seed/tech/200/200',
    verified: true,
    followers: 89000,
    latestPostSnippet: "AI regulation talks heating up in EU.",
    totalComments: 892
  },
  {
    name: 'Marcus Reed',
    handle: '@marcusr',
    avatar: 'https://picsum.photos/seed/marcus/200/200',
    verified: false,
    followers: 3200,
    latestPostSnippet: "Rust vs Go for backend? My thoughts.",
    totalComments: 45
  },
  {
    name: 'Sarah Drasner',
    handle: '@sarah_edo',
    avatar: 'https://picsum.photos/seed/sarahd/200/200',
    verified: true,
    followers: 42000,
    latestPostSnippet: "Engineering management is about people.",
    totalComments: 312
  },
  {
    name: 'Vercel Team',
    handle: '@vercel',
    avatar: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png',
    verified: true,
    followers: 150000,
    latestPostSnippet: "Next.js 15 RC is now available to test.",
    totalComments: 1024
  },
  {
    name: 'Supabase',
    handle: '@supabase',
    avatar: 'https://picsum.photos/seed/supabase/200/200', 
    verified: true,
    followers: 67000,
    latestPostSnippet: "Postgres is all you need. scaling updates.",
    totalComments: 567
  }
];

export const MOCK_POSTS: Post[] = [
  {
      id: 'pinned-nexus-update',
      user: {
          name: 'Nexus Team',
          handle: '@nexus_official',
          avatar: 'https://picsum.photos/seed/tools/200/200',
          verified: true
      },
      type: 'article',
      content: "We've refined the feed density and added new features. Enjoy the speed!",
      articleImage: 'https://picsum.photos/seed/tools/200/200',
      reviewTitle: "Welcome to the new Nexus update!",
      timestamp: '1h ago',
      likes: 1240,
      comments: 42,
      shares: 15,
      isPinned: true,
      replies: []
  },
  {
    id: '1',
    user: {
      name: 'Sarah Miller',
      handle: '@sarahm',
      avatar: 'https://picsum.photos/seed/sarah/200/200',
      verified: true,
      isPro: true
    },
    type: 'text',
    timestamp: '2h ago',
    content: "Just tried the new Gemini 2.5 Flash model for some real-time data processing.\nThe latency improvement is insane! 🚀 Anyone else testing it? I've been running benchmarks all morning and the results are promising for edge deployments.",
    likes: 54,
    comments: 10,
    shares: 2,
    replies: [
      {
        id: 'r1',
        user: {
          name: 'David Kim',
          handle: '@davidk',
          avatar: 'https://picsum.photos/seed/david/200/200',
          verified: false,
          isNew: true
        },
        content: "Absolutely. The token budget for thinking is a game changer for complex reasoning tasks too.",
        timestamp: '1h ago',
        likes: 15
      },
      {
        id: 'r1-2',
        user: {
          name: 'Elena Fisher',
          handle: '@elenadesign',
          avatar: 'https://picsum.photos/seed/elena/200/200',
          verified: true
        },
        content: "I've been waiting for this! Does it handle multimodal input with the same speed?",
        timestamp: '45m ago',
        likes: 8
      },
      {
        id: 'r1-3',
        user: {
          name: 'Marcus Reed',
          handle: '@marcusr',
          avatar: 'https://picsum.photos/seed/marcus/200/200',
          verified: false
        },
        content: "Running it on a local node setup right now. The difference is night and day compared to 1.5.",
        timestamp: '30m ago',
        likes: 12
      },
      {
        id: 'r1-4',
        user: {
            name: 'Sarah Miller',
            handle: '@sarahm',
            avatar: 'https://picsum.photos/seed/sarah/200/200',
            verified: true,
            isPro: true
        },
        content: "Yes @elenadesign! Image processing seems about 2x faster in my initial tests.",
        timestamp: '15m ago',
        likes: 24
      }
    ]
  },
  {
    id: 'poll-1',
    user: {
      name: 'Frontend Weekly',
      handle: '@frontendweekly',
      avatar: 'https://picsum.photos/seed/tech/200/200',
      verified: true,
    },
    type: 'poll',
    timestamp: '3h ago',
    content: "Which state management library are you reaching for in 2024 for complex apps?",
    likes: 245,
    comments: 89,
    shares: 45,
    badge: 'POLL',
    pollOptions: [
      { id: '1', text: 'Redux Toolkit', votes: 450 },
      { id: '2', text: 'Zustand', votes: 890 },
      { id: '3', text: 'Jotai / Recoil', votes: 210 },
      { id: '4', text: 'React Context', votes: 340 }
    ],
    totalVotes: 1890,
    replies: [
        {
          id: 'r2',
          user: {
            name: 'Chris Evans',
            handle: '@chrisevans',
            avatar: 'https://picsum.photos/seed/chris/200/200',
            verified: false,
            isNew: true
          },
          content: "Zustand is definitely the way to go. Redux is overkill for 90% of apps now unless you're enterprise.",
          timestamp: '2h ago',
          likes: 42
        }
    ]
  },
  {
    id: 'trivia-1',
    user: {
      name: 'Tech Trivia',
      handle: '@techtrivia',
      avatar: 'https://picsum.photos/seed/trivia/200/200',
    },
    type: 'trivia',
    timestamp: '5h ago',
    content: "Can you guess the correct answer? 🧠\nWhat was the first name of JavaScript when it was developed by Brendan Eich in 10 days?",
    likes: 120,
    comments: 45,
    shares: 12,
    badge: 'TRIVIA',
    pollOptions: [
      { id: 'opt1', text: 'LiveScript', votes: 0 },
      { id: 'opt2', text: 'Mocha', votes: 0 },
      { id: 'opt3', text: 'JScript', votes: 0 },
      { id: 'opt4', text: 'ECMAScript', votes: 0 }
    ],
    correctOptionId: 'opt2', // Mocha
    replies: [
        {
          id: 'r3',
          user: {
            name: 'Jordan Lee',
            handle: '@jlee_dev',
            avatar: 'https://picsum.photos/seed/jordan/200/200',
            verified: false
          },
          content: "It was Mocha! I remember reading the history of Netscape recently. Wild how fast it was built.",
          timestamp: '4h ago',
          likes: 8
        }
    ]
  },
  {
    id: 'review-1',
    user: {
      name: 'Design Daily',
      handle: '@designdaily',
      avatar: 'https://picsum.photos/seed/design/200/200',
    },
    type: 'review',
    timestamp: '6h ago',
    content: "Finally got my hands on the new Ray-Ban Meta smart glasses. The multimodal AI features are actually useful in daily life, not just a gimmick.",
    reviewTitle: "Ray-Ban Meta Review",
    rating: 4,
    likes: 892,
    comments: 124,
    shares: 56,
    replies: [
        {
          id: 'r4',
          user: {
            name: 'Morgan Smith',
            handle: '@morgans',
            avatar: 'https://picsum.photos/seed/morgan/200/200',
            verified: true
          },
          content: "How's the battery life with the AI features turned on? Considering getting a pair for travel.",
          timestamp: '5h ago',
          likes: 23
        }
    ]
  },
  {
    id: 'qna-1',
    user: {
      name: 'Junior Dev',
      handle: '@juniordev_xo',
      avatar: 'https://picsum.photos/seed/junior/200/200',
      isNew: true
    },
    type: 'qna',
    timestamp: '1h ago',
    content: "How do you effectively handle error boundaries in Next.js App Router? I'm struggling with granular error handling in nested layouts.",
    tags: ['Next.js', 'React', 'WebDev'],
    likes: 12,
    comments: 8,
    shares: 1,
    badge: 'Q&A',
    replies: [
        {
          id: 'r5',
          user: {
            name: 'Senior Arch',
            handle: '@arch_guru',
            avatar: 'https://picsum.photos/seed/guru/200/200',
            verified: true
          },
          content: "Use error.tsx files at the segment level where you need them. They wrap the page automatically. Don't forget global-error.tsx for root.",
          timestamp: '30m ago',
          likes: 5
        }
    ]
  }
];

export const COMMUNITIES: Community[] = [
  {
    id: '1',
    name: 'CNN Tech',
    members: '2.5M Members',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/CNN_International_logo.svg/240px-CNN_International_logo.svg.png',
    description: 'Latest breaking news from the technology sector.',
    isJoined: true,
    color: 'from-red-600 to-red-900',
    icon: 'react'
  },
  {
    id: '2',
    name: 'BBC Future',
    members: '1.2M Members',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/240px-BBC_Logo_2021.svg.png',
    description: 'In-depth analysis of science, technology and environment.',
    isJoined: false,
    color: 'from-black to-gray-800',
    icon: 'react'
  },
  {
    id: '3',
    name: 'The Verge',
    members: '850k Members',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/The_Verge_logo.svg/200px-The_Verge_logo.svg.png',
    description: 'Covering the intersection of technology, science, art, and culture.',
    isJoined: true,
    color: 'from-indigo-500 to-purple-600',
    icon: 'palette'
  },
  {
    id: '4',
    name: 'Wired',
    members: '920k Members',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Wired_logo.svg/200px-Wired_logo.svg.png',
    description: 'How technology is changing every aspect of our lives.',
    isJoined: false,
    color: 'from-gray-800 to-black',
    icon: 'code'
  }
];

export const UPCOMING_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Gemini API Hackathon',
    date: 'OCT 24',
    time: '10:00 AM PST',
    attendees: 342,
    isOnline: true
  },
  {
    id: '2',
    title: 'Frontend System Design...',
    date: 'OCT 28',
    time: '2:00 PM EST',
    attendees: 120,
    isOnline: true
  }
];

export const TRENDING_TOPICS: TrendingTopic[] = [
  { id: '1', category: 'Technology', title: 'Generative AI in 2025' },
  { id: '2', category: 'Development', title: 'The Fall of CSS-in-JS?' },
  { id: '3', category: 'Science', title: 'Mars Mission Update' },
  { id: '4', category: 'Finance', title: 'Crypto Market Rally' },
  { id: '5', category: 'Health', title: 'Biohacking for Longevity' },
  { id: '6', category: 'Gaming', title: 'GTA VI Leaks Analysis' }
];