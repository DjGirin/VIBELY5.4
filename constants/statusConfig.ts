// 프로젝트 상태 설정
export const projectStatusConfig = {
  planning: {
    label: '기획',
    color: 'bg-blue-500',
    lightBg: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-500'
  },
  recording: {
    label: '녹음',
    color: 'bg-red-500',
    lightBg: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-500'
  },
  mixing: {
    label: '믹싱',
    color: 'bg-yellow-500',
    lightBg: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-500'
  },
  mastering: {
    label: '마스터링',
    color: 'bg-purple-500',
    lightBg: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-500'
  },
  completed: {
    label: '완료',
    color: 'bg-green-500',
    lightBg: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-500'
  },
} as const;

// 피드백 카테고리 설정
export const feedbackCategoryConfig = {
  mixing: { label: '믹싱', color: 'bg-yellow-100 text-yellow-700' },
  arrangement: { label: '편곡', color: 'bg-purple-100 text-purple-700' },
  vocal: { label: '보컬', color: 'bg-pink-100 text-pink-700' },
  mastering: { label: '마스터링', color: 'bg-blue-100 text-blue-700' },
  general: { label: '일반', color: 'bg-gray-100 text-gray-700' },
} as const;

// 피드백 상태 설정
export const feedbackStatusConfig = {
  open: { label: '열림', color: 'bg-red-100 text-red-700' },
  'in-progress': { label: '진행 중', color: 'bg-yellow-100 text-yellow-700' },
  resolved: { label: '해결됨', color: 'bg-green-100 text-green-700' },
} as const;

// 태스크 우선순위 색상
export const taskPriorityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
} as const;

// 역할별 색상
export const roleColors: Record<string, string> = {
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

// 상태별 진행률
export const progressByStatus: Record<string, number> = {
  planning: 10,
  recording: 30,
  mixing: 60,
  mastering: 85,
  completed: 100,
};
