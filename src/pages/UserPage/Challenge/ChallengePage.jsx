import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Skeleton } from '@mui/material';
import Sidebar from '../../../components/Layout/SideBar';
import HeaderUser from '../../../components/Layout/HeaderUser';
import HeroDashboard from './HeroDashboard';
import MainChallengeCard from './MainChallengeCard';
import SideChallengeCard from './SideChallengeCard';
import EmptyState from './EmptyState';
import DailySummaryCard from './DailySummaryCard';
import BadgeSection from './BadgeSection';
import BadgeUnlockPopup from './BadgeUnlockPopup';
import { useAchievementUnlockDetector } from './useBadgeUnlockDetector';
import { fetchStats } from '../../../redux/study/studySlice';
import { fetchAchievements } from '../../../redux/achievement/achievementSlice';
import { getMainChallenge } from './utils';
import { tokens } from '../../../theme';

export default function DailyMissionsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });

  const handleSidebarToggle = (val) => {
    setIsSidebarOpen(val);
    localStorage.setItem('sidebarOpen', String(val));
  };

  const dispatch = useDispatch();

  const stats = useSelector((state) => state.study.stats);
  const isLoadingStats = useSelector((state) => state.study.isLoading);
  const error = useSelector((state) => state.study.error);
  const { challenges } = useSelector((state) => state.challenges);
  
  // Achievements from Real Redux API Slice
  const { achievements, isLoading: isLoadingAchievements } = useSelector((state) => state.achievements);

  // 1. Initial page load & sync data
  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchAchievements());
  }, [dispatch]);

  // ── Derived data ──
  const streak = stats?.streak ?? 0;
  const reviewedToday = stats?.reviewedToday ?? 0;
  const dailyGoal = stats?.dailyGoal ?? 20;
  const xp = stats?.xp ?? 0;
  const level = stats?.level ?? 1;
  const xpForCurrentLevel = stats?.xpForCurrentLevel ?? 0;
  const xpForNextLevel = stats?.xpForNextLevel ?? 100;

  const { main, side } = useMemo(() => getMainChallenge(challenges), [challenges]);

  // ── Frontend Gamification Detection ──
  // Detect Real Achievement Unlocks
  const { currentUnlock, dismissCurrentBadge } = useAchievementUnlockDetector(achievements);

  // Consider page loading if either stats or achievements are fetching for the first time
  const isLoading = isLoadingStats && !stats;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarToggle} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-58' : 'ml-20'
        } p-6 lg:p-8`}
      >
        <HeaderUser isSidebarOpen={isSidebarOpen} setIsSidebarOpen={handleSidebarToggle} />

        <div className="min-h-screen mt-[60px] pb-10 flex justify-center">
          <Box sx={{ width: '100%', maxWidth: 800, mt: 4 }}>

            {/* ── Page Title ── */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography
                fontSize="2.5rem"
                sx={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              >
                💎
              </Typography>
              <Box>
                <Typography fontWeight={900} fontSize="1.75rem" color={tokens.color.text}>
                  Daily Missions
                </Typography>
                <Typography fontSize="0.8rem" fontWeight={500} color={tokens.color.textSub}>
                  Hoàn thành thử thách để nhận thưởng XP
                </Typography>
              </Box>
            </Box>

            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <ErrorBanner error={error} />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* ── Section 1: Hero Dashboard ── */}
                <HeroDashboard
                  streak={streak}
                  reviewedToday={reviewedToday}
                  dailyGoal={dailyGoal}
                  xp={xp}
                  level={level}
                  xpForCurrentLevel={xpForCurrentLevel}
                  xpForNextLevel={xpForNextLevel}
                />

                {/* ── Section 2: Main Challenge ── */}
                {main && (
                  <Box>
                    <SectionLabel icon="🎯" text="Thử thách tiếp theo" />
                    <MainChallengeCard challenge={main} />
                  </Box>
                )}

                {/* ── Section 3: Side Challenges ── */}
                {side.length > 0 && (
                  <Box>
                    <SectionLabel icon="🧩" text="Thử thách khác" />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {side.map((challenge) => (
                        <SideChallengeCard key={challenge.id} challenge={challenge} />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* ── Section 4: Empty State ── */}
                {challenges.length === 0 && <EmptyState />}

                {/* ── Section 5: Daily Summary ── */}
                {challenges.length > 0 && (
                  <DailySummaryCard
                    reviewedToday={reviewedToday}
                    streak={streak}
                    challenges={challenges}
                  />
                )}

                {/* ── Section 6: Badge System ── */}
                <BadgeSection achievements={achievements} />
              </Box>
            )}
          </Box>
        </div>
      </div>

      {/* ── Overlay Modals ── */}
      <BadgeUnlockPopup
        open={!!currentUnlock}
        badge={currentUnlock}
        onClose={dismissCurrentBadge}
      />
    </div>
  );
}

/* ── Helpers ── */

function SectionLabel({ icon, text }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <Typography
        sx={{
          fontSize: '0.7rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: tokens.color.textSub,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

function LoadingSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Hero skeleton */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        <Skeleton variant="rounded" height={120} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rounded" height={120} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rounded" height={120} sx={{ borderRadius: 4 }} />
      </Box>
      {/* Main challenge skeleton */}
      <Skeleton variant="rounded" height={220} sx={{ borderRadius: 5 }} />
      {/* Side challenges skeleton */}
      <Skeleton variant="rounded" height={70} sx={{ borderRadius: 3.5 }} />
      <Skeleton variant="rounded" height={70} sx={{ borderRadius: 3.5 }} />
    </Box>
  );
}

function ErrorBanner({ error }) {
  return (
    <Box
      sx={{
        bgcolor: tokens.color.errorBg,
        color: tokens.color.error,
        p: 3,
        borderRadius: 4,
        textAlign: 'center',
        fontWeight: 700,
        border: `2px solid ${tokens.color.errorBorder}`,
      }}
    >
      {error}
    </Box>
  );
}
