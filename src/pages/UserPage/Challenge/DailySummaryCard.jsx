import { Box, Typography } from '@mui/material';
import { tokens } from '../../../theme';

/**
 * Daily summary card shown below all challenges.
 * Provides a warm end-of-list motivational recap.
 */
export default function DailySummaryCard({
  reviewedToday = 0,
  streak = 0,
  challenges = [],
}) {
  // Estimate total XP earned from completed challenges
  const earnedXp = challenges
    .filter((c) => c.completed)
    .reduce((sum, c) => sum + (c.rewardXp ?? 0), 0);

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalCount = challenges.length;

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '16px',
        border: `2px solid ${tokens.color.border}`,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <span style={{ fontSize: '1.2rem' }}>📊</span>
        <Typography
          sx={{
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: tokens.color.textSub,
          }}
        >
          Tổng kết hôm nay
        </Typography>
      </Box>

      {/* Stats row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 2,
        }}
      >
        <SummaryItem icon="📚" value={reviewedToday} label="Từ đã học" />
        <SummaryItem icon="⚡" value={`+${earnedXp}`} label="XP nhận" accent={tokens.color.xp} />
        <SummaryItem icon="🔥" value={`${streak} ngày`} label="Streak" accent={tokens.color.streak} />
      </Box>

      {/* Friendly message */}
      <Box
        sx={{
          bgcolor: completedCount === totalCount && totalCount > 0
            ? tokens.color.successBg
            : '#F9FAFB',
          borderRadius: '10px',
          py: 1.5,
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: completedCount === totalCount && totalCount > 0
              ? tokens.color.success
              : tokens.color.text,
            lineHeight: 1.5,
          }}
        >
          {getMessage(reviewedToday, earnedXp, completedCount, totalCount)}
        </Typography>
      </Box>
    </Box>
  );
}

function SummaryItem({ icon, value, label, accent }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <span style={{ fontSize: '1.3rem' }}>{icon}</span>
      <Typography
        sx={{
          fontSize: '1.25rem',
          fontWeight: 900,
          color: accent ?? tokens.color.text,
          lineHeight: 1.2,
          mt: 0.5,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.65rem',
          fontWeight: 600,
          color: tokens.color.textSub,
          mt: 0.25,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function getMessage(reviewedToday, earnedXp, completedCount, totalCount) {
  if (totalCount === 0) return 'Hãy bắt đầu học hôm nay! 💪';
  if (completedCount === totalCount) {
    return `🎉 Tuyệt vời! Bạn đã hoàn thành tất cả thử thách và nhận +${earnedXp} XP!`;
  }
  if (reviewedToday > 0) {
    return `Hôm nay bạn đã học ${reviewedToday} từ và nhận +${earnedXp} XP. Tiếp tục nào! 💪`;
  }
  return 'Bắt đầu học để nhận XP và hoàn thành thử thách! 🚀';
}
