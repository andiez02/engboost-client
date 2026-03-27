import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { formatTimeRemaining } from '../../../utils/formatTimeRemaining';

export default function NextReviewBlock({ nextReviewAt }) {
  const [timeDisplay, setTimeDisplay] = useState(() => formatTimeRemaining(nextReviewAt));

  useEffect(() => {
    if (!nextReviewAt) return;
    setTimeDisplay(formatTimeRemaining(nextReviewAt));
    const id = setInterval(() => {
      setTimeDisplay(formatTimeRemaining(nextReviewAt));
    }, 1000);
    return () => clearInterval(id);
  }, [nextReviewAt]);

  if (!nextReviewAt) return null;

  const isReady = timeDisplay === 'ngay bây giờ';

  return (
    <Box sx={{
      width: '100%',
      bgcolor: '#fff',
      borderRadius: 4,
      border: `1.5px solid ${isReady ? 'rgba(79,70,229,0.25)' : 'rgba(79,70,229,0.08)'}`,
      boxShadow: '0 4px 20px rgba(79,70,229,0.05)',
      px: { xs: 3, sm: 3.5 },
      py: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}>
      <Typography fontSize="1.15rem" sx={{ flexShrink: 0 }}>⏱</Typography>
      <Box>
        <Typography
          fontSize="0.72rem"
          fontWeight={700}
          color="text.disabled"
          sx={{ letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.25 }}
        >
          Phiên ôn tiếp theo
        </Typography>
        <Typography
          fontWeight={700}
          fontSize="0.95rem"
          color={isReady ? '#4F46E5' : 'text.primary'}
        >
          {isReady ? 'Sẵn sàng ngay!' : timeDisplay}
        </Typography>
      </Box>
    </Box>
  );
}
