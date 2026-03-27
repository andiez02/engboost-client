import { useNavigate } from 'react-router-dom';
import { Box, Typography, ButtonBase, Skeleton } from '@mui/material';
import { formatTimeRemaining } from '../../../utils/formatTimeRemaining';

export default function PrimaryActionBlock({ due, nextReviewAt, isLoading, error, onRetry }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Skeleton variant="rectangular" height={64} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: 'rgba(239,68,68,0.06)',
        border: '1.5px solid rgba(239,68,68,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}>
        <Typography color="error" fontWeight={600} fontSize="0.875rem">
          Không thể tải dữ liệu. Vui lòng thử lại.
        </Typography>
        <ButtonBase
          onClick={onRetry}
          sx={{
            flexShrink: 0,
            px: 2.5,
            py: 0.75,
            borderRadius: 2,
            bgcolor: 'rgba(239,68,68,0.1)',
            color: '#DC2626',
            fontWeight: 700,
            fontSize: '0.8rem',
            transition: 'all 0.15s ease',
            '&:hover': { bgcolor: 'rgba(239,68,68,0.18)' },
          }}
        >
          Thử lại
        </ButtonBase>
      </Box>
    );
  }

  if (due > 0) {
    return (
      <Box sx={{
        width: '100%',
        bgcolor: '#fff',
        borderRadius: 4,
        border: '1.5px solid rgba(79,70,229,0.14)',
        boxShadow: '0 4px 20px rgba(79,70,229,0.08)',
        p: { xs: 3, sm: 3.5 },
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}>
        <Typography
          fontSize="0.72rem"
          fontWeight={700}
          color="#4F46E5"
          sx={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          Sẵn sàng ôn
        </Typography>
        <ButtonBase
          onClick={() => navigate('/study')}
          sx={{
            width: '100%',
            px: 4,
            py: 2,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.05rem',
            letterSpacing: '-0.2px',
            boxShadow: '0 6px 20px rgba(79,70,229,0.32)',
            transition: 'all 0.18s ease',
            '&:hover': {
              filter: 'brightness(1.08)',
              transform: 'translateY(-2px)',
              boxShadow: '0 10px 28px rgba(79,70,229,0.38)',
            },
          }}
        >
          Học ngay — {due} thẻ chờ
        </ButtonBase>
      </Box>
    );
  }

  // due === 0
  const timeRemaining = nextReviewAt ? formatTimeRemaining(nextReviewAt) : null;

  return (
    <Box sx={{
      width: '100%',
      bgcolor: '#fff',
      borderRadius: 4,
      border: '1.5px solid rgba(34,197,94,0.2)',
      boxShadow: '0 4px 20px rgba(34,197,94,0.06)',
      p: { xs: 3, sm: 3.5 },
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}>
      <Box>
        <Typography fontWeight={800} fontSize="1.1rem" sx={{ mb: 0.5 }}>
          🎉 Bạn đã hoàn thành rồi!
        </Typography>
        {timeRemaining && (
          <Typography fontSize="0.875rem" color="text.secondary">
            Ôn lại sau{' '}
            <Box component="span" sx={{ fontWeight: 700, color: '#4F46E5' }}>
              {timeRemaining}
            </Box>{' '}
            ⏱
          </Typography>
        )}
      </Box>

      <Typography
        fontSize="0.72rem"
        fontWeight={700}
        color="text.disabled"
        sx={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
      >
        Bạn muốn làm gì tiếp theo?
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <ButtonBase
          onClick={() => navigate('/flashcard/discover')}
          sx={{
            width: '100%',
            px: 3.5,
            py: 1.5,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 4px 14px rgba(79,70,229,0.28)',
            transition: 'all 0.15s ease',
            '&:hover': { filter: 'brightness(1.08)', transform: 'translateY(-1px)' },
          }}
        >
          Tạo thẻ mới 🚀
        </ButtonBase>
        <ButtonBase
          onClick={() => navigate('/study?mode=weak')}
          sx={{
            width: '100%',
            px: 3.5,
            py: 1.5,
            borderRadius: 3,
            bgcolor: 'rgba(79,70,229,0.07)',
            color: '#4F46E5',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '1.5px solid rgba(79,70,229,0.14)',
            transition: 'all 0.15s ease',
            '&:hover': { bgcolor: 'rgba(79,70,229,0.12)' },
          }}
        >
          Ôn thẻ khó 🧠
        </ButtonBase>
      </Box>
    </Box>
  );
}
