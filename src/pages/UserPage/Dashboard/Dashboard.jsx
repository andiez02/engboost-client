import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from '@mui/material';
import Sidebar from '../../../components/Layout/SideBar';
import { selectCurrentUser } from '../../../redux/user/userSlice';
import { fetchStats } from '../../../redux/study/studySlice';
import { fetchFolders } from '../../../redux/folder/folderSlice';
import HeaderUser from '../../../components/Layout/HeaderUser';
import DashboardHero from './DashboardHero';
import FolderGrid from './FolderGrid';
import StatsPanel from './StatsPanel';
import SuggestionCard from './SuggestionCard';
import '../../UserPage/Leaderboard/leaderboard.css';
import './dashboard.css';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });

  const handleSidebarToggle = (val) => {
    setIsSidebarOpen(val);
    localStorage.setItem('sidebarOpen', String(val));
  };

  const dispatch      = useDispatch();
  const currentUser   = useSelector(selectCurrentUser);
  const stats         = useSelector(s => s.study.stats);
  const nextReviewAt  = useSelector(s => s.study.nextReviewAt);
  const isLoading     = useSelector(s => s.study.isLoading);
  const error         = useSelector(s => s.study.error);
  const folders       = useSelector(s => s.folders.folders);
  const foldersLoading = useSelector(s => s.folders.isLoading);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchFolders());
  }, [dispatch]);

  useEffect(() => {
    const id = setInterval(() => dispatch(fetchStats()), 60_000);
    return () => clearInterval(id);
  }, [dispatch]);

  const due           = stats?.due ?? 0;
  const overdueCount  = stats?.overdueCount ?? 0;
  const dueTodayCount = stats?.dueTodayCount ?? 0;
  const reviewedToday = stats?.reviewedToday ?? 0;
  const streak        = stats?.streak ?? 0;
  const dailyGoal     = stats?.dailyGoal ?? 20;
  const xp            = stats?.xp ?? 0;
  const level         = stats?.level ?? 1;
  const xpForCurrentLevel = stats?.xpForCurrentLevel ?? 0;
  const xpForNextLevel    = stats?.xpForNextLevel ?? 100;
  const challenges    = stats?.challenges ?? [];
  const userName      = currentUser?.user?.username;

  return (
    <div className="flex min-h-screen lb-root" style={{ background: '#F7F8FA' }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarToggle} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-58' : 'ml-20'} p-6 lg:p-8`}>
        <HeaderUser isSidebarOpen={isSidebarOpen} setIsSidebarOpen={handleSidebarToggle} />

        <div style={{ marginTop: 72, paddingBottom: 48 }}>
          <div className="db-layout">

            {/* ── LEFT: main content ── */}
            <div className="db-main">
              <DashboardHero
                userName={userName}
                due={due}
                nextReviewAt={nextReviewAt}
                isLoading={isLoading}
                error={error}
                onRetry={() => dispatch(fetchStats())}
              />

              <div style={{ marginTop: 20 }}>
                <FolderGrid folders={folders} isLoading={foldersLoading} />
              </div>
            </div>

            {/* ── RIGHT: sticky stats ── */}
            <div className="db-sidebar">
              {isLoading && !stats ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Skeleton variant="rounded" height={200} sx={{ borderRadius: '20px' }} />
                  <Skeleton variant="rounded" height={120} sx={{ borderRadius: '16px' }} />
                </div>
              ) : (
                <>
                  <StatsPanel
                    streak={streak}
                    reviewedToday={reviewedToday}
                    dailyGoal={dailyGoal}
                    xp={xp}
                    level={level}
                    xpForCurrentLevel={xpForCurrentLevel}
                    xpForNextLevel={xpForNextLevel}
                    due={due}
                    nextReviewAt={nextReviewAt}
                    challenges={challenges}
                  />
                  <div style={{ marginTop: 14 }}>
                    <SuggestionCard
                      due={due}
                      reviewedToday={reviewedToday}
                      nextReviewAt={nextReviewAt}
                    />
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
