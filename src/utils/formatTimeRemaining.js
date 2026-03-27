/**
 * Formats a future timestamp into a human-readable "time remaining" string.
 * @param {string | Date | null | undefined} nextReviewAt
 * @returns {string | null}
 */
export function formatTimeRemaining(nextReviewAt) {
  if (nextReviewAt == null) return null;

  const now = new Date();
  const target = new Date(nextReviewAt);
  const diffMs = target - now;

  if (isNaN(diffMs)) return null;
  if (diffMs <= 0) return 'ngay bây giờ';

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours   = Math.floor(totalMinutes / 60);
  const totalDays    = Math.floor(totalHours / 24);

  if (totalSeconds < 60) return `${totalSeconds} giây`;
  if (totalMinutes < 60) {
    const s = totalSeconds % 60;
    return `${totalMinutes} phút ${s} giây`;
  }
  if (totalHours < 24) return `${totalHours} giờ`;
  return `${totalDays} ngày`;
}
