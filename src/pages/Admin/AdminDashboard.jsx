import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { Users, BookMarked, FolderOpen, UsersRound, ArrowRight, RefreshCw, LayoutDashboard } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { getListUsersAPI, getUserAnalyticsAPI } from '../../apis';
import { adminFolderService } from '../../services/adminFolder/adminFolder.service';
import { routes } from '../../utils/constants';

const CARDS = [
  {
    title: 'Người dùng',
    desc: 'Tổng tài khoản đã đăng ký',
    stat: 'totalUsers',
    route: 'ADMIN_USER_MANAGEMENT',
    icon: Users,
    accent: '#6366F1',
    accentBg: '#EEF2FF',
  },
  {
    title: 'Flashcards',
    desc: 'Tổng thẻ trong hệ thống',
    stat: 'totalFlashcards',
    route: 'ADMIN_FLASHCARD_MANAGEMENT',
    icon: BookMarked,
    accent: '#0EA5E9',
    accentBg: '#F0F9FF',
  },
  {
    title: 'Explore Folders',
    desc: 'Folder học theo cấp độ',
    stat: 'totalExploreFolders',
    route: 'ADMIN_EXPLORE_FOLDERS',
    icon: FolderOpen,
    accent: '#10B981',
    accentBg: '#ECFDF5',
  },
  {
    title: 'Community Folders',
    desc: 'Folder miễn phí cho tất cả',
    stat: 'totalCommunityFolders',
    route: 'ADMIN_COMMUNITY_FOLDERS',
    icon: UsersRound,
    accent: '#F59E0B',
    accentBg: '#FFFBEB',
  },
];

const ROLE_COLORS = ['#6366F1', '#06B6D4'];
const LEVEL_COLOR = '#10B981';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState(30);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFlashcards: 0,
    totalExploreFolders: 0,
    totalCommunityFolders: 0,
  });
  const [analytics, setAnalytics] = useState({
    roleBreakdown: [],
    levelDistribution: [],
    growth: [],
    inactiveBuckets: [],
    topXpUsers: [],
    topStreakUsers: [],
    overview: {
      overallActivationRate: 0,
      totalNewUsers: 0,
      totalNewActiveUsers: 0,
    },
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, flashcardsRes, exploreRes, communityRes, analyticsRes] = await Promise.all([
        getListUsersAPI(1, 1),
        adminFolderService.listAllFlashcards({ page: 1, limit: 1 }),
        adminFolderService.listPublicFolders(),
        adminFolderService.listCommunityFolders(),
        getUserAnalyticsAPI(range),
      ]);
      setStats({
        totalUsers: usersRes.pagination?.total ?? 0,
        totalFlashcards: flashcardsRes.pagination?.total ?? 0,
        totalExploreFolders: (exploreRes.data ?? []).length,
        totalCommunityFolders: (communityRes.data ?? []).length,
      });
      setAnalytics({
        roleBreakdown: analyticsRes.roleBreakdown ?? [],
        levelDistribution: analyticsRes.levelDistribution ?? [],
        growth: analyticsRes.growth ?? [],
        inactiveBuckets: analyticsRes.inactiveBuckets ?? [],
        topXpUsers: analyticsRes.topXpUsers ?? [],
        topStreakUsers: analyticsRes.topStreakUsers ?? [],
        overview: analyticsRes.overview ?? {
          overallActivationRate: 0,
          totalNewUsers: 0,
          totalNewActiveUsers: 0,
        },
      });
    } catch {
      setError('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleInactiveBucketDrillDown = (entry) => {
    const rawDays = parseInt(String(entry?.label || '').replace(/\D/g, ''), 10);
    if (!rawDays) return;
    navigate(`${routes.ADMIN_USER_MANAGEMENT}?inactiveDays=${rawDays}`);
  };

  const handleTopUserDrillDown = (metric, entry) => {
    const username = entry?.username;
    if (!username) return;
    const query = new URLSearchParams({
      sortBy: metric,
      sortOrder: 'desc',
      search: username,
    });
    navigate(`${routes.ADMIN_USER_MANAGEMENT}?${query.toString()}`);
  };

  useEffect(() => { fetchStats(); }, [range]);

  return (
    <div style={{ padding: '32px', background: '#F8F9FA', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={18} color="#6366F1" />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
              Admin Dashboard
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>
            Tổng quan hệ thống EngBoost
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
            border: '1.5px solid #E5E7EB', background: '#fff',
            fontSize: '0.8rem', fontWeight: 700, color: '#374151',
            fontFamily: 'inherit', transition: 'all 0.15s', opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.borderColor = '#6366F1'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Làm mới
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {error && (
        <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 10, background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#DC2626', fontSize: '0.85rem', fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Stat Cards */}
      <p style={{ margin: '0 0 16px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9CA3AF' }}>
        Tổng quan
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {CARDS.map((card) => {
          const Icon = card.icon;
          const value = stats[card.stat];
          return (
            <div
              key={card.title}
              onClick={() => navigate(routes[card.route])}
              style={{
                background: '#fff', borderRadius: 16, padding: '24px',
                border: '1.5px solid #E5E7EB', cursor: 'pointer',
                transition: 'all 0.18s', display: 'flex', flexDirection: 'column', gap: 16,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = card.accent;
                e.currentTarget.style.boxShadow = `0 8px 24px ${card.accent}18`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: card.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={card.accent} />
                </div>
                <ArrowRight size={16} color="#D1D5DB" />
              </div>
              <div>
                {loading ? (
                  <CircularProgress size={24} sx={{ color: card.accent }} />
                ) : (
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111827', lineHeight: 1, letterSpacing: '-0.03em' }}>
                    {value?.toLocaleString() ?? '—'}
                  </div>
                )}
                <div style={{ marginTop: 6, fontSize: '0.88rem', fontWeight: 700, color: '#374151' }}>{card.title}</div>
                <div style={{ marginTop: 2, fontSize: '0.75rem', fontWeight: 500, color: '#9CA3AF' }}>{card.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 28, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9CA3AF' }}>
          Biểu đồ người dùng
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6B7280' }}>Khoảng thời gian</span>
          <select
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            style={{
              height: 34,
              borderRadius: 10,
              border: '1.5px solid #E5E7EB',
              background: '#fff',
              padding: '0 10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#374151',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          >
            <option value={7}>7 ngày</option>
            <option value={30}>30 ngày</option>
            <option value={90}>90 ngày</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', padding: 16 }}>
          <div style={{ marginBottom: 10, fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>Tăng trưởng user mới</div>
          <div style={{ height: 260 }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={24} sx={{ color: '#6366F1' }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.growth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="newUsers" stroke="#6366F1" strokeWidth={2} dot={false} name="User mới" />
                  <Line type="monotone" dataKey="activeUsers" stroke="#10B981" strokeWidth={2} dot={false} name="Đã kích hoạt" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', padding: 16 }}>
          <div style={{ marginBottom: 10, fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>Tỷ lệ vai trò người dùng</div>
          <div style={{ height: 260 }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={24} sx={{ color: '#6366F1' }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.roleBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={82}
                    label
                  >
                    {analytics.roleBreakdown.map((entry, idx) => (
                      <Cell key={`${entry.name}-${idx}`} fill={ROLE_COLORS[idx % ROLE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', padding: 16 }}>
          <div style={{ marginBottom: 10, fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>Phân bố level</div>
          <div style={{ height: 260 }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={24} sx={{ color: '#10B981' }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.levelDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={LEVEL_COLOR} radius={[6, 6, 0, 0]} name="Số lượng user" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', padding: 16 }}>
          <div style={{ marginBottom: 10, fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>Nhóm user không hoạt động</div>
          <div style={{ height: 260 }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={24} sx={{ color: '#F59E0B' }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.inactiveBuckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#F59E0B"
                    radius={[6, 6, 0, 0]}
                    name="Số user"
                    onClick={handleInactiveBucketDrillDown}
                    style={{ cursor: 'pointer' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', padding: 16 }}>
          <div style={{ marginBottom: 10, fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>Top 10 user theo XP</div>
          <div style={{ height: 260 }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={24} sx={{ color: '#8B5CF6' }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topXpUsers} layout="vertical" margin={{ left: 14, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="username" width={90} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="xp"
                    fill="#8B5CF6"
                    radius={[0, 6, 6, 0]}
                    name="XP"
                    onClick={(data) => handleTopUserDrillDown('xp', data)}
                    style={{ cursor: 'pointer' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', padding: 16 }}>
          <div style={{ marginBottom: 10, fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>Top 10 user theo Streak</div>
          <div style={{ height: 260 }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={24} sx={{ color: '#EC4899' }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topStreakUsers} layout="vertical" margin={{ left: 14, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="username" width={90} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="streak"
                    fill="#EC4899"
                    radius={[0, 6, 6, 0]}
                    name="Streak (ngày)"
                    onClick={(data) => handleTopUserDrillDown('streak', data)}
                    style={{ cursor: 'pointer' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', padding: 16 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>
            Activation Conversion
          </div>
          <div style={{ marginTop: 10, fontSize: '2rem', fontWeight: 900, color: '#10B981', lineHeight: 1 }}>
            {Number(analytics.overview?.overallActivationRate || 0).toFixed(2)}%
          </div>
          <div style={{ marginTop: 6, fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>
            {analytics.overview?.totalNewActiveUsers || 0} / {analytics.overview?.totalNewUsers || 0} user mới đã kích hoạt trong {range} ngày.
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', padding: 16 }}>
          <div style={{ marginBottom: 10, fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>Tỷ lệ active theo ngày</div>
          <div style={{ height: 160 }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={22} sx={{ color: '#10B981' }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.growth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Activation rate']} />
                  <Line type="monotone" dataKey="activationRate" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
}
