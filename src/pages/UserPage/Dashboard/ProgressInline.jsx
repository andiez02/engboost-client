import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Skeleton, Typography } from '@mui/material';
import { fetchStats } from '../../../redux/study/studySlice';
import StreakAndGoalCard from './StreakAndGoalCard';

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

export default function ProgressInline({ reviewedToday, nextReviewAt, due, streak = 0, dailyGoal = 20, isLoading }) {
  const dispatch = useDispatch();
  const [timeDisplay, setTimeDisplay] = useState(() => formatLiveCountdown(nextReviewAt));
  
  const [animPhase, setAnimPhase] = useState(2);
  const [leftNum, setLeftNum] = useState(0);
  const [rightNum, setRightNum] = useState(0);
  const prevDueRef = useRef(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isLoading) return;

    if (isFirstRender.current) {
      // First time we get data (after loading), just show the total
      isFirstRender.current = false;
      setAnimPhase(2);
      prevDueRef.current = due;
      return;
    }
    // Subsequent updates
    if (due > prevDueRef.current && prevDueRef.current > 0) {
      // Cards added (e.g. 10 + 2)
      const added = due - prevDueRef.current;
      setLeftNum(prevDueRef.current);
      setRightNum(added);
      setAnimPhase(0);

      const timer = setTimeout(() => setAnimPhase(1), 1000);
      
      prevDueRef.current = due;
      return () => clearTimeout(timer);
    } else if (due < prevDueRef.current) {
      // Cards studied, quietly update total without re-running the animation
      setAnimPhase(2);
      prevDueRef.current = due;
    }
  }, [due, isLoading]);

  useEffect(() => {
    if (!nextReviewAt) {
      setTimeDisplay(null);
      return;
    }

    setTimeDisplay(formatLiveCountdown(nextReviewAt));
    let hasFetched = false;

    const intervalId = setInterval(() => {
      const diff = new Date(nextReviewAt).getTime() - Date.now();
      if (diff <= 0 && !hasFetched) {
        hasFetched = true;
        setTimeDisplay('SẴN SÀNG');
        dispatch(fetchStats());
        clearInterval(intervalId);
      } else if (diff > 0) {
        setTimeDisplay(formatLiveCountdown(nextReviewAt));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [nextReviewAt, dispatch]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Skeleton variant="rounded" height={120} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rounded" height={100} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rounded" height={100} sx={{ borderRadius: 4 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* 1. Lửa Học Tập (Streak & Goal) */}
      <StreakAndGoalCard streak={streak} reviewedToday={reviewedToday} dailyGoal={dailyGoal} />

      {/* 2. Đếm ngược thời gian (Next Review Countdown) */}
      {due === 0 && nextReviewAt && (
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
      )}

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
        <Box sx={{ zIndex: 1, position: 'relative', minHeight: 64, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {due === 0 ? (
            <Box>
              <Typography fontWeight={900} fontSize="1.8rem" sx={{ lineHeight: 1, color: '#58CC02' }}>
                0
              </Typography>
              <Typography fontWeight={800} fontSize="0.8rem" sx={{ mt: 0.5, opacity: 0.9 }}>
                BẠN ĐÃ HOÀN TẤT!
              </Typography>
            </Box>
          ) : animPhase === 0 ? (
            <Box
              sx={{
                animation: 'slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, mergeOut 0.3s ease-in 0.7s forwards',
                '@keyframes slideInRight': {
                  '0%': { opacity: 0, transform: 'translateX(20px)' },
                  '100%': { opacity: 1, transform: 'translateX(0)' }
                },
                '@keyframes mergeOut': {
                  '0%': { opacity: 1, transform: 'scale(1)' },
                  '100%': { opacity: 0, transform: 'scale(0.5)' }
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                 <Typography fontWeight={900} fontSize="1.8rem" sx={{ lineHeight: 1, color: '#fff' }}>
                    {leftNum}
                 </Typography>
                 <Typography fontWeight={900} fontSize="1.8rem" sx={{ color: '#fff', opacity: 0.6 }}>+</Typography>
                 <Typography fontWeight={900} fontSize="1.8rem" sx={{ lineHeight: 1, color: '#fff' }}>
                    {rightNum}
                 </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                animation: animPhase === 1 ? 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' : 'none',
                '@keyframes popIn': {
                  '0%': { opacity: 0, transform: 'scale(0.5)' },
                  '100%': { opacity: 1, transform: 'scale(1)' }
                }
              }}
            >
              <Typography fontWeight={900} fontSize="1.8rem" sx={{ lineHeight: 1, color: '#fff' }}>
                {due}
              </Typography>
              <Typography fontWeight={800} fontSize="0.8rem" sx={{ mt: 0.5, opacity: 0.9 }}>
                THẺ ĐANG CHỜ BẠN
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

    </Box>
  );
}
