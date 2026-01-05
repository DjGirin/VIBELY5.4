// 지연 로딩 컴포넌트들
import React, { Suspense, lazy } from 'react';

// 로딩 컴포넌트
export const PageLoading: React.FC = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
      <p className="text-light-text-secondary">로딩 중...</p>
    </div>
  </div>
);

// 지연 로딩될 무거운 페이지들
export const LazyStagePage = lazy(() => import('./StagePage'));
export const LazyBackstagePage = lazy(() => import('./BackstagePage'));
export const LazyCommunityPage = lazy(() => import('./CommunityPage'));
export const LazyProfilePage = lazy(() => import('./ProfilePage'));
export const LazyMessagesPage = lazy(() => import('./MessagesPage'));
export const LazySettingsPage = lazy(() => import('./SettingsPage'));
export const LazyDashboardPage = lazy(() => import('./DashboardPage'));
export const LazyProjectsPage = lazy(() => import('./ProjectsPage'));
export const LazyTeamsPage = lazy(() => import('./TeamsPage'));
export const LazyStudioProjectDetailPage = lazy(() => import('./StudioProjectDetailPage'));
export const LazyThreadDetailPage = lazy(() => import('./ThreadDetailPage'));
export const LazyProjectDetailPage = lazy(() => import('./ProjectDetailPage'));
export const LazyOpenProjectsPage = lazy(() => import('./OpenProjectsPage'));
export const LazyShortFormFeed = lazy(() => import('./ShortFormFeed'));

// Suspense 래퍼
export const withSuspense = <P extends object>(
  Component: React.ComponentType<P>,
  fallback: React.ReactNode = <PageLoading />
) => {
  return (props: P) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};
