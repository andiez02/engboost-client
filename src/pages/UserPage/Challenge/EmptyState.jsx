import { Box, Typography } from '@mui/material';
import { tokens } from '../../../theme';

export default function EmptyState() {
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        border: `2px solid ${tokens.color.border}`,
        borderRadius: '20px',
        p: { xs: 5, sm: 7 },
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '20px',
          bgcolor: '#F5F3FF',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '2.5rem' }}>😴</span>
      </Box>

      <Typography
        sx={{
          fontSize: '1.1rem',
          fontWeight: 800,
          color: tokens.color.textSub,
        }}
      >
        Không có thử thách hôm nay
      </Typography>

      <Typography
        sx={{
          fontSize: '0.85rem',
          fontWeight: 500,
          color: tokens.color.textSub,
          maxWidth: 280,
          lineHeight: 1.5,
        }}
      >
        Hãy quay lại vào ngày mai để nhận thử thách mới nhé!
      </Typography>
    </Box>
  );
}
