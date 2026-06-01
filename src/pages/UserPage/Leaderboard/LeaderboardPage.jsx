import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from '@mui/material';
import Sidebar from '../../../components/Layout/SideBar';
import HeaderUser from '../../../components/Layout/HeaderUser';
import WeeklyResetBanner from './WeeklyResetBanner';
import PodiumSection from './PodiumSection';
import ListSection from './ListSection';
import NeighborhoodSection from './NeighborhoodSection';
import UserRankCard from './UserRankCard';
import { fetchLeaderboard, fetchLevelLeaderboard, fetchStreakLeaderboard } from '../../../redux/leaderboard/leaderboardSlice';
import './leaderboard.css';

const TABS = [
  { key: 'weekly', label: '⚡ Tuần này' },
  { key: 'level',  label: '🎖️ Cấp độ'  },
  { key: 'streak', label: '🔥 Streak'   },
];

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={68} sx={{ borderRadius: '18px' }} />
      ))}
    </div>
  );
}

function ErrorBanner({ error, onRetry }) {
  const message = typeof error === 'string' ? error : 'Không thể tải bảng xếp hạng.';
  return (
    <div style={{
      background: '#FFF0F0', color: '#D32F2F',
      padding: 24, borderRadius: 20, textAlign: 'center',
      border: '2px solid #FFCDD2', borderBottom: '5px solid #FFCDD2',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
    }}>
      <span style={{ fontSize: '2.5rem' }}>😵</span>
      <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{message}</span>
      <button className="lb-retry-btn" onClick={onRetry}>Thử lại</button>
    </div>
  );
}

export default function LeaderboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });
  const [activeTab, setActiveTab] = useState('weekly');

  const handleSidebarToggle = (val) => {
    setIsSidebarOpen(val);
    localStorage.setItem('sidebarOpen', String(val));
  };

  const dispatch = useDispatch();
  const {
    top50, neighbors, currentUser, weekStartedAt, isLoading, error,
    levelTop50, levelNeighbors, levelCurrentUser, isLoadingLevel, errorLevel,
    streakTop50, streakNeighbors, streakCurrentUser, isLoadingStreak, errorStreak,
  } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
    dispatch(fetchLevelLeaderboard());
    dispatch(fetchStreakLeaderboard());
  }, [dispatch]);

  const isWeekly   = activeTab === 'weekly';
  const isStreak   = activeTab === 'streak';
  const list       = isWeekly ? top50        : isStreak ? streakTop50       : levelTop50;
  const neighbors_ = isWeekly ? neighbors    : isStreak ? streakNeighbors   : levelNeighbors;
  const me         = isWeekly ? currentUser  : isStreak ? streakCurrentUser : levelCurrentUser;
  const loading    = isWeekly ? isLoading    : isStreak ? isLoadingStreak   : isLoadingLevel;
  const err        = isWeekly ? error        : isStreak ? errorStreak       : errorLevel;
  const mode       = isWeekly ? 'weekly'     : isStreak ? 'streak'          : 'level';

  const tabSwitcher = (
    <div style={{
      display: 'flex', gap: 6,
      background: '#EFEFEF', borderRadius: 18, padding: 5,
    }}>
      {TABS.map((tab) => (
        <div
          key={tab.key}
          className={`lb-tab-btn${activeTab === tab.key ? ' active' : ''}`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen lb-root" style={{ background: '#F7F8FA' }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarToggle} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-58' : 'ml-20'} p-6 lg:p-8`}>
        <HeaderUser isSidebarOpen={isSidebarOpen} setIsSidebarOpen={handleSidebarToggle} />

        <div style={{ marginTop: 72, paddingBottom: 48 }}>

          {/* ── Desktop 2-col / Mobile 1-col ── */}
          <div className="lb-layout">

            {/* ── LEFT PANEL ── */}
            <div className="lb-left-panel">

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                  background: 'linear-gradient(135deg, #FFE566 0%, #FF9600 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.7rem', boxShadow: '0 4px 16px rgba(255,150,0,0.28)',
                }}>
                  🏆
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#3D3D3D', lineHeight: 1.15 }}>
                    Bảng xếp hạng
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <span className="lb-title-badge">
                      {isWeekly ? '⚡ Tuần này' : isStreak ? '🔥 Streak' : '🎖️ Cấp độ'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ marginBottom: 20 }}>{tabSwitcher}</div>

              {/* Weekly reset banner */}
              {isWeekly && <WeeklyResetBanner weekStartedAt={weekStartedAt} />}

              {/* Podium */}
              {!loading && !err && list.length >= 3 && (
                <div style={{
                  background: '#fff',
                  borderRadius: 24,
                  padding: '20px 12px 0',
                  border: '2px solid #F0F0F0',
                  borderBottom: '4px solid #E8E8E8',
                  marginBottom: 16,
                }}>
                  <PodiumSection list={list} me={me} mode={mode} />
                </div>
              )}

              {/* My rank card */}
              {!loading && !err && me && (
                <UserRankCard currentUser={me} mode={mode} />
              )}

              {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Skeleton variant="rounded" height={200} sx={{ borderRadius: '24px' }} />
                  <Skeleton variant="rounded" height={90}  sx={{ borderRadius: '16px' }} />
                </div>
              )}
            </div>

            {/* ── RIGHT PANEL ── */}            <div className="lb-right-panel">

              {/* Section label */}
              {!loading && !err && list.length > 3 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
                }}>
                  <span style={{ fontWeight: 900, fontSize: '0.85rem', color: '#AFAFAF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Xếp hạng
                  </span>
                  <div style={{ flex: 1, height: 2, background: '#EFEFEF', borderRadius: 2 }} />
                  <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#AFAFAF' }}>
                    Top {list.length}
                  </span>
                </div>
              )}

              {loading ? (
                <LoadingSkeleton />
              ) : err ? (
                <ErrorBanner
                  error={err}
                  onRetry={() => dispatch(isWeekly ? fetchLeaderboard() : isStreak ? fetchStreakLeaderboard() : fetchLevelLeaderboard())}
                />
              ) : (
                <>
                  <ListSection list={list} me={me} mode={mode} />
                  <NeighborhoodSection neighbors={neighbors_} me={me} mode={mode} />
                  {list.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#AFAFAF', fontWeight: 700, marginTop: 60 }}>
                      <div style={{ fontSize: '3rem', marginBottom: 10 }}>🌱</div>
                      Chưa có dữ liệu.
                    </div>
                  )}
                </>
              )}
            </div>

          </div>{/* end lb-layout */}
        </div>

        {/* Pinned rank card — mobile only, when user outside top list */}
        {me && !loading && !err && me.rank > list.length && (
          <div className="lb-mobile-pinned">
            <UserRankCard currentUser={me} mode={mode} />
          </div>
        )}
      </div>
    </div>
  );
}
