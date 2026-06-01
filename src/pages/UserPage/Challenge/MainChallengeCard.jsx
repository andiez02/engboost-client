import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../../theme';
import { routes } from '../../../utils/constants';
import { useCompletionDetector } from './useCompletionDetector';
import FloatingXP from './FloatingXP';

// Hero Mission — the ONE primary action on screen
export default function MainChallengeCard({ challenge }) {
  const navigate = useNavigate();
  const { title, description, progress = 0, target, rewardXp, completed, icon } = challenge;
  const safeProgress = progress ?? 0;
  const percent = target > 0 ? Math.min((safeProgress / target) * 100, 100) : 0;
  const { justCompleted, showReward } = useCompletionDetector(completed, rewardXp);

  return (
    <motion.div
      animate={justCompleted ? { scale: [1, 1.02, 1], transition: { duration: 0.4 } } : { scale: 1 }}
      style={{ position: 'relative' }}
    >
      <FloatingXP show={showReward} xp={rewardXp} />

      <div style={{
        borderRadius: 24, overflow: 'hidden',
        background: completed
          ? '#F0FDF4'
          : `linear-gradient(145deg, #F5F3FF 0%, #EDE9FE 60%, #E0E7FF 100%)`,
        border: `2px solid ${completed ? '#86EFAC' : '#DDD6FE'}`,
        borderBottom: `5px solid ${completed ? '#4ADE80' : '#A78BFA'}`,
        boxShadow: completed ? 'none' : '0 8px 32px rgba(124,58,237,0.12)',
      }}>

        {/* Top accent bar */}
        <div style={{
          height: 6,
        }} />

        <div style={{ padding: '20px 20px 18px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: completed ? '#DCFCE7' : `${tokens.color.primary}18`,
            border: `1.5px solid ${completed ? '#86EFAC' : `${tokens.color.primary}40`}`,
            borderRadius: 999, padding: '3px 10px', marginBottom: 14,
          }}>
            <span style={{ fontSize: '0.72rem' }}>{completed ? '✅' : '🎯'}</span>
            <span style={{
              fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: completed ? tokens.color.success : tokens.color.primary,
            }}>
              {completed ? 'Đã hoàn thành' : 'Daily Mission'}
            </span>
          </div>

          {/* Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, flexShrink: 0,
              background: completed ? '#DCFCE7' : '#fff',
              border: `2px solid ${completed ? '#86EFAC' : '#DDD6FE'}`,
              borderBottom: `3px solid ${completed ? '#4ADE80' : '#C4B5FD'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.7rem',
              boxShadow: completed ? 'none' : '0 3px 10px rgba(124,58,237,0.13)',
            }}>
              {completed ? '✅' : (icon || '🎯')}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '1.15rem', fontWeight: 900, lineHeight: 1.25, marginBottom: 4,
                color: completed ? '#AFAFAF' : '#1E1B4B',
              }}>
                {title}
              </div>
              {description && (
                <div style={{ fontSize: '0.82rem', fontWeight: 500, color: completed ? '#AFAFAF' : '#6B7280', lineHeight: 1.45 }}>
                  {description}
                </div>
              )}
            </div>

            {/* XP reward */}
            <div style={{
              flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              background: completed ? '#DCFCE7' : '#FFF4E5',
              border: `1.5px solid ${completed ? '#86EFAC' : '#FFD580'}`,
              borderBottom: `3px solid ${completed ? '#4ADE80' : '#FF9600'}`,
              borderRadius: 12, padding: '7px 10px',
            }}>
              <span style={{ fontSize: '1rem' }}>{completed ? '✅' : '🎁'}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 900, color: completed ? tokens.color.success : tokens.color.xp }}>
                {completed ? 'Done' : `+${rewardXp}`}
              </span>
              {!completed && (
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#AFAFAF' }}>XP</span>
              )}
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: completed ? tokens.color.success : tokens.color.primary }}>
                {getSmartText(safeProgress, target, completed)}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1E1B4B' }}>
                {safeProgress}<span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#AFAFAF' }}>/{target}</span>
              </span>
            </div>
            <div style={{ height: 13, background: completed ? '#DCFCE7' : '#E0DBFF', borderRadius: 7, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                style={{
                  height: '100%', borderRadius: 7,
                  background: completed
                    ? tokens.color.success
                    : `linear-gradient(90deg, ${tokens.color.primary}, ${tokens.color.accentVia})`,
                }}
              />
            </div>
          </div>

          {/* CTA — THE primary button */}
          {completed ? (
            <div style={{
              width: '100%', padding: '12px 0', borderRadius: 14, textAlign: 'center',
              background: '#F0F0F0', color: '#AFAFAF',
              fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              Đã nhận thưởng ✅
            </div>
          ) : (
            <button
              onClick={() => navigate(routes.DASHBOARD)}
              style={{
                width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
                background: `linear-gradient(135deg, ${tokens.color.primary} 0%, ${tokens.color.accentVia} 100%)`,
                borderBottom: `4px solid ${tokens.color.primaryDark}`,
                color: '#fff', fontWeight: 900, fontSize: '0.95rem',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: `0 4px 16px ${tokens.color.primary}35`,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              onMouseDown={e => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.borderBottomWidth = '0px'; }}
              onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderBottomWidth = '4px'; }}
            >
              Học Ngay →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function getSmartText(progress, target, completed) {
  if (completed) return '🎉 Hoàn thành!';
  if (progress === 0) return 'Bắt đầu ngay nào!';
  if (progress === target - 1) return '🔥 Chỉ còn 1 bước nữa!';
  if (target > 0 && progress / target >= 0.5) return '💪 Đã hơn nửa đường!';
  return 'Tiến độ';
}
