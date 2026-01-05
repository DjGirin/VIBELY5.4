import React, { useState, useMemo } from 'react';
import { StudioProject, StudioProjectMessage, File as ProjectFile, Folder, AudioFeedback } from '../types';
import {
  ArrowLeftIcon,
  SettingsIcon,
  PlayIcon,
  PauseIcon,
  MessageCircleIcon,
  Share2Icon,
  PlusIcon,
  ClockIcon,
  FileAudioIcon,
  UsersIcon,
  MoreHorizontalIcon,
  UploadCloudIcon,
  ChevronRightIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
  GitBranchIcon,
  MessageSquareIcon,
  XIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  BookmarkIcon,
  SendIcon
} from './icons';
import LazyImage from './LazyImage';
import ProjectChatRoom from './ProjectChatRoom';
import { users } from '../data';

interface StudioProjectDetailPageProps {
  project: StudioProject;
  onBack: () => void;
}

type TabId = 'files' | 'team' | 'chat';

const statusConfig = {
  planning: { label: '기획', color: 'bg-blue-500', textColor: 'text-blue-600', lightBg: 'bg-blue-50' },
  recording: { label: '녹음', color: 'bg-red-500', textColor: 'text-red-600', lightBg: 'bg-red-50' },
  mixing: { label: '믹싱', color: 'bg-yellow-500', textColor: 'text-yellow-600', lightBg: 'bg-yellow-50' },
  mastering: { label: '마스터링', color: 'bg-purple-500', textColor: 'text-purple-600', lightBg: 'bg-purple-50' },
  completed: { label: '완료', color: 'bg-green-500', textColor: 'text-green-600', lightBg: 'bg-green-50' },
};

const feedbackCategoryConfig = {
  mixing: { label: '믹싱', color: 'bg-yellow-100 text-yellow-700' },
  arrangement: { label: '편곡', color: 'bg-purple-100 text-purple-700' },
  vocal: { label: '보컬', color: 'bg-pink-100 text-pink-700' },
  mastering: { label: '마스터링', color: 'bg-blue-100 text-blue-700' },
  general: { label: '일반', color: 'bg-gray-100 text-gray-700' },
};

const feedbackStatusConfig = {
  open: { label: '열림', color: 'bg-red-100 text-red-700', icon: AlertCircleIcon },
  'in-progress': { label: '진행 중', color: 'bg-yellow-100 text-yellow-700', icon: ClockIcon },
  resolved: { label: '해결됨', color: 'bg-green-100 text-green-700', icon: CheckCircleIcon },
};

// 오디오 파형 플레이어 컴포넌트
const AudioWaveformPlayer: React.FC<{
  file: ProjectFile;
  feedbacks: AudioFeedback[];
  onTimeClick: (time: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  onSeek: (time: number) => void;
}> = ({ file, feedbacks, onTimeClick, isPlaying, onPlayPause, currentTime, onSeek }) => {
  const duration = file.duration || 180;
  const waveformData = file.waveformData || Array.from({ length: 50 }, () => Math.random() * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (currentTime / duration) * 100;

  return (
    <div className="bg-light-surface rounded-xl border border-light-border p-4">
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={onPlayPause}
          className="w-12 h-12 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-opacity"
        >
          {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6 pl-0.5" />}
        </button>
        <div className="flex-1">
          <p className="font-medium text-light-text-primary truncate">{file.name}</p>
          <p className="text-sm text-light-text-secondary">{formatTime(currentTime)} / {formatTime(duration)}</p>
        </div>
      </div>

      {/* 파형 시각화 */}
      <div
        className="relative h-20 bg-light-bg rounded-lg cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percent = x / rect.width;
          const time = percent * duration;
          onSeek(time);
        }}
      >
        {/* 파형 바 */}
        <div className="absolute inset-0 flex items-center justify-around px-1">
          {waveformData.map((height, i) => {
            const barPercent = (i / waveformData.length) * 100;
            const isPlayed = barPercent <= progressPercent;
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-colors ${
                  isPlayed ? 'bg-brand-pink' : 'bg-light-border group-hover:bg-light-text-muted'
                }`}
                style={{ height: `${Math.max(20, height * 0.7)}%` }}
              />
            );
          })}
        </div>

        {/* 피드백 마커 */}
        {feedbacks.map((fb) => {
          const leftPercent = (fb.startTime / duration) * 100;
          const widthPercent = fb.endTime
            ? ((fb.endTime - fb.startTime) / duration) * 100
            : 2;
          return (
            <div
              key={fb.id}
              className="absolute top-0 h-full cursor-pointer group/marker"
              style={{ left: `${leftPercent}%`, width: `${Math.max(widthPercent, 2)}%` }}
              onClick={(e) => {
                e.stopPropagation();
                onTimeClick(fb.startTime);
              }}
            >
              <div className={`h-full ${
                fb.status === 'resolved' ? 'bg-green-500/30' :
                fb.status === 'in-progress' ? 'bg-yellow-500/30' : 'bg-red-500/30'
              } rounded`} />
              <div className="absolute -top-1 left-0 w-3 h-3 rounded-full bg-brand-pink border-2 border-white shadow hidden group-hover/marker:block" />
            </div>
          );
        })}

        {/* 재생 위치 인디케이터 */}
        <div
          className="absolute top-0 w-0.5 h-full bg-brand-pink shadow-lg"
          style={{ left: `${progressPercent}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand-pink rounded-full" />
        </div>

        {/* 클릭하여 피드백 추가 힌트 */}
        <div className="absolute bottom-1 right-2 text-xs text-light-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
          클릭하여 피드백 추가
        </div>
      </div>
    </div>
  );
};

// 피드백 작성 모달
const FeedbackComposerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  audioFiles: ProjectFile[];
  selectedFileId?: string;
  selectedTime?: number;
  onSubmit: (feedback: Omit<AudioFeedback, 'id' | 'createdAt'>) => void;
  currentUser: any;
}> = ({ isOpen, onClose, audioFiles, selectedFileId, selectedTime, onSubmit, currentUser }) => {
  const [fileId, setFileId] = useState(selectedFileId || '');
  const [startTime, setStartTime] = useState(selectedTime || 0);
  const [endTime, setEndTime] = useState<number | undefined>();
  const [category, setCategory] = useState<AudioFeedback['category']>('general');
  const [content, setContent] = useState('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeStr: string): number => {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return parseInt(timeStr) || 0;
  };

  const handleSubmit = () => {
    if (!fileId || !content.trim()) return;

    onSubmit({
      fileId,
      author: currentUser,
      content: content.trim(),
      startTime,
      endTime,
      category,
      status: 'open',
    });

    setContent('');
    setStartTime(0);
    setEndTime(undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-light-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-light-surface border-b border-light-border p-4 flex items-center justify-between">
          <h3 className="font-bold text-lg">피드백 작성</h3>
          <button onClick={onClose} className="p-2 hover:bg-light-bg rounded-full">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* 파일 선택 */}
          <div>
            <label className="block text-sm font-medium text-light-text-secondary mb-2">
              오디오 파일
            </label>
            <select
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              className="w-full px-4 py-3 bg-light-bg border border-light-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
            >
              <option value="">파일 선택...</option>
              {audioFiles.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* 타임스탬프 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-light-text-secondary mb-2">
                시작 시간
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-muted" />
                <input
                  type="text"
                  value={formatTime(startTime)}
                  onChange={(e) => setStartTime(parseTime(e.target.value))}
                  placeholder="0:00"
                  className="w-full pl-10 pr-4 py-3 bg-light-bg border border-light-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-light-text-secondary mb-2">
                종료 시간 (선택)
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-muted" />
                <input
                  type="text"
                  value={endTime !== undefined ? formatTime(endTime) : ''}
                  onChange={(e) => setEndTime(e.target.value ? parseTime(e.target.value) : undefined)}
                  placeholder="0:00"
                  className="w-full pl-10 pr-4 py-3 bg-light-bg border border-light-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                />
              </div>
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-light-text-secondary mb-2">
              카테고리
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(feedbackCategoryConfig) as Array<keyof typeof feedbackCategoryConfig>).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-brand-pink text-white'
                      : `${feedbackCategoryConfig[cat].color} hover:opacity-80`
                  }`}
                >
                  {feedbackCategoryConfig[cat].label}
                </button>
              ))}
            </div>
          </div>

          {/* 피드백 내용 */}
          <div>
            <label className="block text-sm font-medium text-light-text-secondary mb-2">
              피드백 내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="피드백을 작성해주세요..."
              rows={4}
              className="w-full px-4 py-3 bg-light-bg border border-light-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink/50 resize-none"
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-light-surface border-t border-light-border p-4">
          <button
            onClick={handleSubmit}
            disabled={!fileId || !content.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-pink to-brand-purple text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            <SendIcon className="w-5 h-5" />
            <span>피드백 제출</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 파일 타입별 아이콘
const FileTypeIcon: React.FC<{ type: ProjectFile['type']; className?: string }> = ({ type, className = 'w-5 h-5' }) => {
  switch (type) {
    case 'audio':
      return <FileAudioIcon className={`${className} text-brand-pink`} />;
    case 'document':
      return <FileTextIcon className={`${className} text-blue-500`} />;
    case 'image':
      return <ImageIcon className={`${className} text-green-500`} />;
    case 'video':
      return <VideoIcon className={`${className} text-purple-500`} />;
    case 'midi':
      return <FileAudioIcon className={`${className} text-cyan-500`} />;
    default:
      return <FileTextIcon className={`${className} text-gray-500`} />;
  }
};

// 파일 아이템 컴포넌트 (개선됨)
const FileItem: React.FC<{
  file: ProjectFile;
  onPlay?: () => void;
  isPlaying?: boolean;
  onViewFeedback?: () => void;
  feedbackCount?: number;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}> = ({ file, onPlay, isPlaying, onViewFeedback, feedbackCount = 0, isBookmarked, onToggleBookmark }) => {
  const isAudio = file.type === 'audio';
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center p-3 bg-light-bg rounded-lg hover:bg-light-border/30 transition-colors group">
      {isAudio ? (
        <button
          onClick={onPlay}
          className="w-10 h-10 bg-brand-pink/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-brand-pink group-hover:text-white transition-colors flex-shrink-0"
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5 pl-0.5" />
          )}
        </button>
      ) : (
        <div className="w-10 h-10 bg-light-border rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <FileTypeIcon type={file.type} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium text-light-text-primary truncate">{file.name}</p>
        <div className="flex items-center space-x-2 text-xs text-light-text-secondary">
          <span>{file.uploadedBy.name}</span>
          <span>·</span>
          <span>{new Date(file.uploadedAt).toLocaleDateString('ko-KR')}</span>
          {file.duration && (
            <>
              <span>·</span>
              <span>{formatDuration(file.duration)}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 text-light-text-secondary flex-shrink-0">
        {/* 북마크 버튼 */}
        {onToggleBookmark && (
          <button
            onClick={onToggleBookmark}
            className={`p-1.5 rounded-full transition-colors ${
              isBookmarked
                ? 'text-yellow-500 bg-yellow-50'
                : 'hover:text-yellow-500 hover:bg-yellow-50 opacity-0 group-hover:opacity-100'
            }`}
          >
            <BookmarkIcon className="w-4 h-4" />
          </button>
        )}

        {/* 피드백 버튼 */}
        {isAudio && onViewFeedback && (
          <button
            onClick={onViewFeedback}
            className="flex items-center text-xs hover:text-brand-pink transition-colors"
          >
            <MessageSquareIcon className="w-4 h-4 mr-1" />
            {feedbackCount > 0 && <span>{feedbackCount}</span>}
          </button>
        )}

        {/* 버전 표시 */}
        <span className="flex items-center text-xs bg-light-surface px-2 py-1 rounded-full">
          <GitBranchIcon className="w-3 h-3 mr-1" />
          v{file.version}
        </span>

        <button className="p-1 hover:bg-light-surface rounded opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontalIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 폴더 컴포넌트
const FolderItem: React.FC<{
  folder: Folder;
  fileCount: number;
  onClick: () => void;
  isOpen: boolean;
}> = ({ folder, fileCount, onClick, isOpen }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 rounded-lg transition-all ${
      isOpen
        ? 'bg-brand-pink/10 border-brand-pink/30 border'
        : 'bg-light-surface border border-light-border hover:border-brand-pink/30'
    }`}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
      isOpen ? 'bg-brand-pink/20' : 'bg-light-bg'
    }`}>
      <span className="text-lg">{folder.icon || '📁'}</span>
    </div>
    <div className="flex-1 text-left">
      <p className="font-medium text-light-text-primary">{folder.name}</p>
      <p className="text-xs text-light-text-secondary">{fileCount}개 파일</p>
    </div>
    <ChevronRightIcon className={`w-5 h-5 text-light-text-muted transition-transform ${isOpen ? 'rotate-90' : ''}`} />
  </button>
);

// 피드백 아이템 컴포넌트
const FeedbackItem: React.FC<{
  feedback: AudioFeedback;
  onStatusChange: (status: AudioFeedback['status']) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}> = ({ feedback, onStatusChange, isBookmarked, onToggleBookmark }) => {
  const [expanded, setExpanded] = useState(false);
  const categoryConfig = feedbackCategoryConfig[feedback.category];
  const statusConfig = feedbackStatusConfig[feedback.status];
  const StatusIcon = statusConfig.icon;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-light-surface rounded-xl border border-light-border p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <LazyImage
            src={feedback.author.avatarUrl}
            alt={feedback.author.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-light-text-primary">{feedback.author.name}</p>
            <p className="text-xs text-light-text-secondary">{new Date(feedback.createdAt).toLocaleString('ko-KR')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${categoryConfig.color}`}>
            {categoryConfig.label}
          </span>
          <button
            onClick={() => onStatusChange(
              feedback.status === 'open' ? 'in-progress' :
              feedback.status === 'in-progress' ? 'resolved' : 'open'
            )}
            className={`flex items-center text-xs px-2 py-1 rounded-full ${statusConfig.color}`}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </button>
          {onToggleBookmark && (
            <button
              onClick={onToggleBookmark}
              className={`p-1.5 rounded-full transition-colors ${
                isBookmarked
                  ? 'text-yellow-500 bg-yellow-50'
                  : 'text-light-text-muted hover:text-yellow-500 hover:bg-yellow-50'
              }`}
            >
              <BookmarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 타임스탬프 */}
      <div className="flex items-center space-x-2 mb-2">
        <button className="flex items-center text-xs bg-brand-pink/10 text-brand-pink px-2 py-1 rounded-full hover:bg-brand-pink/20 transition-colors">
          <PlayIcon className="w-3 h-3 mr-1" />
          {formatTime(feedback.startTime)}
          {feedback.endTime && ` - ${formatTime(feedback.endTime)}`}
        </button>
      </div>

      {/* 피드백 내용 */}
      <p className="text-light-text-primary">{feedback.content}</p>

      {/* 답글 */}
      {feedback.replies && feedback.replies.length > 0 && (
        <div className="mt-3 space-y-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-brand-pink hover:underline"
          >
            {expanded ? '답글 숨기기' : `${feedback.replies.length}개의 답글 보기`}
          </button>
          {expanded && (
            <div className="space-y-2 pl-4 border-l-2 border-light-border">
              {feedback.replies.map(reply => (
                <div key={reply.id} className="bg-light-bg rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <LazyImage
                      src={reply.author.avatarUrl}
                      alt={reply.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm font-medium">{reply.author.name}</span>
                    <span className="text-xs text-light-text-secondary">{new Date(reply.createdAt).toLocaleString('ko-KR')}</span>
                  </div>
                  <p className="text-sm text-light-text-primary">{reply.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 팀 멤버 카드
const TeamMemberCard: React.FC<{
  contributor: StudioProject['contributors'][0];
}> = ({ contributor }) => {
  const roleColors: Record<string, string> = {
    '프로듀서': 'bg-purple-100 text-purple-700',
    Producer: 'bg-purple-100 text-purple-700',
    '베이스': 'bg-blue-100 text-blue-700',
    '보컬': 'bg-pink-100 text-pink-700',
    Vocalist: 'bg-pink-100 text-pink-700',
    '작곡가': 'bg-green-100 text-green-700',
    Composer: 'bg-green-100 text-green-700',
    '리드': 'bg-yellow-100 text-yellow-700',
    '패드': 'bg-cyan-100 text-cyan-700',
    '엔지니어': 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="flex items-center p-4 bg-light-surface rounded-xl border border-light-border hover:border-brand-pink/30 transition-colors">
      <LazyImage
        src={contributor.user.avatarUrl}
        alt={contributor.user.name}
        className="w-12 h-12 rounded-full mr-4"
      />
      <div className="flex-1">
        <p className="font-semibold text-light-text-primary">{contributor.user.name}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[contributor.role] || 'bg-light-bg text-light-text-secondary'}`}>
          {contributor.role}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`w-2 h-2 rounded-full ${contributor.user.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
        <button className="p-2 hover:bg-light-bg rounded-full transition-colors">
          <MessageCircleIcon className="w-5 h-5 text-light-text-secondary" />
        </button>
      </div>
    </div>
  );
};

const StudioProjectDetailPage: React.FC<StudioProjectDetailPageProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabId>('files');
  const [playingFileId, setPlayingFileId] = useState<string | null>(null);
  const [projectMessages, setProjectMessages] = useState<StudioProjectMessage[]>(project.messages);
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [feedbackFilter, setFeedbackFilter] = useState<AudioFeedback['status'] | 'all'>('all');
  const [feedbacks, setFeedbacks] = useState<AudioFeedback[]>(project.feedbacks || []);

  // 새 상태: 피드백 작성 모달
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedFeedbackFileId, setSelectedFeedbackFileId] = useState<string | undefined>();
  const [selectedFeedbackTime, setSelectedFeedbackTime] = useState<number | undefined>();

  // 새 상태: 오디오 플레이어
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [selectedAudioFileForPlayer, setSelectedAudioFileForPlayer] = useState<string | null>(null);

  // 새 상태: 북마크
  const [bookmarkedFileIds, setBookmarkedFileIds] = useState<Set<string>>(new Set());
  const [bookmarkedFeedbackIds, setBookmarkedFeedbackIds] = useState<Set<string>>(new Set());

  const status = statusConfig[project.status];
  const currentUser = users['user1'];

  // 폴더별 파일 그룹핑
  const filesByFolder = useMemo(() => {
    const grouped: Record<string, ProjectFile[]> = { root: [] };
    project.folders.forEach(folder => {
      grouped[folder.id] = [];
    });
    project.files.forEach(file => {
      const folderId = file.folderId || 'root';
      if (!grouped[folderId]) grouped[folderId] = [];
      grouped[folderId].push(file);
    });
    return grouped;
  }, [project.files, project.folders]);

  // 피드백 필터링
  const filteredFeedbacks = useMemo(() => {
    if (feedbackFilter === 'all') return feedbacks;
    return feedbacks.filter(f => f.status === feedbackFilter);
  }, [feedbacks, feedbackFilter]);

  // 파일별 피드백 수
  const feedbackCountByFile = useMemo(() => {
    const counts: Record<string, number> = {};
    feedbacks.forEach(f => {
      counts[f.fileId] = (counts[f.fileId] || 0) + 1;
    });
    return counts;
  }, [feedbacks]);

  const handleSendMessage = (text: string) => {
    const newMessage: StudioProjectMessage = {
      id: `msg${Date.now()}`,
      user: currentUser,
      text,
      createdAt: new Date().toISOString(),
    };
    setProjectMessages(prev => [...prev, newMessage]);
  };

  const handleFeedbackStatusChange = (feedbackId: string, newStatus: AudioFeedback['status']) => {
    setFeedbacks(prev => prev.map(f =>
      f.id === feedbackId ? { ...f, status: newStatus } : f
    ));
  };

  // 피드백 추가 핸들러
  const handleAddFeedback = (feedbackData: Omit<AudioFeedback, 'id' | 'createdAt'>) => {
    const newFeedback: AudioFeedback = {
      ...feedbackData,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setFeedbacks(prev => [...prev, newFeedback]);
  };

  // 파형에서 피드백 추가 시작
  const handleWaveformFeedbackClick = (fileId: string, time: number) => {
    setSelectedFeedbackFileId(fileId);
    setSelectedFeedbackTime(time);
    setIsFeedbackModalOpen(true);
  };

  // 북마크 토글 핸들러
  const handleToggleFileBookmark = (fileId: string) => {
    setBookmarkedFileIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const handleToggleFeedbackBookmark = (feedbackId: string) => {
    setBookmarkedFeedbackIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(feedbackId)) {
        newSet.delete(feedbackId);
      } else {
        newSet.add(feedbackId);
      }
      return newSet;
    });
  };

  // 오디오 파일만 필터
  const audioFiles = useMemo(() =>
    project.files.filter(f => f.type === 'audio'),
    [project.files]
  );

  // 선택된 오디오 파일의 피드백
  const selectedFileFeedbacks = useMemo(() =>
    selectedAudioFileForPlayer
      ? feedbacks.filter(f => f.fileId === selectedAudioFileForPlayer)
      : [],
    [selectedAudioFileForPlayer, feedbacks]
  );

  // 북마크된 파일들
  const bookmarkedFiles = useMemo(() =>
    project.files.filter(f => bookmarkedFileIds.has(f.id)),
    [project.files, bookmarkedFileIds]
  );

  // 북마크된 피드백들
  const bookmarkedFeedbacks = useMemo(() =>
    feedbacks.filter(f => bookmarkedFeedbackIds.has(f.id)),
    [feedbacks, bookmarkedFeedbackIds]
  );

  // 탭: 파일, 팀(피드백+팀+북마크 통합), 채팅
  const tabs: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'files', label: '파일', icon: <FileAudioIcon className="w-4 h-4" />, badge: project.files.length },
    { id: 'team', label: '팀', icon: <UsersIcon className="w-4 h-4" />, badge: project.contributors.length + feedbacks.filter(f => f.status !== 'resolved').length },
    { id: 'chat', label: '채팅', icon: <MessageCircleIcon className="w-4 h-4" />, badge: projectMessages.length },
  ];

  // 팀 탭 내부 서브탭 상태
  const [teamSubTab, setTeamSubTab] = useState<'team' | 'feedback' | 'bookmarks'>('team');

  return (
    <main className="flex-1 bg-light-bg min-h-screen">
      {/* 헤더 */}
      <div className="bg-light-surface border-b border-light-border sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2 hover:bg-light-bg rounded-full -ml-2">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-light-bg rounded-full">
                <Share2Icon className="w-5 h-5 text-light-text-secondary" />
              </button>
              <button className="p-2 hover:bg-light-bg rounded-full">
                <SettingsIcon className="w-5 h-5 text-light-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 히어로 섹션 */}
      <div className="bg-gradient-to-b from-light-surface to-light-bg">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* 커버 이미지 */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
              <LazyImage
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 프로젝트 정보 */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color} text-white`}>
                  {status.label}
                </span>
                {project.isPublic && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-light-bg text-light-text-secondary">
                    공개
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-light-text-primary mb-2">
                {project.title}
              </h1>
              <p className="text-light-text-secondary mb-4">{project.description}</p>

              {/* 메타 정보 */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="px-3 py-1 bg-light-bg rounded-full">{project.genre}</span>
                {project.bpm && <span className="text-light-text-secondary">{project.bpm} BPM</span>}
                {project.key && <span className="text-light-text-secondary">Key: {project.key}</span>}
                <span className="text-light-text-secondary flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {new Date(project.lastUpdatedAt).toLocaleDateString('ko-KR')}
                </span>
              </div>

              {/* 진행률 */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-light-text-secondary">진행률</span>
                  <span className="font-bold text-brand-pink">{project.progress}%</span>
                </div>
                <div className="h-2 bg-light-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-pink to-brand-purple rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-light-surface border-b border-light-border sticky top-[57px] z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-pink text-brand-pink'
                    : 'border-transparent text-light-text-secondary hover:text-light-text-primary'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-brand-pink/10 text-brand-pink' : 'bg-light-bg text-light-text-secondary'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* 파일 탭 */}
        {activeTab === 'files' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-light-text-primary">프로젝트 파일</h3>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-brand-pink to-brand-purple text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                <UploadCloudIcon className="w-5 h-5" />
                <span>업로드</span>
              </button>
            </div>

            {/* DAW 프로젝트 파일 업로드 안내 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-4 mb-6">
              <h4 className="font-bold text-light-text-primary mb-2 flex items-center">
                🎹 DAW 프로젝트 파일 지원
              </h4>
              <p className="text-sm text-light-text-secondary mb-3">
                Logic Pro, Ableton Live, FL Studio 프로젝트 파일을 업로드하고 팀과 공유하세요.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1.5 bg-white rounded-lg text-sm font-medium border border-purple-200">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  .logicx (Logic Pro)
                </span>
                <span className="inline-flex items-center px-3 py-1.5 bg-white rounded-lg text-sm font-medium border border-purple-200">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  .als (Ableton Live)
                </span>
                <span className="inline-flex items-center px-3 py-1.5 bg-white rounded-lg text-sm font-medium border border-purple-200">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  .flp (FL Studio)
                </span>
                <span className="inline-flex items-center px-3 py-1.5 bg-white rounded-lg text-sm font-medium border border-purple-200">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                  .mid / .midi
                </span>
                <span className="inline-flex items-center px-3 py-1.5 bg-white rounded-lg text-sm font-medium border border-purple-200">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  스템 파일 (.wav, .aiff)
                </span>
              </div>
              <button className="mt-3 w-full flex items-center justify-center space-x-2 bg-white border-2 border-dashed border-purple-300 text-purple-600 px-4 py-3 rounded-xl hover:bg-purple-50 transition-colors">
                <UploadCloudIcon className="w-5 h-5" />
                <span className="font-medium">프로젝트 파일 드래그 또는 클릭하여 업로드</span>
              </button>
            </div>

            {/* 폴더 그리드 - 모바일에서 2개씩 */}
            {project.folders.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-light-text-secondary mb-3">폴더</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {project.folders.map(folder => (
                    <FolderItem
                      key={folder.id}
                      folder={folder}
                      fileCount={filesByFolder[folder.id]?.length || 0}
                      onClick={() => setOpenFolderId(openFolderId === folder.id ? null : folder.id)}
                      isOpen={openFolderId === folder.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 선택된 폴더의 파일들 */}
            {openFolderId && filesByFolder[openFolderId]?.length > 0 && (
              <div className="mb-6 bg-light-surface rounded-xl border border-light-border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{project.folders.find(f => f.id === openFolderId)?.icon}</span>
                    <h4 className="font-bold text-light-text-primary">
                      {project.folders.find(f => f.id === openFolderId)?.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => setOpenFolderId(null)}
                    className="text-sm text-light-text-secondary hover:text-light-text-primary"
                  >
                    닫기
                  </button>
                </div>
                <div className="space-y-2">
                  {filesByFolder[openFolderId].map(file => (
                    <FileItem
                      key={file.id}
                      file={file}
                      onPlay={() => setPlayingFileId(playingFileId === file.id ? null : file.id)}
                      isPlaying={playingFileId === file.id}
                      feedbackCount={feedbackCountByFile[file.id] || 0}
                      onViewFeedback={file.type === 'audio' ? () => {
                        setActiveTab('team');
                        setTeamSubTab('feedback');
                      } : undefined}
                      isBookmarked={bookmarkedFileIds.has(file.id)}
                      onToggleBookmark={() => handleToggleFileBookmark(file.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 폴더에 속하지 않은 파일들 */}
            {filesByFolder.root?.length > 0 && (
              <div>
                <h4 className="font-medium text-light-text-secondary mb-3">기타 파일</h4>
                <div className="space-y-2">
                  {filesByFolder.root.map(file => (
                    <FileItem
                      key={file.id}
                      file={file}
                      onPlay={() => setPlayingFileId(playingFileId === file.id ? null : file.id)}
                      isPlaying={playingFileId === file.id}
                      feedbackCount={feedbackCountByFile[file.id] || 0}
                      onViewFeedback={file.type === 'audio' ? () => {
                        setActiveTab('team');
                        setTeamSubTab('feedback');
                      } : undefined}
                      isBookmarked={bookmarkedFileIds.has(file.id)}
                      onToggleBookmark={() => handleToggleFileBookmark(file.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {project.files.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-light-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileAudioIcon className="w-8 h-8 text-light-text-muted" />
                </div>
                <p className="text-light-text-secondary mb-4">아직 업로드된 파일이 없습니다.</p>
                <button className="text-brand-pink hover:underline">첫 번째 파일 업로드하기</button>
              </div>
            )}
          </div>
        )}

        {/* 팀 탭 (팀 + 피드백 + 북마크 통합) */}
        {activeTab === 'team' && (
          <div>
            {/* 서브탭 */}
            <div className="flex space-x-1 mb-6 bg-light-bg rounded-xl p-1 overflow-x-auto">
              <button
                onClick={() => setTeamSubTab('team')}
                className={`flex-1 min-w-0 px-3 md:px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  teamSubTab === 'team'
                    ? 'bg-light-surface text-brand-pink shadow-sm'
                    : 'text-light-text-secondary hover:text-light-text-primary'
                }`}
              >
                <UsersIcon className="w-4 h-4 inline-block mr-1" />
                <span className="hidden sm:inline">팀</span> ({project.contributors.length})
              </button>
              <button
                onClick={() => setTeamSubTab('feedback')}
                className={`flex-1 min-w-0 px-3 md:px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  teamSubTab === 'feedback'
                    ? 'bg-light-surface text-brand-pink shadow-sm'
                    : 'text-light-text-secondary hover:text-light-text-primary'
                }`}
              >
                <MessageSquareIcon className="w-4 h-4 inline-block mr-1" />
                <span className="hidden sm:inline">피드백</span> ({feedbacks.filter(f => f.status !== 'resolved').length})
              </button>
              <button
                onClick={() => setTeamSubTab('bookmarks')}
                className={`flex-1 min-w-0 px-3 md:px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  teamSubTab === 'bookmarks'
                    ? 'bg-light-surface text-brand-pink shadow-sm'
                    : 'text-light-text-secondary hover:text-light-text-primary'
                }`}
              >
                <BookmarkIcon className="w-4 h-4 inline-block mr-1" />
                <span className="hidden sm:inline">북마크</span>
              </button>
            </div>

            {/* 팀 멤버 서브탭 */}
            {teamSubTab === 'team' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-light-text-primary">팀 멤버</h3>
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-brand-pink to-brand-purple text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                    <PlusIcon className="w-5 h-5" />
                    <span>초대</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.contributors.map(contributor => (
                    <TeamMemberCard key={contributor.user.id} contributor={contributor} />
                  ))}
                </div>
              </div>
            )}

            {/* 피드백 서브탭 */}
            {teamSubTab === 'feedback' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-light-text-primary">오디오 피드백</h3>
                    <p className="text-sm text-light-text-secondary mt-1">
                      {feedbacks.filter(f => f.status === 'open').length} 열림 · {feedbacks.filter(f => f.status === 'in-progress').length} 진행 중 · {feedbacks.filter(f => f.status === 'resolved').length} 해결됨
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      value={feedbackFilter}
                      onChange={(e) => setFeedbackFilter(e.target.value as AudioFeedback['status'] | 'all')}
                      className="px-3 py-2 bg-light-surface border border-light-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                    >
                      <option value="all">전체</option>
                      <option value="open">열림</option>
                      <option value="in-progress">진행 중</option>
                      <option value="resolved">해결됨</option>
                    </select>
                    <button
                      onClick={() => {
                        setSelectedFeedbackFileId(undefined);
                        setSelectedFeedbackTime(undefined);
                        setIsFeedbackModalOpen(true);
                      }}
                      className="flex items-center space-x-2 bg-gradient-to-r from-brand-pink to-brand-purple text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <PlusIcon className="w-5 h-5" />
                      <span className="hidden sm:inline">피드백 추가</span>
                    </button>
                  </div>
                </div>

                {/* 오디오 파형 플레이어 섹션 */}
                {audioFiles.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-light-text-secondary">오디오 파일 선택</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {audioFiles.map(file => (
                        <button
                          key={file.id}
                          onClick={() => setSelectedAudioFileForPlayer(
                            selectedAudioFileForPlayer === file.id ? null : file.id
                          )}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            selectedAudioFileForPlayer === file.id
                              ? 'bg-brand-pink text-white'
                              : 'bg-light-surface border border-light-border hover:border-brand-pink/50'
                          }`}
                        >
                          <FileAudioIcon className="w-4 h-4 inline-block mr-2" />
                          {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                          {feedbackCountByFile[file.id] > 0 && (
                            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                              selectedAudioFileForPlayer === file.id
                                ? 'bg-white/20'
                                : 'bg-brand-pink/10 text-brand-pink'
                            }`}>
                              {feedbackCountByFile[file.id]}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* 선택된 파일의 파형 플레이어 */}
                    {selectedAudioFileForPlayer && (
                      <AudioWaveformPlayer
                        file={audioFiles.find(f => f.id === selectedAudioFileForPlayer)!}
                        feedbacks={selectedFileFeedbacks}
                        onTimeClick={(time) => handleWaveformFeedbackClick(selectedAudioFileForPlayer, time)}
                        isPlaying={playingFileId === selectedAudioFileForPlayer}
                        onPlayPause={() => setPlayingFileId(
                          playingFileId === selectedAudioFileForPlayer ? null : selectedAudioFileForPlayer
                        )}
                        currentTime={currentPlaybackTime}
                        onSeek={setCurrentPlaybackTime}
                      />
                    )}
                  </div>
                )}

                {/* 피드백 목록 */}
                <div className="space-y-4">
                  {filteredFeedbacks.map(feedback => (
                    <FeedbackItem
                      key={feedback.id}
                      feedback={feedback}
                      onStatusChange={(status) => handleFeedbackStatusChange(feedback.id, status)}
                      isBookmarked={bookmarkedFeedbackIds.has(feedback.id)}
                      onToggleBookmark={() => handleToggleFeedbackBookmark(feedback.id)}
                    />
                  ))}
                </div>

                {filteredFeedbacks.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-light-bg rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquareIcon className="w-8 h-8 text-light-text-muted" />
                    </div>
                    <p className="text-light-text-secondary mb-4">
                      {feedbackFilter === 'all'
                        ? '아직 피드백이 없습니다.'
                        : `'${feedbackStatusConfig[feedbackFilter as AudioFeedback['status']].label}' 상태의 피드백이 없습니다.`
                      }
                    </p>
                    <button
                      onClick={() => {
                        setSelectedFeedbackFileId(undefined);
                        setSelectedFeedbackTime(undefined);
                        setIsFeedbackModalOpen(true);
                      }}
                      className="text-brand-pink hover:underline"
                    >
                      첫 번째 피드백 추가하기
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 북마크 서브탭 */}
            {teamSubTab === 'bookmarks' && (
              <div>
                {(bookmarkedFiles.length > 0 || bookmarkedFeedbacks.length > 0) ? (
                  <div className="space-y-6">
                    {/* 북마크된 파일 */}
                    {bookmarkedFiles.length > 0 && (
                      <div>
                        <h4 className="font-medium text-light-text-secondary mb-3 flex items-center">
                          <FileAudioIcon className="w-4 h-4 mr-2" />
                          북마크된 파일 ({bookmarkedFiles.length})
                        </h4>
                        <div className="space-y-2">
                          {bookmarkedFiles.map(file => (
                            <div key={file.id} className="flex items-center p-3 bg-light-surface rounded-lg border border-light-border">
                              <div className="w-10 h-10 bg-brand-pink/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                <FileTypeIcon type={file.type} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-light-text-primary truncate">{file.name}</p>
                                <p className="text-xs text-light-text-secondary">
                                  {file.uploadedBy.name} · v{file.version}
                                </p>
                              </div>
                              <button
                                onClick={() => handleToggleFileBookmark(file.id)}
                                className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors"
                              >
                                <BookmarkIcon className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 북마크된 피드백 */}
                    {bookmarkedFeedbacks.length > 0 && (
                      <div>
                        <h4 className="font-medium text-light-text-secondary mb-3 flex items-center">
                          <MessageSquareIcon className="w-4 h-4 mr-2" />
                          북마크된 피드백 ({bookmarkedFeedbacks.length})
                        </h4>
                        <div className="space-y-4">
                          {bookmarkedFeedbacks.map(feedback => (
                            <FeedbackItem
                              key={feedback.id}
                              feedback={feedback}
                              onStatusChange={(status) => handleFeedbackStatusChange(feedback.id, status)}
                              isBookmarked={true}
                              onToggleBookmark={() => handleToggleFeedbackBookmark(feedback.id)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-light-bg rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">⭐</span>
                    </div>
                    <p className="text-light-text-secondary mb-4">북마크한 항목이 없습니다.</p>
                    <p className="text-sm text-light-text-muted">중요한 파일이나 피드백을 북마크해보세요.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 채팅 탭 */}
        {activeTab === 'chat' && (
          <div className="h-[calc(100vh-400px)] min-h-[400px]">
            <ProjectChatRoom
              messages={projectMessages}
              currentUser={currentUser}
              contributors={project.contributors}
              onSendMessage={handleSendMessage}
              projectTitle={project.title}
            />
          </div>
        )}
      </div>

      {/* 하단 액션 바 (모바일) - 3개 탭으로 간소화 */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-light-surface border-t border-light-border p-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('files')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${activeTab === 'files' ? 'text-brand-pink bg-brand-pink/10' : 'text-light-text-secondary'}`}
          >
            <FileAudioIcon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">파일</span>
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${activeTab === 'team' ? 'text-brand-pink bg-brand-pink/10' : 'text-light-text-secondary'}`}
          >
            <UsersIcon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">팀</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${activeTab === 'chat' ? 'text-brand-pink bg-brand-pink/10' : 'text-light-text-secondary'}`}
          >
            <MessageCircleIcon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">채팅</span>
          </button>
        </div>
      </div>

      {/* 피드백 작성 모달 */}
      <FeedbackComposerModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        audioFiles={audioFiles}
        selectedFileId={selectedFeedbackFileId}
        selectedTime={selectedFeedbackTime}
        onSubmit={handleAddFeedback}
        currentUser={currentUser}
      />
    </main>
  );
};

export default StudioProjectDetailPage;
