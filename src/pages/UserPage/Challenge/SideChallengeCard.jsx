import { Box, Typography, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { tokens } from '../../../theme';
import { useCompletionDetector } from './useCompletionDetector';
import FloatingXP from './FloatingXP';

export default function SideChallengeCard({ challenge }) {
  const { title, progress, target, rewardXp, completed, icon } = challenge;
  const percent = target > 0 ? Math.min((progress / target) * 100, 100) : 0;

  // ── Completion detection ──
  const { justCompleted, showReward } = useCompletionDetector(completed, rewardXp);

  return (
    <motion.div
      animate={
        justCompleted
          ? { scale: [1, 1.05, 1], transition: { duration: 0.35, ease: 'easeOut' } }
          : { scale: 1 }
      }
      style={{ position: 'relative' }}
    >
      {/* Floating XP reward */}
      <FloatingXP show={showReward} xp={rewardXp} />

      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: '14px',
          border: `2px solid ${
            justCompleted
              ? tokens.color.success
              : completed
                ? tokens.color.success + '30'
                : tokens.color.border
          }`,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          opacity: completed ? 0.65 : 1,
          transition: 'all 0.3s ease',
          boxShadow: justCompleted
            ? `0 0 20px ${tokens.color.success}25`
            : 'none',
          '&:hover': {
            transform: completed ? 'none' : 'translateY(-1px)',
            boxShadow: completed ? 'none' : tokens.shadow.sm,
          },
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            bgcolor: completed ? tokens.color.successBg : '#F5F3FF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>
            {completed ? '✅' : (icon || '🎯')}
          </span>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography
              sx={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: completed ? tokens.color.textSub : tokens.color.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: completed ? tokens.color.textSub : tokens.color.text,
                flexShrink: 0,
                ml: 1,
              }}
            >
              {progress}/{target}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: completed ? '#E8E8E8' : tokens.color.border,
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: completed ? tokens.color.success : tokens.color.primary,
                transition: 'transform 0.4s ease',
              },
            }}
          />
        </Box>

        {/* XP badge (compact) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.3,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '0.75rem' }}>{completed ? '✅' : '🎁'}</span>
          <Typography
            sx={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: completed ? tokens.color.textSub : tokens.color.xp,
            }}
          >
            {completed ? 'Done' : `+${rewardXp}`}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}
