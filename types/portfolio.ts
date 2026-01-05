// 포트폴리오 관련 타입
import { User } from './user';
import { Media } from './media';

export interface AITool {
  name: string;
  iconUrl: string;
}

export interface Prompt {
  id: string;
  title: string;
  text: string;
  parameters: { [key: string]: string };
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  finalTrack: Media;
  aiTools: AITool[];
  prompts: Prompt[];
  tags: string[];
  credits: { user: User; role: string }[];
  createdAt: string;
  likes: number;
  viewCount: number;
}
