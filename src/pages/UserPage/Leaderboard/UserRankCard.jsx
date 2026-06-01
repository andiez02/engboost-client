import { Box, Typography } from '@mui/material';
import RankBadge from './RankBadge';
import CompetitionHint from './CompetitionHint';

export default function UserRankCard({ currentUser, mode = 'weekly' }) {
  if (!currentUser) return null;

  const { name, avatar, weeklyXp, xp, streak, rank, xpToNextRank, xpToTop10 } = currentUser;
  const displayValue = mode === 'weekly' ? weeklyXp : mode === 'streak' ? streak : xp;
  const valueLabel = mode === 'streak' ? `🔥 ${displayValue ?? 0} ngày` : `⚡ ${(displayValue ?? 0).toLocaleString()} XP`;

  return (
    <Box
      sx={{
        bgcolor: '#FFF8E7',
        border: '2px solid #FF9600',
        borderBottom: '4px solid #FF9600',
        borderRadius: 4,
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <RankBadge rank={rank} />

        {avatar ? (
          <Box
            component="img"
            src={avatar}
            alt={name}
            sx={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: '#FFD580',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography fontWeight={700} fontSize="1.1rem" color="#fff">
              {name?.[0]?.toUpperCase() ?? '?'}
            </Typography>
          </Box>
        )}

        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={800} fontSize="1rem" color="#4B4B4B">
            {name}
          </Typography>
          <Typography fontWeight={700} fontSize="0.8rem" color="#AFAFAF">
            Hạng #{rank}
          </Typography>
        </Box>

        <Typography fontWeight={900} fontSize="1rem" color="#FF9600">
          {valueLabel}
        </Typography>
      </Box>

      {/* Competition hint */}
      <CompetitionHint rank={rank} xpToNextRank={xpToNextRank} xpToTop10={xpToTop10} mode={mode} />
    </Box>
  );
}
