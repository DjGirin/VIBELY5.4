# VIBELY 5.2 프로젝트 구조

## 폴더 구조

```
VIBELY5.1-main/
├── components/           # React 컴포넌트
│   ├── common/          # 공통 UI 컴포넌트 (LazyImage, icons 등)
│   ├── layout/          # 레이아웃 컴포넌트 (Header, Sidebar 등)
│   ├── modals/          # 모달 컴포넌트
│   ├── pages/           # 페이지 컴포넌트
│   ├── studio/          # 스튜디오/프로젝트 관련 컴포넌트
│   ├── feed/            # 피드 관련 컴포넌트
│   └── index.ts         # 배럴 내보내기
│
├── constants/           # 상수 정의
│   ├── statusConfig.ts  # 상태 설정 (프로젝트, 피드백, 태스크)
│   └── index.ts
│
├── contexts/            # React Context
│   └── NotificationContext.tsx
│
├── hooks/               # 커스텀 훅
│   ├── useInfiniteScroll.ts
│   ├── useNotifications.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   └── index.ts
│
├── types/               # TypeScript 타입 정의
│   ├── user.ts          # 사용자 관련 타입
│   ├── media.ts         # 미디어 관련 타입
│   ├── studio.ts        # 스튜디오/프로젝트 타입
│   ├── social.ts        # 소셜/커뮤니티 타입
│   ├── portfolio.ts     # 포트폴리오 타입
│   ├── notification.ts  # 알림 타입
│   └── index.ts
│
├── utils/               # 유틸리티 함수
│   ├── formatters.ts    # 포맷팅 함수 (날짜, 시간, 숫자)
│   ├── helpers.ts       # 헬퍼 함수 (cn, debounce 등)
│   └── index.ts
│
├── App.tsx              # 메인 앱 컴포넌트
├── data.ts              # 샘플 데이터
├── types.ts             # 기존 타입 (호환성 유지)
└── index.tsx            # 엔트리 포인트
```

## 주요 모듈

### Components
- **common**: LazyImage, EmptyState, LoadingSkeletons, icons
- **layout**: Header, LeftSidebar, RightSidebar, FooterPlayer, MobileBottomNav
- **modals**: 모든 Modal 컴포넌트들
- **pages**: StagePage, BackstagePage, ProjectsPage 등
- **studio**: StudioProjectDetailPage, ProjectCard, KanbanBoardView 등
- **feed**: Feed, FeedItem, ShortFormFeed, CommentSection 등

### Hooks
- `useInfiniteScroll`: 무한 스크롤
- `useDebounce`: 디바운스
- `useLocalStorage`: localStorage 동기화
- `useMediaQuery`: 반응형 미디어 쿼리

### Utils
- `formatDuration`: 초를 mm:ss 형식으로
- `formatDate`, `formatDateTime`: 날짜 포맷팅
- `formatRelativeTime`: 상대 시간 (예: "3시간 전")
- `cn`: 클래스명 조합
- `debounce`, `throttle`: 함수 최적화
- `generateId`: 유니크 ID 생성

### Constants
- `projectStatusConfig`: 프로젝트 상태 설정
- `feedbackCategoryConfig`: 피드백 카테고리
- `taskPriorityColors`: 태스크 우선순위 색상
- `roleColors`: 역할별 색상

## 사용 예시

```tsx
// 컴포넌트 가져오기
import { LazyImage, Header, UploadModal } from './components';

// 훅 사용
import { useDebounce, useIsMobile } from './hooks';

// 타입 가져오기
import { User, StudioProject, Task } from './types';

// 유틸 함수 사용
import { formatDuration, cn } from './utils';

// 상수 사용
import { projectStatusConfig, taskPriorityColors } from './constants';
```
