// 스튜디오/프로젝트 관련 타입
import { User } from './user';

export type StudioProjectStatus = 'planning' | 'recording' | 'mixing' | 'mastering' | 'completed';
export type ProjectTemplate = 'kpop' | 'hiphop' | 'edm' | 'ost' | 'lofi' | 'custom';

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignees: User[];
  description: string;
  comments: { user: User; text: string; createdAt: string }[];
}

export interface File {
  id: string;
  name: string;
  type: 'audio' | 'midi' | 'document' | 'image' | 'video' | 'other';
  url: string;
  uploadedBy: User;
  uploadedAt: string;
  version: number;
  folderId?: string;
  duration?: number;
  comments?: number;
  waveformData?: number[];
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  projectId: string;
  createdAt: string;
  color?: string;
  icon?: string;
}

export interface AudioFeedback {
  id: string;
  fileId: string;
  author: User;
  content: string;
  startTime: number;
  endTime?: number;
  category: 'mixing' | 'arrangement' | 'vocal' | 'mastering' | 'general';
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  replies?: AudioFeedbackReply[];
}

export interface AudioFeedbackReply {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface FileVersion {
  id: string;
  fileId: string;
  version: number;
  url: string;
  uploadedBy: User;
  uploadedAt: string;
  changelog?: string;
}

export interface StudioProjectMessage {
  id: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface StudioProject {
  id: string;
  title: string;
  description: string;
  status: StudioProjectStatus;
  tags: string[];
  genre: string;
  coverImage?: string;
  bpm?: number;
  key?: string;
  deadline?: string;
  template?: ProjectTemplate;
  contributors: { user: User; role: string }[];
  lastUpdatedAt: string;
  progress: number;
  isPublic: boolean;
  tasks: Task[];
  files: File[];
  folders: Folder[];
  messages: StudioProjectMessage[];
  feedbacks?: AudioFeedback[];
}

export interface ProjectMilestone {
  id: string;
  name: string;
  dueDate?: string;
  completed: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: { user: User; role: 'Admin' | 'Member' }[];
  projectIds: string[];
  createdAt: string;
}
