import { Box, Typography } from '@mui/material';

function getMotivationMessage(count) {
  if (count === 0) return 'Bắt đầu phiên ôn đầu tiên hôm nay!';
  if (count < 5) return 'Cứ tiếp tục!';
  if (count < 15) return 'Bạn đang có đà tốt! 💪';
  return 'Phiên hôm nay tuyệt vời! 🎉';
}

export default function DailyProgressBlock({ reviewedToday }) {
  const message = getMotivationMessage(reviewedToday);

  return (
    <Box sx={{
      width: '100%',
      bgcolor: '#fff',
      borderRadius: 4,
      border: '1.5px solid rgba(249,115,22,0.12)',
      boxShadow: '0 4px 20px rgba(249,115,22,0.06)',
      px: { xs: 3, sm: 3.5 },
      py: 2.5,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}>
      <Box sx={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(249,115,22,0.28)',
        fontSize: 20,
        flexShrink: 0,
      }}>
        🔥
      </Box>
      <Box>
        <Typography fontWeight={700} fontSize="0.95rem" sx={{ lineHeight: 1.3 }}>
          {reviewedToday === 0 ? 'Chưa ôn thẻ nào hôm nay' : `${reviewedToday} thẻ đã được ôn hôm nay`}
        </Typography>
        <Typography fontSize="0.8rem" color="text.secondary" sx={{ mt: 0.25 }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
}
