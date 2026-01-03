# 🚀 Complete API Documentation for Connect Social Media Platform

**Project:** Connect - Next Generation Social Media Platform
**Frontend:** React 19.2.0 + TypeScript + Vite
**Total APIs Required:** 82 endpoints

---

## 📊 **EXECUTIVE SUMMARY**

Based on comprehensive analysis of all components, here's what needs to be built:

| Category | Endpoints | Priority |
|----------|-----------|----------|
| Authentication & Users | 10 | 🔴 High |
| Posts & Content | 12 | 🔴 High |
| Post Interactions | 8 | 🔴 High |
| Comments & Replies | 8 | 🟡 Medium |
| Communities | 9 | 🟡 Medium |
| Messages & Chat | 7 | 🟡 Medium |
| Search & Discovery | 6 | 🟡 Medium |
| Notifications | 6 | 🟢 Low |
| Media & Uploads | 5 | 🔴 High |
| Profile Management | 6 | 🔴 High |
| Reporting & Moderation | 3 | 🟢 Low |
| Analytics | 2 | 🟢 Low |
| **TOTAL** | **82** | |

---

## 🔐 **1. AUTHENTICATION & USER MANAGEMENT (10 endpoints)**

### 1.1 Auth Endpoints
```http
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/verify
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

#### Example: Login
```json
POST /api/auth/login
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "user123",
    "handle": "@johndoe",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "bio": "Tech enthusiast | Developer",
    "location": "San Francisco, CA",
    "website": "johndoe.com",
    "verified": true,
    "isAdmin": false,
    "joinedDate": "Joined January 2024",
    "followers": 1200,
    "following": 350
  }
}
```

### 1.2 Profile Endpoints
```http
GET    /api/users/me                      - Get current user
PUT    /api/users/me                      - Update current user profile
POST   /api/users/me/avatar               - Upload profile picture
```

---

## 👤 **2. USER PROFILE MANAGEMENT (6 endpoints)**

```http
GET    /api/users/:userId                 - Get user profile
GET    /api/users/:userId/posts           - Get user's posts (with tabs: Posts, Replies, Media, Likes)
GET    /api/users/:userId/followers       - Get followers list
GET    /api/users/:userId/following       - Get following list
POST   /api/users/:userId/follow          - Follow user
DELETE /api/users/:userId/unfollow        - Unfollow user
```

### Profile Update Example
```json
PUT /api/users/me
Request:
{
  "name": "John Doe",
  "bio": "Tech enthusiast | Developer | AI lover",
  "location": "San Francisco, CA",
  "website": "johndoe.com"
}

Response:
{
  "success": true,
  "user": { ...updated user object }
}
```

### Password Change
```json
POST /api/users/me/password
Request:
{
  "currentPassword": "old_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}

Response:
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## 📝 **3. POSTS & CONTENT (12 endpoints)**

### Post Types Supported:
1. **Text** - Rich HTML content with formatting
2. **Poll** - Multiple choice voting (2-4 options)
3. **Trivia** - Quiz with correct answer
4. **Review** - Rated review (1-5 stars) with title
5. **Q&A** - Questions with tags
6. **Article** - Featured articles with images

### Endpoints
```http
GET    /api/posts                         - Get feed posts (with filters)
GET    /api/posts/trending                - Get trending posts
GET    /api/posts/popular                 - Get popular posts
GET    /api/posts/latest                  - Get latest posts
GET    /api/posts/polls                   - Filter poll posts
GET    /api/posts/qna                     - Filter Q&A posts
POST   /api/posts                         - Create new post
GET    /api/posts/:postId                 - Get single post
PUT    /api/posts/:postId                 - Edit post
DELETE /api/posts/:postId                 - Delete post
POST   /api/posts/:postId/pin             - Pin/unpin post
GET    /api/posts/:postId/thread          - Get post with all replies (thread view)
```

### Query Parameters for GET /api/posts
```
?filter=latest|popular|trending|polls|qna
&page=1
&limit=20
&userId=user123
```

### Create Post Examples

#### Text Post
```json
POST /api/posts
Request:
{
  "type": "text",
  "content": "<p>This is a <strong>text post</strong> with <em>formatting</em>!</p><blockquote>Quoted text</blockquote><ul><li>Bullet point</li></ul>",
  "mentions": ["@user123"],
  "hashtags": ["#tech", "#ai"]
}
```

#### Poll Post
```json
POST /api/posts
Request:
{
  "type": "poll",
  "content": "<p>Which framework do you prefer?</p>",
  "pollOptions": [
    { "id": "1", "text": "React" },
    { "id": "2", "text": "Vue" },
    { "id": "3", "text": "Angular" }
  ],
  "badge": "POLL"
}

Response:
{
  "id": "post123",
  "type": "poll",
  "user": { ...user object },
  "content": "<p>Which framework do you prefer?</p>",
  "timestamp": "Just now",
  "pollOptions": [
    { "id": "1", "text": "React", "votes": 0 },
    { "id": "2", "text": "Vue", "votes": 0 },
    { "id": "3", "text": "Angular", "votes": 0 }
  ],
  "totalVotes": 0,
  "badge": "POLL",
  "reactions": {},
  "comments": 0,
  "shares": 0,
  "isPinned": false
}
```

#### Trivia Post
```json
POST /api/posts
Request:
{
  "type": "trivia",
  "content": "<p>What year was JavaScript created?</p>",
  "pollOptions": [
    { "id": "1", "text": "1995" },
    { "id": "2", "text": "1999" },
    { "id": "3", "text": "2001" }
  ],
  "correctOptionId": "1",
  "badge": "TRIVIA"
}
```

#### Review Post
```json
POST /api/posts
Request:
{
  "type": "review",
  "content": "<p>This product exceeded my expectations!</p>",
  "reviewTitle": "Amazing Product",
  "rating": 5
}
```

#### Q&A Post
```json
POST /api/posts
Request:
{
  "type": "qna",
  "content": "<p>How do I optimize React performance?</p>",
  "tags": ["react", "performance", "optimization"],
  "badge": "Q&A"
}
```

#### Article Post
```json
POST /api/posts
Request:
{
  "type": "article",
  "content": "<p>Comprehensive guide to building scalable applications...</p>",
  "reviewTitle": "Building Scalable Apps: A Complete Guide",
  "articleImage": "https://...",
  "linkPreview": {
    "title": "Article Title",
    "description": "Description",
    "image": "https://...",
    "url": "https://..."
  }
}
```

---

## ❤️ **4. POST INTERACTIONS (8 endpoints)**

### Reactions
6 emoji types supported: 👍, ❤️, 😂, 😮, 😢, 😡

```http
POST   /api/posts/:postId/reactions       - Add/update reaction
DELETE /api/posts/:postId/reactions       - Remove reaction
GET    /api/posts/:postId/reactions       - Get all reactions with users
```

#### Add Reaction
```json
POST /api/posts/post123/reactions
Request:
{
  "emoji": "❤️"
}

Response:
{
  "reactions": {
    "❤️": 145,
    "👍": 89,
    "😂": 23
  },
  "userReaction": "❤️"
}
```

### Bookmarks
```http
POST   /api/posts/:postId/save            - Bookmark post
DELETE /api/posts/:postId/save            - Remove bookmark
GET    /api/users/me/saved-posts          - Get all bookmarked posts
```

### Shares
```http
POST   /api/posts/:postId/share           - Share post (increment counter)
GET    /api/posts/:postId/shares          - Get share count
```

---

## 🗳️ **5. POLLS & TRIVIA (2 endpoints)**

```http
POST   /api/polls/:pollId/vote            - Vote on poll option
POST   /api/trivia/:triviaId/answer       - Submit trivia answer
```

#### Vote on Poll
```json
POST /api/polls/poll123/vote
Request:
{
  "optionId": "option1"
}

Response:
{
  "pollOptions": [
    { "id": "option1", "text": "React", "votes": 145, "percentage": 60 },
    { "id": "option2", "text": "Vue", "votes": 96, "percentage": 40 }
  ],
  "totalVotes": 241,
  "userVoted": "option1",
  "hasVoted": true
}
```

#### Submit Trivia Answer
```json
POST /api/trivia/trivia123/answer
Request:
{
  "optionId": "option2"
}

Response:
{
  "correct": false,
  "correctOptionId": "option1",
  "userSelection": "option2",
  "message": "Incorrect! The correct answer is: 1995"
}
```

---

## 💬 **6. COMMENTS & REPLIES (8 endpoints)**

```http
GET    /api/posts/:postId/replies         - Get all replies
POST   /api/posts/:postId/replies         - Create reply
GET    /api/replies/:replyId              - Get single reply
PUT    /api/replies/:replyId              - Edit reply
DELETE /api/replies/:replyId              - Delete reply
POST   /api/replies/:replyId/reactions    - React to reply
GET    /api/replies/:replyId/replies      - Get nested replies
POST   /api/replies/:replyId/reply        - Reply to a reply
```

#### Create Reply
```json
POST /api/posts/post123/replies
Request:
{
  "content": "<p>Great insights! Thanks for sharing.</p>"
}

Response:
{
  "id": "reply123",
  "userId": "user123",
  "user": { ...user object },
  "content": "<p>Great insights! Thanks for sharing.</p>",
  "timestamp": "Just now",
  "likes": 0,
  "reactions": {},
  "createdAt": "2024-01-03T10:30:00Z"
}
```

---

## 🏘️ **7. COMMUNITIES (9 endpoints)**

```http
GET    /api/communities                   - List all communities
GET    /api/communities/trending          - Get trending communities
GET    /api/communities/search            - Search communities
GET    /api/communities/:communityId      - Get community details
POST   /api/communities                   - Create new community
PUT    /api/communities/:communityId      - Update community
POST   /api/communities/:communityId/join - Join community
POST   /api/communities/:communityId/leave - Leave community
GET    /api/communities/:communityId/posts - Get community posts
```

### Query Parameters for GET /api/communities
```
?category=Technology|Design|Science|Business|Lifestyle|Gaming
&search=keyword
&page=1
&limit=20
```

#### Join Community
```json
POST /api/communities/comm123/join

Response:
{
  "id": "comm123",
  "name": "Tech Discussion",
  "description": "A community for tech enthusiasts...",
  "logo": "https://...",
  "banner": "https://...",
  "color": "from-blue-500 to-purple-600",
  "members": 12501,
  "isJoined": true,
  "category": "Technology",
  "isPublic": true
}
```

#### Create Community
```json
POST /api/communities
Request:
{
  "name": "AI Enthusiasts",
  "description": "Discuss everything about artificial intelligence",
  "category": "Technology",
  "isPublic": true,
  "logo": "base64_image_data",
  "banner": "base64_image_data"
}
```

---

## 💬 **8. MESSAGES & DIRECT CHAT (7 endpoints)**

```http
GET    /api/messages/conversations        - List all conversations
GET    /api/messages/conversations/:id    - Get conversation messages
POST   /api/messages/conversations        - Start new conversation
POST   /api/messages/conversations/:id/messages - Send message
PUT    /api/messages/conversations/:id/read - Mark conversation as read
DELETE /api/messages/:messageId           - Delete message
GET    /api/messages/admin                - Get admin support chat
```

#### Get Conversations
```json
GET /api/messages/conversations

Response:
{
  "conversations": [
    {
      "id": "conv123",
      "participants": [
        {
          "id": "user123",
          "name": "Sarah Miller",
          "handle": "@sarahm",
          "avatar": "https://...",
          "verified": true,
          "isOnline": false,
          "isAdmin": false
        }
      ],
      "lastMessage": "Thanks for the feedback!",
      "lastMessageTime": "2h",
      "unreadCount": 0,
      "updatedAt": "2024-01-03T08:30:00Z"
    }
  ]
}
```

#### Send Message
```json
POST /api/messages/conversations/conv123/messages
Request:
{
  "text": "Hey, how are you?",
  "attachments": []  // Optional: image URLs
}

Response:
{
  "id": "msg123",
  "conversationId": "conv123",
  "senderId": "user123",
  "text": "Hey, how are you?",
  "status": "sent",
  "timestamp": "Just now",
  "createdAt": "2024-01-03T10:45:00Z"
}
```

---

## 🔍 **9. SEARCH & DISCOVERY (6 endpoints)**

```http
GET    /api/search                        - Global search
GET    /api/trending                      - Get trending topics/hashtags
GET    /api/recommendations/users         - Get "Who to Follow"
GET    /api/recommendations/posts         - Get recommended posts
GET    /api/recommendations/communities   - Get recommended communities
GET    /api/hashtags/:tag/posts           - Get posts by hashtag
```

#### Global Search
```json
GET /api/search?q=react&type=all&page=1&limit=20

Response:
{
  "posts": [
    { ...post object }
  ],
  "users": [
    { ...user object }
  ],
  "communities": [
    { ...community object }
  ],
  "total": 245,
  "page": 1
}
```

#### Trending Topics
```json
GET /api/trending

Response:
{
  "topics": [
    {
      "id": "trend1",
      "title": "Claude Code Release",
      "category": "Technology",
      "posts": 45320,
      "rank": 1
    }
  ]
}
```

#### Who to Follow
```json
GET /api/recommendations/users?limit=5

Response:
{
  "users": [
    {
      "id": "user456",
      "name": "Sarah Johnson",
      "handle": "@sarahj",
      "avatar": "https://...",
      "bio": "Software Engineer | AI Enthusiast",
      "verified": true,
      "followers": 12500,
      "isFollowing": false
    }
  ]
}
```

---

## 🔔 **10. NOTIFICATIONS (6 endpoints)**

```http
GET    /api/notifications                 - Get all notifications
GET    /api/notifications/unread/count    - Get unread count
PUT    /api/notifications/:id/read        - Mark as read
PUT    /api/notifications/read-all        - Mark all as read
DELETE /api/notifications/:id             - Delete notification
GET    /api/notifications/live            - WebSocket for real-time notifications
```

#### Get Notifications
```json
GET /api/notifications?page=1&limit=20

Response:
{
  "notifications": [
    {
      "id": "notif1",
      "type": "reaction",
      "user": {
        "id": "user123",
        "handle": "@janedoe",
        "name": "Jane Doe",
        "avatar": "https://..."
      },
      "message": "reacted ❤️ to your post",
      "postId": "post123",
      "isRead": false,
      "timestamp": "5 minutes ago",
      "createdAt": "2024-01-03T10:40:00Z"
    },
    {
      "id": "notif2",
      "type": "follow",
      "user": { ...user object },
      "message": "started following you",
      "isRead": true,
      "timestamp": "1 hour ago",
      "createdAt": "2024-01-03T09:45:00Z"
    },
    {
      "id": "notif3",
      "type": "comment",
      "user": { ...user object },
      "message": "replied to your post",
      "postId": "post456",
      "replyId": "reply789",
      "isRead": false,
      "timestamp": "30 minutes ago",
      "createdAt": "2024-01-03T10:15:00Z"
    }
  ],
  "unreadCount": 12,
  "total": 245,
  "page": 1
}
```

### Notification Types:
- `reaction` - Someone reacted to your post
- `comment` - Someone replied to your post
- `follow` - Someone followed you
- `mention` - Someone mentioned you
- `poll_end` - Your poll ended
- `trivia_result` - Trivia result available

---

## 📸 **11. MEDIA & UPLOADS (5 endpoints)**

```http
POST   /api/media/upload                  - Upload single file
POST   /api/media/upload-multiple         - Upload multiple files
POST   /api/users/me/avatar               - Upload profile picture
POST   /api/posts/:postId/attach-media    - Attach media to post
DELETE /api/media/:mediaId                - Delete media
```

#### Upload Image
```json
POST /api/media/upload
Content-Type: multipart/form-data

Request:
{
  "file": <binary_data>,
  "type": "image|video"
}

Response:
{
  "id": "media123",
  "url": "https://cdn.connect.com/uploads/media123.jpg",
  "type": "image",
  "size": 245678,
  "mimeType": "image/jpeg"
}
```

---

## 🚩 **12. REPORTING & MODERATION (3 endpoints)**

```http
POST   /api/reports/posts/:postId         - Report post
POST   /api/reports/users/:userId         - Report user
GET    /api/admin/reports                 - Get all reports (admin only)
```

#### Report Post
```json
POST /api/reports/posts/post123
Request:
{
  "reason": "spam|harassment|inappropriate|misinformation",
  "details": "This post contains misleading information"
}

Response:
{
  "success": true,
  "reportId": "report123",
  "message": "Report submitted successfully"
}
```

---

## 📊 **13. ANALYTICS (2 endpoints)**

```http
GET    /api/analytics/posts/:postId       - Get post analytics
GET    /api/analytics/profile             - Get profile analytics
```

#### Post Analytics
```json
GET /api/analytics/posts/post123

Response:
{
  "postId": "post123",
  "views": 12450,
  "uniqueViews": 8932,
  "reactions": {
    "total": 523,
    "breakdown": {
      "❤️": 312,
      "👍": 156,
      "😂": 55
    }
  },
  "comments": 89,
  "shares": 145,
  "saves": 234,
  "engagement": {
    "rate": 4.2,
    "peakTime": "2024-01-03T14:00:00Z"
  }
}
```

---

## 🤖 **14. AI FEATURES (2 endpoints)**

Currently client-side with Gemini SDK, consider moving to backend for security:

```http
POST   /api/ai/summarize                  - Summarize post content
POST   /api/ai/generate-draft             - Generate AI post draft
```

#### Summarize Post
```json
POST /api/ai/summarize
Request:
{
  "content": "Long post content here..."
}

Response:
{
  "summary": "A concise summary of the post in one punchy sentence.",
  "model": "gemini-2.5-flash"
}
```

#### Generate Draft
```json
POST /api/ai/generate-draft
Request:
{
  "topic": "Artificial Intelligence trends",
  "tone": "Professional but engaging",
  "maxLength": 280
}

Response:
{
  "draft": "🚀 AI is transforming how we work and live! From ChatGPT to self-driving cars, the future is here. What's your favorite AI tool? #AI #Tech",
  "model": "gemini-2.5-flash"
}
```

---

## 📦 **DATA MODELS**

### User Model
```typescript
{
  id: string
  handle: string
  email: string
  passwordHash: string
  name: string
  avatar: string
  bio: string
  location: string
  website: string
  joinedDate: string
  verified: boolean
  isNew: boolean
  badge: "verified" | "new" | "member"
  followers: number
  following: number
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Post Model
```typescript
{
  id: string
  userId: string
  user: User
  type: "text" | "poll" | "trivia" | "review" | "qna" | "article"
  content: string  // HTML
  timestamp: string
  reactions: Record<emoji, count>
  comments: number
  shares: number
  isPinned: boolean

  // Type-specific
  pollOptions?: PollOption[]
  totalVotes?: number
  correctOptionId?: string  // trivia
  rating?: number  // 1-5 for reviews
  reviewTitle?: string
  tags?: string[]  // Q&A
  badge?: "POLL" | "TRIVIA" | "Q&A"
  articleImage?: string
  linkPreview?: LinkPreview

  createdAt: Date
  updatedAt: Date
}
```

### PollOption Model
```typescript
{
  id: string
  text: string
  votes: number
}
```

### Reply Model
```typescript
{
  id: string
  postId: string
  userId: string
  user: User
  content: string  // HTML
  timestamp: string
  likes: number
  reactions: Record<emoji, count>
  createdAt: Date
  updatedAt: Date
}
```

### Community Model
```typescript
{
  id: string
  name: string
  description: string
  logo: string
  banner: string
  color: string  // Tailwind gradient class
  members: number
  isJoined: boolean
  category: string
  isPublic: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
```

### Message Model
```typescript
{
  id: string
  conversationId: string
  senderId: string
  text: string
  status: "sent" | "delivered" | "read"
  timestamp: string
  createdAt: Date
}
```

### Conversation Model
```typescript
{
  id: string
  participants: User[]
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔧 **TECH STACK RECOMMENDATIONS**

### Backend
- **Framework:** Node.js + Express or NestJS (TypeScript)
- **Database:** PostgreSQL (relational) + Redis (caching)
- **Authentication:** JWT + bcrypt + Passport.js
- **Real-time:** Socket.io (messages, notifications)
- **File Storage:** AWS S3 / Cloudinary
- **Email:** SendGrid / AWS SES
- **Rate Limiting:** express-rate-limit
- **Validation:** Joi / Zod

### Database Schema
```sql
-- Users table with all profile fields
CREATE TABLE users (
  id UUID PRIMARY KEY,
  handle VARCHAR UNIQUE,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  name VARCHAR,
  avatar VARCHAR,
  bio TEXT,
  location VARCHAR,
  website VARCHAR,
  joined_date TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT TRUE,
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Posts table supporting all post types
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR CHECK (type IN ('text', 'poll', 'trivia', 'review', 'qna', 'article')),
  content TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  reactions JSONB DEFAULT '{}',
  comments_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  views_count INT DEFAULT 0,

  -- Type-specific fields
  poll_options JSONB,
  total_votes INT DEFAULT 0,
  correct_option_id VARCHAR,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  review_title VARCHAR,
  tags TEXT[],
  badge VARCHAR,
  article_image VARCHAR,
  link_preview JSONB,

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Replies table
CREATE TABLE replies (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT,
  likes_count INT DEFAULT 0,
  reactions JSONB DEFAULT '{}',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Communities table
CREATE TABLE communities (
  id UUID PRIMARY KEY,
  name VARCHAR,
  description TEXT,
  logo VARCHAR,
  banner VARCHAR,
  color VARCHAR,
  members_count INT DEFAULT 0,
  category VARCHAR,
  is_public BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Community members
CREATE TABLE community_members (
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP,
  PRIMARY KEY (community_id, user_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID,
  sender_id UUID REFERENCES users(id),
  text TEXT,
  status VARCHAR CHECK (status IN ('sent', 'delivered', 'read')),
  created_at TIMESTAMP
);

-- Follows table
CREATE TABLE follows (
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP,
  PRIMARY KEY (follower_id, following_id)
);

-- Reactions table
CREATE TABLE post_reactions (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  emoji VARCHAR,
  created_at TIMESTAMP,
  UNIQUE(post_id, user_id)
);

-- Saved posts table
CREATE TABLE saved_posts (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  saved_at TIMESTAMP,
  PRIMARY KEY (user_id, post_id)
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR,
  sender_id UUID REFERENCES users(id),
  post_id UUID REFERENCES posts(id),
  reply_id UUID REFERENCES replies(id),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);
```

---

## 🚀 **IMPLEMENTATION PRIORITY**

### Phase 1: MVP (4-6 weeks)
1. ✅ Authentication & User Management (10 endpoints)
2. ✅ Posts CRUD (12 endpoints)
3. ✅ Post Interactions - reactions, saves (8 endpoints)
4. ✅ Media Uploads (5 endpoints)
5. ✅ Profile Management (6 endpoints)

**Total: 41 endpoints**

### Phase 2: Social Features (3-4 weeks)
1. ✅ Comments & Replies (8 endpoints)
2. ✅ Search & Discovery (6 endpoints)
3. ✅ Notifications (6 endpoints)

**Total: 20 endpoints**

### Phase 3: Communities & Messaging (3-4 weeks)
1. ✅ Communities (9 endpoints)
2. ✅ Messages & Chat (7 endpoints)

**Total: 16 endpoints**

### Phase 4: Advanced Features (2-3 weeks)
1. ✅ Reporting & Moderation (3 endpoints)
2. ✅ Analytics (2 endpoints)

**Total: 5 endpoints**

---

## 🔒 **SECURITY CONSIDERATIONS**

1. **Authentication**
   - JWT with refresh tokens
   - Password hashing with bcrypt (12+ rounds)
   - Rate limiting on login attempts
   - CSRF protection

2. **Input Validation**
   - Sanitize HTML content
   - Validate all user inputs
   - File upload restrictions (size, type)
   - SQL injection prevention

3. **API Security**
   - CORS configuration
   - Rate limiting per IP/user
   - API key rotation
   - Request size limits

4. **Data Privacy**
   - GDPR compliance
   - Data encryption at rest
   - Secure WebSocket connections
   - Regular security audits

---

## 📝 **ADDITIONAL FEATURES NEEDED**

### Frontend Interactions Not Yet Backend-Backed:
1. ✅ Search functionality (currently just UI)
2. ✅ Notification bell (shows red dot, no actual data)
3. ✅ Help option in profile menu
4. ✅ Sign Out functionality
5. ✅ Theme toggle (dark/light) - store preference
6. ✅ Photo/Video upload buttons in post modal
7. ✅ Tag people in posts
8. ✅ Feeling/Activity status
9. ✅ Check-in location
10. ✅ Phone/Video call buttons in messages
11. ✅ Delete post (menu shows option, not functional)
12. ✅ Report post (menu shows option, not functional)
13. ✅ Edit post functionality
14. ✅ Filter trending topics by category

---

## 📖 **API RESPONSE FORMATS**

### Success Response
```json
{
  "success": true,
  "data": { ...response data },
  "message": "Operation successful",
  "timestamp": "2024-01-03T10:45:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2024-01-03T10:45:00Z"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [ ...items ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 245,
    "totalPages": 13,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🎯 **CONCLUSION**

**Total API Endpoints Required: 82**

This comprehensive API documentation covers every feature and interaction found in your Connect social media platform. The frontend is fully functional with excellent UI/UX, and now needs a complete backend implementation to become production-ready.

### Next Steps:
1. Set up backend infrastructure (Node.js + PostgreSQL + Redis)
2. Implement Phase 1 (MVP) APIs
3. Add WebSocket support for real-time features
4. Set up CI/CD pipeline
5. Deploy to cloud (AWS/GCP/Azure)
6. Add monitoring and analytics
7. Implement remaining phases

**Estimated Development Time: 12-16 weeks for complete backend**
