import { useEffect, useState } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

function formatLiveCountdown(nextReviewAt) {
  if (!nextReviewAt) return null;
  const now = new Date();
  const target = new Date(nextReviewAt);
  const diff = target - now;

  if (diff <= 0) return 'SẴN SÀNG';

  const s = Math.floor((diff / 1000) % 60);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (d > 0) return `${d} NGÀY ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function ProgressInline({ reviewedToday, nextReviewAt, due, isLoading }) {
  const [timeDisplay, setTimeDisplay] = useState(() => formatLiveCountdown(nextReviewAt));

  useEffect(() => {
    if (!nextReviewAt) {
      setTimeDisplay(null);
      return;
    }

    setTimeDisplay(formatLiveCountdown(nextReviewAt));

    const intervalId = setInterval(() => {
      setTimeDisplay(formatLiveCountdown(nextReviewAt));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [nextReviewAt]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Skeleton variant="rounded" height={120} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rounded" height={100} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rounded" height={100} sx={{ borderRadius: 4 }} />
      </Box>
    );
  }

  // Tiêu chuẩn/Mục tiêu hằng ngày
  const DAILY_GOAL = 50; 
  const progressPercent = Math.min((reviewedToday / DAILY_GOAL) * 100, 100);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* 1. Lửa Học Tập (Daily Progress) */}
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
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                fontSize: '1.5rem',
                animation: reviewedToday > 0 ? 'pulse 2s infinite ease-in-out' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.15)' },
                },
              }}
            >
              🔥
            </Box>
            <Typography fontWeight={900} fontSize="0.9rem" color="#FF9600" sx={{ letterSpacing: '0.02em' }}>
              NHIỆT HUYẾT
            </Typography>
          </Box>
          <Typography fontWeight={900} fontSize="1.1rem" color={reviewedToday >= DAILY_GOAL ? '#FF9600' : '#AFAFAF'}>
            {reviewedToday} / {DAILY_GOAL}
          </Typography>
        </Box>
        <Box sx={{ width: '100%', height: 14, bgcolor: '#F0F0F0', borderRadius: 6, overflow: 'hidden' }}>
          <Box
            sx={{
              width: `${progressPercent}%`,
              height: '100%',
              bgcolor: '#FF9600',
              borderRadius: 6,
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
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
        <Typography fontWeight={700} fontSize="0.75rem" color="#AFAFAF" sx={{ textAlign: 'center' }}>
          {reviewedToday >= DAILY_GOAL 
            ? 'Tuyệt vời! Bạn đã đạt chỉ tiêu ngày.' 
            : `Cố lên! Còn ${DAILY_GOAL - reviewedToday} thẻ để đạt chỉ tiêu.`}
        </Typography>
      </Box>

      {/* 2. Đếm ngược thời gian (Next Review Countdown) */}
      <Box
        sx={{
          bgcolor: timeDisplay === 'SẴN SÀNG' ? '#58CC02' : '#1CB0F6',
          borderRadius: 4,
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: `4px solid ${timeDisplay === 'SẴN SÀNG' ? '#46A302' : '#1899D6'}`,
          color: '#fff',
          transition: 'all 0.3s ease',
        }}
      >
        <Typography fontWeight={800} fontSize="0.8rem" sx={{ opacity: 0.9, letterSpacing: '0.05em' }}>
          {timeDisplay === 'SẴN SÀNG' ? 'ĐÃ ĐẾN GIỜ HỌC' : 'SẴN SÀNG TRONG'}
        </Typography>
        <Box
          sx={{
            bgcolor: 'rgba(0,0,0,0.15)',
            px: 3,
            py: 1.5,
            borderRadius: 3,
            width: '100%',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '1.8rem',
            fontWeight: 900,
            letterSpacing: '0.1em',
            boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.1)',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {timeDisplay || '--:--:--'}
        </Box>
      </Box>

      {/* 3. Thẻ chờ ôn (Due Cards) */}
      <Box
        sx={{
          bgcolor: due > 0 ? '#FF4B4B' : '#fff',
          borderRadius: 4,
          p: { xs: 2.5, md: 3 },
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          border: due === 0 ? '2px solid #E5E5E5' : 'none',
          borderBottom: due === 0 ? '4px solid #E5E5E5' : '4px solid #EA2B2B',
          color: due > 0 ? '#fff' : '#AFAFAF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {due > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: -20, right: -20,
              width: 100, height: 100,
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
            }}
          />
        )}
        <Box sx={{ fontSize: '2.5rem', filter: due > 0 ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none' }}>
          {due > 0 ? '🎯' : '🎉'}
        </Box>
        <Box sx={{ zIndex: 1 }}>
          <Typography fontWeight={900} fontSize="1.8rem" sx={{ lineHeight: 1, color: due > 0 ? '#fff' : '#58CC02' }}>
            {due > 0 ? due : '0'}
          </Typography>
          <Typography fontWeight={800} fontSize="0.8rem" sx={{ mt: 0.5, opacity: 0.9 }}>
            {due > 0 ? 'THẺ ĐANG CHỜ BẠN' : 'BẠN ĐÃ HOÀN TẤT!'}
          </Typography>
        </Box>
      </Box>

    </Box>
  );
}
