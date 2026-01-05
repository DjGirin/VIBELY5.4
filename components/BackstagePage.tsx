import React, { useMemo } from 'react';
import { LayoutDashboardIcon, FolderKanbanIcon, UsersIcon, SparklesIcon, TrendingUpIcon, CalendarIcon, HandshakeIcon, FileAudioIcon, MessageSquareIcon, CheckCircleIcon, UserPlusIcon } from './icons';
import { sampleStudioProjects } from '../data';
import LazyImage from './LazyImage';

// 상대 시간 포맷터
const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
};

// 활동 타입
interface Activity {
  id: string;
  type: 'file_upload' | 'feedback' | 'status_change' | 'team_join' | 'message';
  action: string;
  projectId: string;
  projectTitle: string;
  timestamp: string;
  icon: string;
  user?: { name: string; avatarUrl: string };
}

interface BackstagePageProps {
  onNavigate: (page: any) => void;
  onNavigateToStudioProject?: (projectId: string) => void;
}

// 프로젝트 상태별 스타일
const statusConfig = {
  planning: { label: '기획', color: 'bg-blue-500', lightBg: 'bg-blue-100', textColor: 'text-blue-700' },
  recording: { label: '녹음', color: 'bg-red-500', lightBg: 'bg-red-100', textColor: 'text-red-700' },
  mixing: { label: '믹싱', color: 'bg-yellow-500', lightBg: 'bg-yellow-100', textColor: 'text-yellow-700' },
  mastering: { label: '마스터링', color: 'bg-purple-500', lightBg: 'bg-purple-100', textColor: 'text-purple-700' },
  completed: { label: '완료', color: 'bg-green-500', lightBg: 'bg-green-100', textColor: 'text-green-700' },
};

// 빠른 액세스 카드
const QuickAccessCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  gradient: string;
}> = ({ icon, label, description, onClick, gradient }) => (
  <button
    onClick={onClick}
    className={`${gradient} rounded-xl p-5 text-left text-white hover:opacity-90 transition-opacity shadow-lg group`}
  >
    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-lg">{label}</h3>
    <p className="text-white/80 text-sm mt-1">{description}</p>
  </button>
);

// 미니 프로젝트 카드
const MiniProjectCard: React.FC<{
  project: typeof sampleStudioProjects[0];
  onClick: () => void;
}> = ({ project, onClick }) => {
  const status = statusConfig[project.status];

  return (
    <button
      onClick={onClick}
      className="bg-light-surface rounded-xl border border-light-border p-4 text-left hover:shadow-md hover:border-brand-pink/30 transition-all w-full group"
    >
      <div className="flex items-start justify-between mb-3">
        {/* 상태 뱃지 */}
        <span className={`${status.lightBg} ${status.textColor} text-xs font-semibold px-2.5 py-1 rounded-full`}>
          {status.label}
        </span>
        {/* 진행률 */}
        <span className="text-xs font-bold text-brand-pink">{project.progress}%</span>
      </div>

      <h4 className="font-bold text-light-text-primary mb-1 truncate group-hover:text-brand-pink transition-colors">
        {project.title}
      </h4>
      <p className="text-xs text-light-text-secondary mb-3 line-clamp-1">{project.description}</p>

      {/* 진행률 바 */}
      <div className="relative h-1.5 bg-light-bg rounded-full overflow-hidden mb-3">
        <div
          className={`absolute left-0 top-0 h-full ${status.color} rounded-full transition-all`}
          style={{ width: `${project.progress}%` }}
        />
      </div>

      {/* 기여자 */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.contributors.slice(0, 3).map(c => (
            <LazyImage
              key={c.user.id}
              src={c.user.avatarUrl}
              alt={c.user.name}
              className="w-6 h-6 rounded-full border-2 border-light-surface"
            />
          ))}
          {project.contributors.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-light-bg border-2 border-light-surface flex items-center justify-center text-xs text-light-text-secondary">
              +{project.contributors.length - 3}
            </div>
          )}
        </div>
        <span className="text-xs text-light-text-secondary">
          {project.tasks.filter(t => t.status === 'completed').length}/{project.tasks.length} 완료
        </span>
      </div>
    </button>
  );
};

const BackstagePage: React.FC<BackstagePageProps> = ({ onNavigate, onNavigateToStudioProject }) => {
  // 최근 프로젝트 (진행 중인 것 우선)
  const recentProjects = [...sampleStudioProjects]
    .sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
    })
    .slice(0, 4);

  // 통계
  const stats = {
    total: sampleStudioProjects.length,
    inProgress: sampleStudioProjects.filter(p => p.status !== 'completed').length,
    completed: sampleStudioProjects.filter(p => p.status === 'completed').length,
  };

  // 동적 최근 활동 생성
  const recentActivities = useMemo(() => {
    const activities: Activity[] = [];

    sampleStudioProjects.forEach(project => {
      // 파일 업로드 활동
      project.files?.forEach(file => {
        activities.push({
          id: `file-${file.id}`,
          type: 'file_upload',
          action: `새 파일 업로드: ${file.name}`,
          projectId: project.id,
          projectTitle: project.title,
          timestamp: file.uploadedAt,
          icon: '📤',
          user: file.uploadedBy,
        });
      });

      // 피드백 활동
      project.feedbacks?.forEach(feedback => {
        activities.push({
          id: `feedback-${feedback.id}`,
          type: 'feedback',
          action: `피드백 추가`,
          projectId: project.id,
          projectTitle: project.title,
          timestamp: feedback.createdAt,
          icon: '💬',
          user: feedback.author,
        });
      });

      // 메시지 활동
      project.messages?.slice(-2).forEach(msg => {
        const msgUser = 'user' in msg ? msg.user : ('author' in msg ? msg.author : null);
        const msgTimestamp = 'createdAt' in msg ? msg.createdAt : ('timestamp' in msg ? msg.timestamp : '');
        if (msgUser && msgTimestamp) {
          activities.push({
            id: `msg-${msg.id}`,
            type: 'message',
            action: `채팅 메시지`,
            projectId: project.id,
            projectTitle: project.title,
            timestamp: msgTimestamp,
            icon: '💭',
            user: msgUser,
          });
        }
      });
    });

    // 시간순 정렬 및 최근 8개만
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);
  }, []);

  return (
    <main className="flex-1 max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-light-text-primary">BackStage</h1>
        <p className="text-light-text-secondary text-sm mt-1">음악 제작 공간</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-light-surface rounded-xl border border-light-border p-4 text-center">
          <p className="text-2xl font-bold text-brand-pink">{stats.total}</p>
          <p className="text-xs text-light-text-secondary">전체 프로젝트</p>
        </div>
        <div className="bg-light-surface rounded-xl border border-light-border p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{stats.inProgress}</p>
          <p className="text-xs text-light-text-secondary">진행 중</p>
        </div>
        <div className="bg-light-surface rounded-xl border border-light-border p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
          <p className="text-xs text-light-text-secondary">완료</p>
        </div>
      </div>

      {/* 빠른 액세스 */}
      <section>
        <h2 className="font-bold text-lg mb-3">빠른 액세스</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAccessCard
            icon={<LayoutDashboardIcon className="w-6 h-6" />}
            label="대시보드"
            description="전체 현황 보기"
            onClick={() => onNavigate('dashboard')}
            gradient="bg-gradient-to-br from-brand-pink to-brand-purple"
          />
          <QuickAccessCard
            icon={<FolderKanbanIcon className="w-6 h-6" />}
            label="프로젝트"
            description="프로젝트 관리"
            onClick={() => onNavigate('projects')}
            gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
          />
          <QuickAccessCard
            icon={<UsersIcon className="w-6 h-6" />}
            label="팀"
            description="협업 멤버 관리"
            onClick={() => onNavigate('teams')}
            gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
          <QuickAccessCard
            icon={<HandshakeIcon className="w-6 h-6" />}
            label="콜랩"
            description="협업 프로젝트"
            onClick={() => onNavigate('openProjects')}
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
          />
        </div>
      </section>

      {/* 최근 프로젝트 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">최근 프로젝트</h2>
          <button
            onClick={() => onNavigate('projects')}
            className="text-sm text-brand-pink font-medium hover:underline"
          >
            전체 보기
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recentProjects.map(project => (
            <MiniProjectCard
              key={project.id}
              project={project}
              onClick={() => onNavigateToStudioProject?.(project.id)}
            />
          ))}
        </div>
      </section>

      {/* 최근 활동 */}
      <section>
        <h2 className="font-bold text-lg mb-3">최근 활동</h2>
        <div className="bg-light-surface rounded-xl border border-light-border divide-y divide-light-border">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => onNavigateToStudioProject?.(activity.projectId)}
                className="w-full flex items-center p-3 hover:bg-light-bg/50 transition-colors text-left"
              >
                {activity.user ? (
                  <LazyImage
                    src={activity.user.avatarUrl}
                    alt={activity.user.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                ) : (
                  <span className="text-xl mr-3">{activity.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">
                    {activity.user && (
                      <span className="font-medium">{activity.user.name}</span>
                    )}
                    <span className={activity.user ? 'text-light-text-secondary' : 'font-medium'}>
                      {activity.user ? ' · ' : ''}{activity.action}
                    </span>
                  </p>
                  <p className="text-xs text-light-text-secondary truncate">
                    {activity.projectTitle}
                  </p>
                </div>
                <span className="text-xs text-light-text-secondary whitespace-nowrap ml-2">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-light-text-secondary">
              아직 활동이 없습니다.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default BackstagePage;
