import { motion } from 'framer-motion';
import { tokens } from '../../../theme';
import { useCompletionDetector } from './useCompletionDetector';
import FloatingXP from './FloatingXP';

// Secondary challenge — minimal, low visual weight
export default function SideChallengeCard({ challenge }) {
  const { title, progress = 0, target, rewardXp, completed, icon } = challenge;
  const safeProgress = progress ?? 0;
  const percent = target > 0 ? Math.min((safeProgress / target) * 100, 100) : 0;
  const { justCompleted, showReward } = useCompletionDetector(completed, rewardXp);

  return (
    <motion.div
      animate={justCompleted ? { scale: [1, 1.03, 1], transition: { duration: 0.3 } } : { scale: 1 }}
      style={{ position: 'relative' }}
    >
      <FloatingXP show={showReward} xp={rewardXp} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: '#fff', borderRadius: 14, padding: '10px 14px',
        border: `1.5px solid ${justCompleted ? tokens.color.success : completed ? '#D1FAE5' : '#F0F0F0'}`,
        borderBottom: `3px solid ${justCompleted ? '#4ADE80' : completed ? '#6EE7B7' : '#E8E8E8'}`,
        opacity: completed ? 0.65 : 1,
        transition: 'all 0.2s',
      }}>
        {/* Icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: completed ? '#F0FDF4' : '#F5F3FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem',
        }}>
          {completed ? '✅' : (icon || '🎯')}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span style={{
              fontSize: '0.85rem', fontWeight: 700,
              color: completed ? '#AFAFAF' : '#3D3D3D',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {title}
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#AFAFAF', flexShrink: 0, marginLeft: 8 }}>
              {safeProgress}/{target}
            </span>
          </div>
          <div style={{ height: 5, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                height: '100%', borderRadius: 3,
                background: completed ? tokens.color.success : tokens.color.primary,
              }}
            />
          </div>
        </div>

        {/* XP pill */}
        <span style={{
          flexShrink: 0, fontSize: '0.7rem', fontWeight: 800,
          color: completed ? tokens.color.success : tokens.color.xp,
          background: completed ? '#F0FDF4' : '#FFF4E5',
          borderRadius: 8, padding: '3px 8px',
        }}>
          {completed ? '✅' : `+${rewardXp} XP`}
        </span>
      </div>
    </motion.div>
  );
}
