import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from '@mui/material';
import Sidebar from '../../../components/Layout/SideBar';
import HeaderUser from '../../../components/Layout/HeaderUser';
import ProfilePanel from './ProfilePanel';
import MainChallengeCard from './MainChallengeCard';
import SideChallengeCard from './SideChallengeCard';
import EmptyState from './EmptyState';
import DailySummaryCard from './DailySummaryCard';
import BadgeSection from './BadgeSection';
import BadgeUnlockPopup from './BadgeUnlockPopup';
import { useAchievementUnlockDetector } from './useBadgeUnlockDetector';
import { fetchStats } from '../../../redux/study/studySlice';
import { fetchAchievements } from '../../../redux/achievement/achievementSlice';
import { fetchLeaderboard } from '../../../redux/leaderboard/leaderboardSlice';
import { getMainChallenge } from './utils';
import { tokens } from '../../../theme';
import WeeklyResetBanner from '../Leaderboard/WeeklyResetBanner';
import '../Leaderboard/leaderboard.css';

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
  const stats                                    = useSelector(s => s.study.stats);
  const isLoadingStats                           = useSelector(s => s.study.isLoading);
  const error                                    = useSelector(s => s.study.error);
  const { challenges }                           = useSelector(s => s.challenges);
  const { achievements }                         = useSelector(s => s.achievements);
  const { currentUser: leaderboardUser, weekStartedAt } = useSelector(s => s.leaderboard);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchAchievements());
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const streak           = stats?.streak ?? 0;
  const reviewedToday    = stats?.reviewedToday ?? 0;
  const dailyGoal        = stats?.dailyGoal ?? 20;
  const xp               = stats?.xp ?? 0;
  const level            = stats?.level ?? 1;
  const xpForCurrentLevel = stats?.xpForCurrentLevel ?? 0;
  const xpForNextLevel   = stats?.xpForNextLevel ?? 100;

  const { main, side }                       = useMemo(() => getMainChallenge(challenges), [challenges]);
  const { currentUnlock, dismissCurrentBadge } = useAchievementUnlockDetector(achievements);
  const isLoading = isLoadingStats && !stats;

  return (
    <div className="flex min-h-screen lb-root" style={{ background: '#F7F8FA' }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarToggle} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-58' : 'ml-20'} p-6 lg:p-8`}>
        <HeaderUser isSidebarOpen={isSidebarOpen} setIsSidebarOpen={handleSidebarToggle} />

        <div style={{ marginTop: 72, paddingBottom: 48 }}>
          <div className="ch-layout">

            {/* ── LEFT: Profile Panel ── */}
            <div className="lb-left-panel">

              {/* Page header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', boxShadow: '0 4px 0 #5B21B6',
                }}>
                  💎
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.4rem', color: '#1E1B4B', lineHeight: 1.1 }}>
                    Daily Missions
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#AFAFAF', marginTop: 2 }}>
                    Hoàn thành để nhận XP
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Skeleton variant="rounded" height={220} sx={{ borderRadius: '20px' }} />
                </div>
              ) : !error && (
                <ProfilePanel
                  streak={streak}
                  reviewedToday={reviewedToday}
                  dailyGoal={dailyGoal}
                  xp={xp}
                  level={level}
                  xpForCurrentLevel={xpForCurrentLevel}
                  xpForNextLevel={xpForNextLevel}
                  leaderboardUser={leaderboardUser}
                />
              )}
            </div>

            {/* ── RIGHT: Mission content ── */}
            <div className="lb-right-panel">

              <WeeklyResetBanner weekStartedAt={weekStartedAt} />

              {isLoading ? (
                <LoadingSkeleton />
              ) : error ? (
                <ErrorBanner error={error} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* 1. HERO MISSION */}
                  {main ? (
                    <MainChallengeCard challenge={main} />
                  ) : (
                    challenges.length === 0 && <EmptyState />
                  )}

                  {/* 2. SECONDARY CHALLENGES */}
                  {side.length > 0 && (
                    <div>
                      <SectionLabel text="Thử thách khác" />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {side.map((c, i) => (
                          <SideChallengeCard key={c.id ?? i} challenge={c} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. DAILY SUMMARY — compact strip */}
                  {challenges.length > 0 && (
                    <DailySummaryCard
                      reviewedToday={reviewedToday}
                      streak={streak}
                      challenges={challenges}
                    />
                  )}

                  {/* 4. BADGES — bottom, separated */}
                  {achievements.length > 0 && (
                    <div>
                      <SectionLabel text="Huy hiệu" />
                      <BadgeSection achievements={achievements} />
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <BadgeUnlockPopup
        open={!!currentUnlock}
        badge={currentUnlock}
        onClose={dismissCurrentBadge}
      />
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
    }}>
      <span style={{
        fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: '#AFAFAF',
      }}>
        {text}
      </span>
      <div style={{ flex: 1, height: 1, background: '#EBEBEB' }} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Skeleton variant="rounded" height={320} sx={{ borderRadius: '24px' }} />
      <Skeleton variant="rounded" height={60}  sx={{ borderRadius: '14px' }} />
      <Skeleton variant="rounded" height={60}  sx={{ borderRadius: '14px' }} />
    </div>
  );
}

function ErrorBanner({ error }) {
  const message = typeof error === 'string' ? error : error?.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.';
  return (
    <div style={{
      background: '#FEF2F2', color: tokens.color.error,
      padding: 24, borderRadius: 16, textAlign: 'center', fontWeight: 700,
      border: '2px solid #FECACA', borderBottom: '4px solid #FCA5A5',
    }}>
      {message}
    </div>
  );
}
