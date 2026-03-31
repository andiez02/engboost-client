import { Box, Typography, ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import trophyAnimation from '../../../assets/lotties/trophy.json';

export default function SessionFeedbackModal({ reviewedCount, correctCount, sessionDuration, streak, xpGained = 0, onClose }) {
  const navigate = useNavigate();
  const accuracy = reviewedCount > 0 ? Math.round((correctCount / reviewedCount) * 100) : 0;
  
  // Format MM:SS
  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m > 0 ? `${m}m ` : ''}${s}s`;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        bgcolor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        animation: 'fadeIn 0.3s ease-out forwards',
        backdropFilter: 'blur(4px)',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      }}
    >
      <Box
        sx={{
          bgcolor: '#fff',
          width: '100%',
          maxWidth: 400,
          borderRadius: 6,
          border: '2px solid #E5E5E5',
          borderBottom: '6px solid #E5E5E5',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          animation: 'popUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          '@keyframes popUp': {
            '0%': { transform: 'scale(0.8)', opacity: 0 },
            '100%': { transform: 'scale(1)', opacity: 1 },
          }
        }}
      >
        <Box sx={{ width: 100, height: 100, mb: 1 }}>
          <Lottie animationData={trophyAnimation} loop={false} />
        </Box>
        
        <Typography fontWeight={900} fontSize="1.8rem" color="#4B4B4B" sx={{ mb: 1, letterSpacing: '-0.02em' }}>
          Tuyệt vời!
        </Typography>
        <Typography fontWeight={700} fontSize="1rem" color="#AFAFAF" sx={{ mb: 3 }}>
          Bạn đã hoàn thành phiên học xuất sắc.
        </Typography>

        <Box sx={{ width: '100%', bgcolor: '#FAFAFA', borderRadius: 4, p: 2, display: 'flex', gap: 2, border: '2px solid #E5E5E5', mb: 3 }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography fontWeight={800} fontSize="0.75rem" color="#AFAFAF" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Đã học
            </Typography>
            <Typography fontWeight={900} fontSize="1.2rem" color="#1CB0F6">
              {reviewedCount} thẻ
            </Typography>
          </Box>
          <Box sx={{ width: 2, bgcolor: '#E5E5E5', my: 1 }} />
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography fontWeight={800} fontSize="0.75rem" color="#AFAFAF" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Thời gian
            </Typography>
            <Typography fontWeight={900} fontSize="1.2rem" color="#1CB0F6">
              {formatDuration(sessionDuration)}
            </Typography>
          </Box>
          <Box sx={{ width: 2, bgcolor: '#E5E5E5', my: 1 }} />
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography fontWeight={800} fontSize="0.75rem" color="#AFAFAF" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Chính xác
            </Typography>
            <Typography fontWeight={900} fontSize="1.2rem" color={accuracy >= 80 ? '#58CC02' : '#FF9600'}>
              {accuracy}%
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, bgcolor: '#FFF0DE', px: 3, py: 1.5, borderRadius: 3, border: '2px solid #FFC800' }}>
          <span className="text-xl">🔥</span>
          <Typography fontWeight={900} color="#FF9600" fontSize="1rem">
            Chuỗi {streak} ngày
          </Typography>
        </Box>

        {/* XP earned */}
        {xpGained > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 4,
              bgcolor: '#FFF8E1',
              px: 3,
              py: 1.5,
              borderRadius: 3,
              border: '2px solid #FFE082',
              animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both',
              '@keyframes popIn': {
                '0%': { opacity: 0, transform: 'scale(0.5)' },
                '100%': { opacity: 1, transform: 'scale(1)' },
              },
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>⚡</span>
            <Typography fontWeight={900} color="#FF9600" fontSize="1rem">
              +{xpGained} XP
            </Typography>
          </Box>
        )}

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <ButtonBase
            onClick={onClose}
            sx={{
              width: '100%',
              bgcolor: '#58CC02',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 800,
              py: 2,
              borderRadius: 4,
              borderBottom: '4px solid #46A302',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.1s',
              '&:active': {
                transform: 'translateY(4px)',
                borderBottomWidth: 0,
                mt: '4px',
                mb: '-4px' // prevents shifting content
              }
            }}
          >
            Học Tiếp
          </ButtonBase>
          <ButtonBase
            onClick={() => navigate('/dashboard')}
            sx={{
              width: '100%',
              bgcolor: '#fff',
              color: '#1CB0F6',
              fontSize: '1rem',
              fontWeight: 800,
              py: 2,
              borderRadius: 4,
              border: '2px solid #E5E5E5',
              borderBottom: '4px solid #E5E5E5',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.1s',
              '&:active': {
                transform: 'translateY(4px)',
                borderBottomWidth: '0px',
                mt: '4px',
                mb: '-4px',
                borderColor: '#E5E5E5' // keep border to prevent flashing
              }
            }}
          >
            Về Trang Chủ
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
}
