import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { tokens } from '../../../theme';

export default function HeroDashboard({
  streak = 0,
  reviewedToday = 0,
  dailyGoal = 20,
  xp = 0,
  level = 1,
  xpForCurrentLevel = 0,
  xpForNextLevel = 100,
}) {
  const goalPercent = dailyGoal > 0 ? Math.min((reviewedToday / dailyGoal) * 100, 100) : 0;
  const xpRange = xpForNextLevel - xpForCurrentLevel;
  const xpProgress = xpRange > 0 ? Math.min(((xp - xpForCurrentLevel) / xpRange) * 100, 100) : 0;
  const goalComplete = reviewedToday >= dailyGoal;

  // ── Motivation text logic ──
  const motivationText = getMotivationText(reviewedToday, dailyGoal);

  // Near level up (>= 90%)
  const isNearLevelUp = xpRange > 0 && xpProgress >= 90;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* ── Daily Reset / Motivation Banner ── */}
      <motion.div
        key={motivationText}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Box
          sx={{
            bgcolor: goalComplete ? tokens.color.successBg : '#FFF8EE',
            border: `1.5px solid ${goalComplete ? tokens.color.success + '40' : '#FFE0A8'}`,
            borderRadius: '12px',
            py: 1.25,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ fontSize: '1.2rem' }}>🌅</span>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#B8860B' }}>
              Ngày mới, thử thách mới!
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: goalComplete ? tokens.color.success : tokens.color.xp,
            }}
          >
            {motivationText}
          </Typography>
        </Box>
      </motion.div>

      {/* ── Level & XP Progression Bar ── */}
      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: '20px',
          border: `2px solid ${isNearLevelUp ? tokens.color.primary : tokens.color.border}`,
          p: 3,
          boxShadow: isNearLevelUp ? `0 0 16px ${tokens.color.primary}30` : tokens.shadow.sm,
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component={motion.div}
              animate={
                isNearLevelUp
                  ? { scale: [1, 1.05, 1], boxShadow: [`0 0 0px ${tokens.color.primary}00`, `0 0 16px ${tokens.color.primary}60`, `0 0 0px ${tokens.color.primary}00`] }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${tokens.color.primary}, ${tokens.color.accentVia})`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              <Typography sx={{ fontSize: '1.4rem', fontWeight: 900 }}>{level}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: tokens.color.text, lineHeight: 1.1 }}>
                Level {level}
              </Typography>
              {isNearLevelUp && (
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: tokens.color.primary, mt: 0.5 }}>
                  Sắp thăng cấp! 🔥
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: tokens.color.xp }}>
              {xp}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: tokens.color.textSub }}>
              Tổng XP
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', height: 16, bgcolor: tokens.color.borderDark, borderRadius: 8, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              background: `linear-gradient(90deg, ${tokens.color.primary}, ${tokens.color.accentVia})`,
              borderRadius: 8,
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: tokens.color.textSub }}>
            {xp - xpForCurrentLevel} XP hiện tại
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: tokens.color.textSub }}>
            Cần {xpRange} XP để lên Lv. {level + 1}
          </Typography>
        </Box>
      </Box>

      {/* ── Stats Grid ── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
        }}
      >
        {/* ── Daily Goal Card ── */}
        <Box
          sx={{
            bgcolor: goalComplete ? tokens.color.successBg : '#fff',
            borderRadius: '16px',
            border: `2px solid ${goalComplete ? tokens.color.success : tokens.color.border}`,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ fontSize: '1.2rem' }}>🎯</span>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: tokens.color.textSub }}>
              Mục tiêu
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: tokens.color.text, lineHeight: 1 }}>
              {reviewedToday}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: tokens.color.textSub }}>
              / {dailyGoal}
            </Typography>
          </Box>
          <Box sx={{ position: 'relative', height: 8, bgcolor: tokens.color.border, borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goalPercent}%` }}
              style={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                background: goalComplete ? tokens.color.success : `linear-gradient(90deg, ${tokens.color.primary}, ${tokens.color.accentVia})`,
                borderRadius: 4
              }}
            />
          </Box>
        </Box>

        {/* ── Streak Card ── */}
        <StatCard
          icon="🔥"
          label="Chuỗi ngày"
          value={`${streak} ngày`}
          accent={tokens.color.streak}
          accentBg="#FFF4E5"
        />
      </Box>
    </Box>
  );
}

/* ── Reusable stat mini-card ── */
function StatCard({ icon, label, value, accent, accentBg }) {
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '16px',
        border: `2px solid ${tokens.color.border}`,
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        transition: 'all 0.2s ease',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        <Typography
          sx={{
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: tokens.color.textSub,
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: accent, lineHeight: 1 }}>
        {value}
      </Typography>

      <Box
        sx={{
          mt: 'auto',
          width: 40,
          height: 4,
          borderRadius: 2,
          bgcolor: accentBg,
        }}
      />
    </Box>
  );
}

/* ── Motivation text helper ── */
function getMotivationText(reviewedToday, dailyGoal) {
  if (reviewedToday >= dailyGoal) {
    return '🎉 Bạn đã hoàn thành mục tiêu hôm nay! Tuyệt vời!';
  }
  const ratio = dailyGoal > 0 ? reviewedToday / dailyGoal : 0;
  if (ratio >= 0.8) {
    return '🔥 Sắp đạt mục tiêu rồi! Cố lên!';
  }
  if (reviewedToday > 0) {
    return '🔥 Học ngay để giữ streak!';
  }
  return '💪 Bắt đầu học ngay để hoàn thành mục tiêu hôm nay!';
}
