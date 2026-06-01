import { Box, Typography } from '@mui/material';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function RankBadge({ rank }) {
  if (MEDAL[rank]) {
    return (
      <Typography fontSize="1.5rem" lineHeight={1} sx={{ minWidth: 32, textAlign: 'center' }}>
        {MEDAL[rank]}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minWidth: 32,
        height: 32,
        borderRadius: '50%',
        bgcolor: '#F0F0F0',
        border: '2px solid #E5E5E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography fontWeight={800} fontSize="0.75rem" color="#4B4B4B">
        {rank}
      </Typography>
    </Box>
  );
}
