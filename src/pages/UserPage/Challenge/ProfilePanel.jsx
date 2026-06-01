import { motion } from 'framer-motion';
import { tokens } from '../../../theme';

export default function ProfilePanel({
  streak = 0,
  reviewedToday = 0,
  dailyGoal = 20,
  xp = 0,
  level = 1,
  xpForCurrentLevel = 0,
  xpForNextLevel = 100,
  leaderboardUser = null,
}) {
  const xpRange      = xpForNextLevel - xpForCurrentLevel;
  const xpProgress   = xpRange > 0 ? Math.min(((xp - xpForCurrentLevel) / xpRange) * 100, 100) : 0;
  const goalPercent  = dailyGoal > 0 ? Math.min((reviewedToday / dailyGoal) * 100, 100) : 0;
  const goalComplete = reviewedToday >= dailyGoal;
  const isNearLvUp   = xpProgress >= 90;
  const hasRank      = leaderboardUser && leaderboardUser.weeklyXp > 0;

  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: '2px solid #F0F0F0', borderBottom: '4px solid #E0E0E0',
      overflow: 'hidden',
    }}>
      {/* Top gradient strip */}
      <div style={{
        height: 4,
      }} />

      <div style={{ padding: '18px 18px 16px' }}>

        {/* Level row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${tokens.color.primary}, ${tokens.color.accentVia})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 0 ${tokens.color.primaryDark}`,
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>{level}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#3D3D3D' }}>
                Level {level}
                {isNearLvUp && <span style={{ marginLeft: 6, fontSize: '0.7rem', color: tokens.color.primary }}>Sắp lên! 🔥</span>}
              </span>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: tokens.color.xp }}>
                ⚡ {xp.toLocaleString()}
              </span>
            </div>
            <div style={{ height: 10, background: '#F0F0F0', borderRadius: 5, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  height: '100%', borderRadius: 5,
                  background: `linear-gradient(90deg, ${tokens.color.primary}, ${tokens.color.accentVia})`,
                }}
              />
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#AFAFAF', marginTop: 4, textAlign: 'right' }}>
              {xpRange.toLocaleString()} XP → Lv.{level + 1}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#F5F5F5', margin: '0 -18px 14px' }} />

        {/* Stats row: goal + streak */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {/* Daily goal */}
          <div style={{
            background: goalComplete ? '#F0FDF4' : '#FAFAFA',
            borderRadius: 14, padding: '10px 12px',
            border: `1.5px solid ${goalComplete ? '#86EFAC' : '#F0F0F0'}`,
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#AFAFAF', marginBottom: 6 }}>
              🎯 Mục tiêu
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 6 }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: goalComplete ? tokens.color.success : '#3D3D3D', lineHeight: 1 }}>
                {reviewedToday}
              </span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#AFAFAF' }}>/{dailyGoal}</span>
            </div>
            <div style={{ height: 6, background: '#EBEBEB', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goalPercent}%` }}
                style={{
                  height: '100%', borderRadius: 3,
                  background: goalComplete ? tokens.color.success : tokens.color.primary,
                }}
              />
            </div>
          </div>

          {/* Streak */}
          <div style={{
            background: streak > 0 ? '#FFF8EE' : '#FAFAFA',
            borderRadius: 14, padding: '10px 12px',
            border: `1.5px solid ${streak > 0 ? '#FFD580' : '#F0F0F0'}`,
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#AFAFAF', marginBottom: 6 }}>
              🔥 Streak
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: tokens.color.streak, lineHeight: 1, marginBottom: 6 }}>
              {streak}
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#AFAFAF' }}>
              {streak > 0 ? 'ngày liên tiếp' : 'Bắt đầu hôm nay!'}
            </div>
          </div>
        </div>

        {/* Rank chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: hasRank ? '#EDE7F6' : '#F5F5F5',
          border: `1.5px solid ${hasRank ? '#C4B5FD' : '#E0E0E0'}`,
          borderRadius: 12, padding: '8px 12px',
        }}>
          <span style={{ fontSize: '1rem' }}>{hasRank ? '🏆' : '💤'}</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: hasRank ? '#5E35B1' : '#AFAFAF', flex: 1 }}>
            {hasRank ? `Hạng #${leaderboardUser.rank} tuần này` : 'Chưa có điểm tuần này'}
          </span>
          {hasRank && (
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: tokens.color.xp }}>
              ⚡ {leaderboardUser.weeklyXp.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
