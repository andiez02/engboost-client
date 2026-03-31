import { Box, Typography } from '@mui/material';

export default function StreakAndGoalCard({ streak = 0, reviewedToday = 0, dailyGoal = 20 }) {
  const isGoalReached = reviewedToday >= dailyGoal;
  const progressPercent = Math.min((reviewedToday / dailyGoal) * 100, 100);

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 4,
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        border: '2px solid #E5E5E5',
        borderBottom: '4px solid #E5E5E5',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              fontSize: '1.5rem',
              animation: streak > 0 ? 'pulse 2s infinite ease-in-out' : 'none',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.15)' },
              },
            }}
          >
            🔥
          </Box>
          <Typography fontWeight={900} fontSize="0.9rem" color="#FF9600" sx={{ letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            {streak} ngày liên tiếp
          </Typography>
        </Box>
        <Typography fontWeight={900} fontSize="1rem" color={isGoalReached ? '#FF9600' : '#AFAFAF'}>
          {reviewedToday} / {dailyGoal} thẻ
        </Typography>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ width: '100%', height: 16, bgcolor: '#F0F0F0', borderRadius: 6, overflow: 'hidden' }}>
        <Box
          sx={{
            width: `${progressPercent}%`,
            height: '100%',
            bgcolor: isGoalReached ? '#58CC02' : '#FF9600',
            borderRadius: 6,
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'shimmer 2s infinite',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' },
            }
          }}
        />
      </Box>

      {/* Goal Status Message */}
      {isGoalReached ? (
        <Box
          sx={{
            bgcolor: 'rgba(88, 204, 2, 0.1)',
            color: '#46A302',
            p: 1.5,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            animation: 'slideUp 0.5s ease-out forwards',
            '@keyframes slideUp': {
              '0%': { transform: 'translateY(10px)', opacity: 0 },
              '100%': { transform: 'translateY(0)', opacity: 1 },
            }
          }}
        >
          <Box sx={{ fontSize: '1.5rem' }}>🎉</Box>
          <Box>
            <Typography fontWeight={900} fontSize="0.85rem">
              Bạn đã hoàn thành chỉ tiêu ngày!
            </Typography>
            <Typography fontWeight={700} fontSize="0.75rem" sx={{ mt: 0.2 }}>
              Tiếp tục ôn tập hoặc quay lại vào ngày mai nhé.
            </Typography>
          </Box>
        </Box>
      ) : (
        <Typography fontWeight={700} fontSize="0.8rem" color="#AFAFAF" sx={{ textAlign: 'center' }}>
          Cố lên! Còn {dailyGoal - reviewedToday} thẻ để đạt mục tiêu.
        </Typography>
      )}
    </Box>
  );
}
