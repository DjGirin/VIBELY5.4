// 소셜/커뮤니티 관련 타입
import { User } from './user';
import { Media } from './media';

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  timestamp: number; // for audio comments, in seconds
  reactions?: { [emoji: string]: string[] };
}

export interface Post {
  id: string;
  author: User;
  postedAt: string;
  description: string;
  media: Media;
  likes: number;
  comments: Comment[];
  portfolioProjectId?: string;
}

export type MessageType = 'text' | 'post_share' | 'prompt_share';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | Post | { promptText: string };
  type: MessageType;
  timestamp: string;
  isRead: boolean;
  reactions?: { [emoji: string]: string[] };
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
}

export type ThreadCategory = 'collaboration' | 'challenge' | 'feedback' | 'showcase' | 'general';

export interface Reply {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  votes: { up: number; down: number };
  parentReplyId?: string;
  replies?: Reply[];
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  author: User;
  category: ThreadCategory;
  createdAt: string;
  votes: { up: number; down: number };
  replies: Reply[];
  viewCount: number;
  tags: string[];
  isPinned?: boolean;
  attachment?: Post;
  collaborationDetails?: {
    roles: string[];
    compensation: string;
  };
}

export interface ActivityNotification {
  id: string;
  type: 'revenue' | 'follow' | 'message' | 'like' | 'music_shared' | 'general';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  metadata?: {
    avatarUrl?: string;
    amount?: string;
  };
}
