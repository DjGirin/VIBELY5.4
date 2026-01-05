// 미디어 관련 타입

export type MediaType = 'audio' | 'image' | 'video';

export interface Media {
  id: string;
  title: string;
  artist: string;
  fileUrl: string;
  albumArtUrl: string;
  mediaType: MediaType;
  duration?: number; // in seconds for audio/video
  genre: string;
}

export interface Playlist {
  id: string;
  name: string;
  authorId: string;
  description: string;
  trackIds: string[];
  coverArtUrl: string | string[]; // Single or collage of 4
}
