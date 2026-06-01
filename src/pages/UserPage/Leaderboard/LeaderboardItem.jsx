import { Box, Typography } from '@mui/material';
import RankBadge from './RankBadge';

export default function LeaderboardItem({ entry, isCurrentUser, mode = 'weekly' }) {
  const { name, avatar, weeklyXp, rank, level } = entry;

  const statLabel = mode === 'level'
    ? `🎖️ Level ${level}`
    : `⚡ ${weeklyXp} XP`;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1.5,
        borderRadius: 3,
        bgcolor: isCurrentUser ? '#FFF8E7' : '#fff',
        border: isCurrentUser ? '2px solid #FF9600' : '2px solid #E5E5E5',
        borderBottom: isCurrentUser ? '4px solid #FF9600' : '4px solid #E5E5E5',
        transition: 'background 0.2s',
      }}
    >
      <RankBadge rank={rank} />

      {/* Avatar */}
      {avatar ? (
        <Box
          component="img"
          src={avatar}
          alt={name}
          sx={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        />
      ) : (
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: '#E5E5E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography fontWeight={700} fontSize="1rem" color="#AFAFAF">
            {name?.[0]?.toUpperCase() ?? '?'}
          </Typography>
        </Box>
      )}

      {/* Name */}
      <Typography
        fontWeight={isCurrentUser ? 800 : 600}
        fontSize="0.95rem"
        color="#4B4B4B"
        sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {name}
        {isCurrentUser && (
          <Typography component="span" fontSize="0.7rem" fontWeight={700} color="#FF9600" sx={{ ml: 1 }}>
            (Bạn)
          </Typography>
        )}
      </Typography>

      {/* Stat */}
      <Typography fontWeight={800} fontSize="0.9rem" color="#FF9600" sx={{ flexShrink: 0 }}>
        {statLabel}
      </Typography>
    </Box>
  );
}
