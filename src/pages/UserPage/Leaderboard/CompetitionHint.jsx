import { Box, Typography } from '@mui/material';

export default function CompetitionHint({ rank, xpToNextRank, xpToTop10, mode = 'weekly' }) {
  if (!rank || mode !== 'weekly') return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      {rank === 1 ? (
        <Typography fontWeight={700} fontSize="0.85rem" color="#FF9600">
          🏆 Bạn đang dẫn đầu! Giữ vững vị trí!
        </Typography>
      ) : xpToNextRank != null ? (
        <Typography fontWeight={700} fontSize="0.85rem" color="#4B4B4B">
          ⚡ Cố thêm {xpToNextRank} XP để vượt người phía trên!
        </Typography>
      ) : null}

      {rank > 10 && xpToTop10 != null && (
        <Typography fontWeight={700} fontSize="0.85rem" color="#E05C00">
          🔥 Bạn chỉ kém top 10: {xpToTop10} XP
        </Typography>
      )}
    </Box>
  );
}
