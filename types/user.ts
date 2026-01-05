// 사용자 관련 타입

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  isOnline: boolean;
  isFollowing: boolean;
  isContributor: boolean;
  bio: string;
  genreTags: string[];
  followersCount: number;
  followingCount: number;
  followingIds: string[];
  skillTags?: string[];
  equipment?: string[];
  collaborationRating?: number;
  completedCollabs?: number;
  responseRate?: number;
}

export interface CollaborationReview {
  id: string;
  reviewer: User;
  projectTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
  role: string;
}
