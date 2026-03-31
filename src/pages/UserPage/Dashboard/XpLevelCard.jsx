import { Box, Typography, LinearProgress } from '@mui/material';

export default function XpLevelCard({ xp = 0, level = 1, xpForNextLevel = 10, xpForCurrentLevel = 0 }) {
  const xpInLevel = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progress = xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 0;

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 4,
        border: '2px solid #E5E5E5',
        borderBottom: '4px solid #E5E5E5',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Level badge */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: '#FF9600',
              border: '3px solid #E68600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 0 #CC7A00',
            }}
          >
            <Typography fontWeight={900} fontSize="1.1rem" color="#fff">
              {level}
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight={800} fontSize="0.75rem" color="#AFAFAF" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Level
            </Typography>
            <Typography fontWeight={900} fontSize="1rem" color="#4B4B4B" sx={{ lineHeight: 1, mt: 0.25 }}>
              Level {level}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography fontWeight={800} fontSize="0.75rem" color="#FF9600">
            ⚡ {xp} XP
          </Typography>
        </Box>
      </Box>

      {/* Progress bar */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography fontWeight={700} fontSize="0.7rem" color="#AFAFAF">
            {xpInLevel} / {xpNeeded} XP
          </Typography>
          <Typography fontWeight={700} fontSize="0.7rem" color="#AFAFAF">
            Level {level + 1}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 12,
            borderRadius: 6,
            bgcolor: '#E5E5E5',
            '& .MuiLinearProgress-bar': {
              borderRadius: 6,
              background: 'linear-gradient(90deg, #FFC800, #FF9600)',
              transition: 'transform 0.6s ease',
            },
          }}
        />
      </Box>
    </Box>
  );
}
