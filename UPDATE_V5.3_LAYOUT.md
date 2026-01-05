# VIBELY 5.3 PC 레이아웃 업데이트 개발 문서

## 1. 디자인 분석 (화면 배치 업데이트 예시.png)

### 1.1 전체 레이아웃 구조

```
┌─────────────────────────────────────────────────────────────────────┐
│ Header: Vibely 로고 | (중앙 스토리) | 검색바 | 알림 | 프로필       │
├──────────┬─────────────────────────────────────────────┬────────────┤
│          │              스토리 아바타들                 │            │
│          │         (원형 프로필 4-5개 가로 나열)        │            │
│          ├─────────────────────────────────────────────┤            │
│ Left     │                                             │   Right    │
│ Sidebar  │         메인 콘텐츠 영역                    │  Sidebar   │
│          │         (9:16 숏폼 피드)                    │  (인터랙션 │
│ - Home   │         세로형 비디오/이미지                │   버튼들)  │
│ - Comm.  │         중앙 정렬                           │            │
│ - Msgs   │                                             │  - 좋아요  │
│ - Music  │                                             │  - 싫어요  │
│ - Room   │                                             │  - 댓글    │
│          │                                             │  - 공유    │
│ ──────── │                                             │  - 리믹스  │
│ - Sett.  │                                             │            │
└──────────┴─────────────────────────────────────────────┴────────────┘
```

### 1.2 레이아웃 상세 분석

#### Header (상단바)
- **왼쪽**: "Vibely" 로고 (핑크색 그라데이션)
- **중앙**: 빈 공간 (스토리 영역이 아래로 이동)
- **오른쪽**: 검색바 + 알림 아이콘 + 프로필 아바타

#### Left Sidebar (왼쪽 사이드바)
- **너비**: 약 200px (현재와 유사)
- **메뉴 항목**:
  1. **Home** (활성 상태 - 핑크/보라 그라데이션 배경)
  2. Community
  3. Messages (알림 뱃지 있음)
  4. Music
  5. Room (새로 추가됨 - BackStage 대체)
  - 구분선
  6. Settings

#### 중앙 콘텐츠 영역
- **스토리 섹션**: 상단에 원형 프로필 아바타들 (4-5개)
- **숏폼 피드**: 9:16 비율의 세로형 콘텐츠
- **프로그레스 바**: 콘텐츠 상단에 핑크색 진행 바

#### Right Sidebar (오른쪽 - 인터랙션 버튼)
- 숏폼 콘텐츠 우측에 세로로 배치된 버튼들
- 아이콘 + 숫자 형태
- 버튼 목록:
  1. 좋아요 (엄지 위)
  2. 싫어요 (엄지 아래)
  3. 댓글
  4. 공유
  5. 리믹스/리포스트

---

## 2. 현재 코드 vs 목표 디자인 비교

### 2.1 Left Sidebar 변경점

| 항목 | 현재 (5.2) | 목표 (5.3) |
|------|-----------|-----------|
| 첫 번째 메뉴 | Stage | **Home** |
| 다섯 번째 메뉴 | BackStage | **Room** |
| 프로필 메뉴 | 있음 | **제거** (헤더로 이동) |
| 아이콘 스타일 | 채워진 아이콘 | 라인 아이콘 (outline) |

### 2.2 스토리 섹션 변경점

| 항목 | 현재 (5.2) | 목표 (5.3) |
|------|-----------|-----------|
| 위치 | ShortFormFeed 내부 상단 | 메인 콘텐츠 영역 상단, 피드 외부 |
| 스타일 | 숏폼 오버레이 | 독립적인 섹션으로 분리 |

### 2.3 Right Sidebar 변경점

| 항목 | 현재 (5.2) | 목표 (5.3) |
|------|-----------|-----------|
| 인터랙션 버튼 위치 | 숏폼 내부 오른쪽 | 숏폼 외부 오른쪽 (별도 컬럼) |
| 버튼 스타일 | 채워진 흰색 | 라인 스타일 (outline) |
| 배경 | 반투명 오버레이 | 투명 (라이트 배경) |

---

## 3. 수정 필요 파일 목록

### 3.1 필수 수정 파일

1. **`components/LeftSidebar.tsx`**
   - Stage → Home 라벨 변경
   - BackStage → Room 라벨 변경
   - 프로필 메뉴 제거
   - 아이콘을 outline 스타일로 변경

2. **`components/StagePage.tsx`**
   - 스토리 섹션을 ShortFormFeed 외부로 분리
   - 레이아웃 구조 변경

3. **`components/ShortFormFeed.tsx`**
   - 인터랙션 버튼을 외부로 분리
   - 스토리 관련 코드 제거
   - 프로그레스 바 스타일 변경

4. **`App.tsx`**
   - Stage 페이지 레이아웃 구조 변경
   - 인터랙션 버튼 영역 추가

5. **`components/icons.tsx`**
   - outline 스타일 아이콘 추가 (HomeOutlineIcon 등)

---

## 4. 구현 계획

### Phase 1: Left Sidebar 수정
```tsx
// LeftSidebar.tsx 수정 내용
const mainNavItems: NavItemType[] = [
  { id: 'stage', label: 'Home', icon: <HomeOutlineIcon /> },      // Stage → Home
  { id: 'community', label: 'Community', icon: <ListOutlineIcon /> },
  { id: 'messages', label: 'Messages', icon: <MessageOutlineIcon />, hasBadge: true },
  { id: 'music', label: 'Music', icon: <MusicOutlineIcon /> },
  { id: 'room', label: 'Room', icon: <UsersOutlineIcon /> },      // BackStage → Room
];

const bottomNavItems: NavItemType[] = [
  { id: 'settings', label: 'Settings', icon: <SettingsOutlineIcon /> },
  // 프로필 제거
];
```

### Phase 2: Stage 레이아웃 변경
```tsx
// StagePage.tsx 새 구조
<div className="flex flex-col">
  {/* 스토리 섹션 - 피드 외부 */}
  <div className="flex justify-center space-x-4 py-4">
    {storyUsers.map(user => <StoryAvatar key={user.id} user={user} />)}
  </div>

  {/* 메인 피드 영역 */}
  <div className="flex justify-center">
    {/* 숏폼 피드 (9:16) */}
    <div className="w-[360px]">
      <ShortFormFeed ... />
    </div>

    {/* 인터랙션 버튼 (외부) */}
    <div className="flex flex-col items-center space-y-4 ml-4">
      <InteractionButton icon={<ThumbsUpOutline />} count="1.2만" />
      <InteractionButton icon={<ThumbsDownOutline />} />
      <InteractionButton icon={<MessageOutline />} count="234" />
      <InteractionButton icon={<ShareOutline />} />
      <InteractionButton icon={<RefreshOutline />} />
    </div>
  </div>
</div>
```

### Phase 3: 인터랙션 버튼 스타일 변경
```tsx
// 새로운 InteractionButton 컴포넌트
const InteractionButton: React.FC<{
  icon: React.ReactNode;
  count?: string;
  onClick?: () => void;
}> = ({ icon, count, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center p-2 hover:bg-light-bg rounded-full transition-colors"
  >
    <div className="w-12 h-12 flex items-center justify-center border-2 border-light-text-secondary rounded-full">
      {icon}
    </div>
    {count && <span className="text-xs text-light-text-secondary mt-1">{count}</span>}
  </button>
);
```

---

## 5. 아이콘 변경 상세

### 5.1 새로 추가할 Outline 아이콘

```tsx
// icons.tsx에 추가할 아이콘들

// Home (집 아이콘 - outline)
export const HomeOutlineIcon = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

// Room (사람들 아이콘 - outline)
export const UsersOutlineIcon = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

// 좋아요 버튼 (엄지 위 - outline, 원형 테두리)
export const ThumbsUpOutlineIcon = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
);
```

---

## 6. 예상 작업 순서

1. `icons.tsx` - Outline 아이콘 추가
2. `LeftSidebar.tsx` - 메뉴 항목 및 라벨 변경
3. `StagePage.tsx` - 레이아웃 구조 변경
4. `ShortFormFeed.tsx` - 인터랙션 버튼 분리
5. `App.tsx` - Stage 페이지 렌더링 구조 수정
6. 스타일 미세 조정

---

## 7. 주의사항

- 모바일 뷰는 현재 상태 유지 (PC 레이아웃만 변경)
- `md:` 브레이크포인트 이상에서만 새 레이아웃 적용
- 기존 기능은 모두 유지 (좋아요, 댓글, 공유 등)
- Room 페이지는 기존 BackStage 기능 유지
