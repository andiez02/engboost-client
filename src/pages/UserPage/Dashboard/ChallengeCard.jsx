import { Box, Typography, LinearProgress } from '@mui/material';

function ChallengeRow({ challenge }) {
  const progress = Math.min((challenge.progress / challenge.target) * 100, 100);
  const isComplete = challenge.completed;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 1.5,
        '&:not(:last-child)': {
          borderBottom: '1px solid #F0F0F0',
        },
      }}
    >
      <Box sx={{ fontSize: '1.5rem', width: 36, textAlign: 'center', opacity: isComplete ? 0.5 : 1 }}>
        {isComplete ? '✅' : challenge.icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography
            fontWeight={700}
            fontSize="0.85rem"
            color={isComplete ? '#AFAFAF' : '#4B4B4B'}
            sx={{ textDecoration: isComplete ? 'line-through' : 'none' }}
          >
            {challenge.title}
          </Typography>
          <Typography fontWeight={800} fontSize="0.7rem" color={isComplete ? '#58CC02' : '#AFAFAF'}>
            {isComplete ? 'Hoàn thành' : `${challenge.progress}/${challenge.target}`}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#E5E5E5',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              bgcolor: isComplete ? '#58CC02' : '#1CB0F6',
              transition: 'transform 0.4s ease',
            },
          }}
        />
        {!isComplete && (
          <Typography fontWeight={700} fontSize="0.65rem" color="#AFAFAF" sx={{ mt: 0.5 }}>
            +{challenge.rewardXp} XP
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function ChallengeCard({ challenges = [] }) {
  if (challenges.length === 0) return null;

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 4,
        border: '2px solid #E5E5E5',
        borderBottom: '4px solid #E5E5E5',
        p: 2.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Typography fontSize="1.2rem">🎯</Typography>
        <Typography fontWeight={900} fontSize="0.9rem" color="#4B4B4B">
          Thử thách
        </Typography>
      </Box>
      {challenges.map((c) => (
        <ChallengeRow key={c.id} challenge={c} />
      ))}
    </Box>
  );
}
