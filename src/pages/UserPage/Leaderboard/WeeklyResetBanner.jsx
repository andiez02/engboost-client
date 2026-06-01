import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const LS_KEY = 'lastSeenWeekStartedAt';

export default function WeeklyResetBanner({ weekStartedAt }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!weekStartedAt) return;
    const lastSeen = localStorage.getItem(LS_KEY);
    if (lastSeen !== weekStartedAt) {
      setVisible(true);
    }
  }, [weekStartedAt]);

  const handleDismiss = () => {
    localStorage.setItem(LS_KEY, weekStartedAt);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: '#E8F5E9',
        border: '2px solid #66BB6A',
        borderBottom: '4px solid #66BB6A',
        borderRadius: 3,
        px: 2,
        py: 1.25,
        mb: 2,
      }}
    >
      <Typography fontWeight={700} fontSize="0.9rem" color="#2E7D32">
        🌅 Tuần mới bắt đầu! Leo bảng xếp hạng nào!
      </Typography>
      <IconButton size="small" onClick={handleDismiss} sx={{ color: '#2E7D32', ml: 1 }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
