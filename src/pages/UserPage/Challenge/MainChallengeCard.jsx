import { Box, Typography, LinearProgress, ButtonBase } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../../theme';
import { routes } from '../../../utils/constants';
import { useCompletionDetector } from './useCompletionDetector';
import FloatingXP from './FloatingXP';

export default function MainChallengeCard({ challenge }) {
  const navigate = useNavigate();
  const { title, description, progress, target, rewardXp, completed, icon } = challenge;
  const percent = target > 0 ? Math.min((progress / target) * 100, 100) : 0;

  // ── Completion detection ──
  const { justCompleted, showReward } = useCompletionDetector(completed, rewardXp);

  // ── Smart progress text ──
  const smartText = getSmartText(progress, target, completed);

  return (
    <motion.div
      animate={
        justCompleted
          ? { scale: [1, 1.03, 1], transition: { duration: 0.4, ease: 'easeOut' } }
          : { scale: 1 }
      }
      style={{ position: 'relative' }}
    >
      {/* Floating XP reward */}
      <FloatingXP show={showReward} xp={rewardXp} />

      <Box
        sx={{
          position: 'relative',
          bgcolor: completed ? tokens.color.successBg : '#fff',
          borderRadius: '20px',
          border: `2px solid ${
            justCompleted
              ? tokens.color.success
              : completed
                ? tokens.color.success + '40'
                : tokens.color.primary + '22'
          }`,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: justCompleted
            ? `0 0 24px ${tokens.color.success}30`
            : 'none',
          '&:hover': {
            transform: completed ? 'none' : 'translateY(-2px)',
            boxShadow: completed ? 'none' : tokens.shadow.lg,
          },
        }}
      >
        {/* ── Accent top bar ── */}
        <Box
          sx={{
            height: 4,
            background: completed
              ? tokens.color.success
              : `linear-gradient(90deg, ${tokens.color.primary}, ${tokens.color.accentVia}, ${tokens.color.accentTo})`,
          }}
        />

        <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          {/* ── Header row ── */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            {/* Big icon */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                background: completed
                  ? tokens.color.successBg
                  : `linear-gradient(135deg, ${tokens.color.primaryLight}, #F0EBFF)`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '2rem' }}>
                {completed ? '✅' : (icon || '🎯')}
              </span>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Label */}
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: completed ? tokens.color.success : tokens.color.primary,
                  mb: 0.5,
                }}
              >
                {completed ? 'Đã hoàn thành' : 'Thử thách chính'}
              </Typography>

              {/* Title */}
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: completed ? tokens.color.textSub : tokens.color.text,
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>

              {/* Description */}
              {description && (
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: tokens.color.textSub,
                    lineHeight: 1.4,
                  }}
                >
                  {description}
                </Typography>
              )}
            </Box>

            {/* XP badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: completed ? tokens.color.successBg : tokens.color.xpBg,
                px: 1.5,
                py: 0.75,
                borderRadius: '10px',
                border: `1.5px solid ${completed ? tokens.color.success + '50' : '#FFD8A8'}`,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{completed ? '✅' : '🎁'}</span>
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: completed ? tokens.color.success : tokens.color.xp,
                }}
              >
                {completed ? 'Đã nhận' : `+${rewardXp} XP`}
              </Typography>
            </Box>
          </Box>

          {/* ── Progress section ── */}
          <Box
            sx={{
              bgcolor: completed ? '#E8F5E9' : '#F9FAFB',
              borderRadius: '12px',
              p: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: completed ? tokens.color.success : tokens.color.primary }}>
                {smartText}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: tokens.color.text }}>
                {progress} / {target}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{
                height: 14,
                borderRadius: 7,
                bgcolor: tokens.color.border,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 7,
                  background: completed
                    ? tokens.color.success
                    : `linear-gradient(90deg, ${tokens.color.primary}, ${tokens.color.accentVia})`,
                  transition: 'transform 0.5s ease',
                },
              }}
            />
          </Box>

          {/* ── CTA Button ── */}
          {completed ? (
            <Box
              sx={{
                mt: 2,
                width: '100%',
                py: 1.5,
                borderRadius: '14px',
                bgcolor: '#E8E8E8',
                color: tokens.color.textSub,
                fontWeight: 800,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textAlign: 'center',
              }}
            >
              Đã nhận thưởng ✅
            </Box>
          ) : (
            <ButtonBase
              onClick={() => navigate(routes.DASHBOARD)}
              sx={{
                mt: 2,
                width: '100%',
                py: 1.5,
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${tokens.color.primary}, ${tokens.color.accentVia})`,
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                boxShadow: `0 4px 0 ${tokens.color.primaryDark}, ${tokens.shadow.md}`,
                transition: 'all 0.1s ease',
                '&:active': {
                  transform: 'translateY(4px)',
                  boxShadow: `0 0px 0 ${tokens.color.primaryDark}`,
                },
              }}
            >
              Học Ngay →
            </ButtonBase>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}

/* ── Smart progress text helper ── */
function getSmartText(progress, target, completed) {
  if (completed) return '🎉 Hoàn thành!';
  if (progress === 0) return 'Bắt đầu ngay nào!';
  if (progress === target - 1) return '🔥 Chỉ còn 1 bước nữa!';
  if (target > 0 && progress / target >= 0.5) return '💪 Đã hơn nửa đường!';
  return 'Tiến độ';
}
