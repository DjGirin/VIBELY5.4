/**
 * 초를 mm:ss 형식으로 변환
 */
export const formatDuration = (seconds?: number): string => {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 날짜를 한국어 형식으로 변환
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};

/**
 * 날짜와 시간을 한국어 형식으로 변환
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ko-KR');
};

/**
 * 상대적 시간 표시 (예: "3시간 전")
 */
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return formatDate(dateString);
};

/**
 * 숫자를 K, M 형식으로 변환 (예: 1200 -> 1.2K)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

/**
 * 파일 크기를 KB, MB 형식으로 변환
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes >= 1073741824) {
    return (bytes / 1073741824).toFixed(1) + ' GB';
  }
  if (bytes >= 1048576) {
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
  if (bytes >= 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  }
  return bytes + ' B';
};
