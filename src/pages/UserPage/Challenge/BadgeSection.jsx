import { Box, Typography, Tooltip } from '@mui/material';
import { tokens } from '../../../theme';

export default function BadgeSection({ achievements = [] }) {
  if (!achievements || achievements.length === 0) {
    return (
      <Box sx={{ mt: 2, textAlign: 'center', p: 4, bgcolor: '#fff', borderRadius: '16px' }}>
        <Typography sx={{ color: tokens.color.textSub }}>
          Chưa có hệ thống huy hiệu!
        </Typography>
      </Box>
    );
  }

  // Sort: unlocked first, then locked
  const sortedBadges = [...achievements].sort(
    (a, b) => Number(b.unlocked) - Number(a.unlocked)
  );

  const unlockedCount = achievements.filter((b) => b.unlocked).length;
  const isAllUnlocked = unlockedCount === achievements.length && achievements.length > 0;

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <span style={{ fontSize: '1.2rem' }}>🏆</span>
        <Typography
          sx={{
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: tokens.color.textSub,
            flex: 1,
          }}
        >
          Huy hiệu của bạn
        </Typography>
        <Typography
          sx={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: tokens.color.text,
          }}
        >
          {unlockedCount} / {achievements.length}
        </Typography>
      </Box>

      {isAllUnlocked && (
        <Box
          sx={{
            mb: 2,
            py: 1.5,
            px: 2,
            bgcolor: tokens.color.successBg,
            borderRadius: '12px',
            textAlign: 'center',
            border: `1.5px solid ${tokens.color.success}40`,
          }}
        >
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: tokens.color.success }}>
            🎉 Tuyệt đỉnh! Bạn đã thu thập đủ tất cả huy hiệu!
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {sortedBadges.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
      </Box>
    </Box>
  );
}

function BadgeItem({ badge }) {
  // Use slight gold accent when unlocked
  const bg = badge.unlocked ? '#FFF8E0' : '#F0F0F0';
  const border = badge.unlocked ? '#FFD700' : '#D0D0D0';

  return (
    <Tooltip
      title={
        <Box sx={{ textAlign: 'center', p: 0.5 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
            {badge.title}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', opacity: 0.8, mt: 0.5 }}>
            {badge.description}
          </Typography>
          {!badge.unlocked && (
            <Typography sx={{ fontSize: '0.7rem', color: '#FFB84D', mt: 1, fontWeight: 700 }}>
              🔒 Chưa mở khóa
            </Typography>
          )}
          {badge.unlocked && badge.unlocked_at && (
            <Typography sx={{ fontSize: '0.65rem', color: tokens.color.success, mt: 1, fontWeight: 600 }}>
              ✅ Đạt được: {new Date(badge.unlocked_at).toLocaleDateString('vi-VN')}
            </Typography>
          )}
        </Box>
      }
      arrow
      placement="top"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
          p: 2,
          borderRadius: '16px',
          bgcolor: '#fff',
          border: `2px solid ${badge.unlocked ? border + '50' : tokens.color.border}`,
          opacity: badge.unlocked ? 1 : 0.6,
          filter: badge.unlocked ? 'none' : 'grayscale(1)',
          transition: 'all 0.2s ease',
          cursor: 'help',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: tokens.shadow.sm,
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: bg,
              border: `2px solid ${border}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: badge.unlocked ? `0 4px 16px ${border}40` : 'none',
              overflow: 'hidden',
            }}
          >
            {/* If badge.icon contains http (is a url), use an img tag. Otherwise, just text emoji */}
            {badge.icon?.startsWith('http') ? (
              <img src={badge.icon} alt={badge.title} style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '1.8rem' }}>{badge.icon || '🏆'}</span>
            )}
          </Box>
          {!badge.unlocked && (
            <Box
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                bgcolor: '#fff',
                borderRadius: '50%',
                p: 0.2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <span style={{ fontSize: '1rem' }}>🔒</span>
            </Box>
          )}
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: badge.unlocked ? tokens.color.text : tokens.color.textSub,
              mb: 0.25,
            }}
          >
            {badge.title}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 500,
              color: tokens.color.textSub,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {badge.description}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}
