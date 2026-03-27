import { Box, ButtonBase, Typography } from '@mui/material';

const RATINGS = [
  { label: 'Again', value: 0, key: '1', bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  { label: 'Hard',  value: 1, key: '2', bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  { label: 'Good',  value: 2, key: '3', bg: '#DCFCE7', color: '#16A34A', border: '#BBF7D0' },
  { label: 'Easy',  value: 3, key: '4', bg: '#DBEAFE', color: '#2563EB', border: '#BFDBFE' },
];

export default function RatingButtons({ onRate, disabled }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5, width: '100%' }}>
      {RATINGS.map(({ label, value, key, bg, color, border }) => (
        <ButtonBase
          key={value}
          disabled={disabled}
          onClick={() => onRate(value)}
          sx={{
            flexDirection: 'column',
            py: 1.75,
            px: 1,
            borderRadius: 3,
            bgcolor: bg,
            border: `1.5px solid ${border}`,
            transition: 'all 0.15s ease',
            opacity: disabled ? 0.5 : 1,
            '&:hover': {
              filter: 'brightness(0.95)',
              transform: 'translateY(-1px)',
              boxShadow: `0 4px 12px ${color}30`,
            },
            '&:active': { transform: 'translateY(0)' },
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color, lineHeight: 1.2 }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', color, opacity: 0.55, mt: 0.3, fontFamily: 'monospace' }}>
            [{key}]
          </Typography>
        </ButtonBase>
      ))}
    </Box>
  );
}
