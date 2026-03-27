import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, Skeleton, Typography } from '@mui/material';
import LearningProgress from '../../../components/LearningProgress/LearningProgress';

export default function DashboardHero({
  userName,
  due,
  isLoading,
  error,
  onRetry,
}) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box
        sx={{
          borderRadius: 6,
          overflow: 'hidden',
          p: { xs: 3, md: 5 },
          bgcolor: '#1CB0F6',
        }}
      >
        <Skeleton variant="rounded" height={32} sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, maxWidth: 220 }} />
        <Skeleton variant="rounded" height={64} sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3, mt: 2, maxWidth: 360 }} />
        <Skeleton variant="rounded" height={48} sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 4, mt: 3, maxWidth: 200 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          borderRadius: 6,
          p: { xs: 3, md: 4 },
          bgcolor: '#FF4B4B',
          color: '#fff',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          borderBottom: '6px solid #EA2B2B',
        }}
      >
        <Box>
          <Typography fontWeight={900} fontSize="1.3rem">
            Ôi không! Có lỗi xảy ra 😢
          </Typography>
          <Typography sx={{ opacity: 0.9, mt: 0.5 }} fontSize="1rem" fontWeight={700}>
            Không thể tải dữ liệu học tập.
          </Typography>
        </Box>
        <ButtonBase
          onClick={onRetry}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 4,
            bgcolor: '#fff',
            color: '#FF4B4B',
            fontWeight: 900,
            fontSize: '0.95rem',
            borderBottom: '4px solid #E5E5E5',
            transition: 'all 0.1s ease',
            '&:active': {
              borderBottomWidth: '0px',
              transform: 'translateY(4px)',
              mb: '4px',
            },
          }}
        >
          THỬ LẠI
        </ButtonBase>
      </Box>
    );
  }

  const primaryAction = due > 0
    ? {
        title: `Chào ${userName || 'bạn'}! 👋`,
        subtitle: 'Đến lúc luyện tập rồi',
        description: `Bạn có ${due} thẻ đang chờ. Chỉ mất vài phút để giải quyết hết thôi!`,
        buttonLabel: 'BẮT ĐẦU HỌC',
        onClick: () => navigate('/study'),
        badge: 'Mục tiêu hôm nay',
        btnColor: '#58CC02',
        btnBorder: '#46A302',
      }
    : {
        title: 'Tuyệt vời! 🎉',
        subtitle: 'Bạn đã hoàn thành mục tiêu',
        description: 'Bạn không có thẻ chờ nào. Hãy học thêm từ mới để giữ lửa nhé!',
        buttonLabel: 'HỌC TỪ MỚI',
        onClick: () => navigate('/flashcard/discover'),
        badge: 'Hoàn thành!',
        btnColor: '#FF9600',
        btnBorder: '#D87A00',
      };

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 6,
        p: { xs: 3, md: 5 },
        bgcolor: '#1CB0F6',
        color: '#fff',
        borderBottom: '6px solid #1899D6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 3,
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 150,
          height: 150,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.1)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -40,
          left: '40%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.1)',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 2,
            py: 0.8,
            borderRadius: 4,
            bgcolor: 'rgba(255,255,255,0.2)',
            mb: 2,
            borderBottom: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <Typography fontWeight={900} fontSize="0.85rem" sx={{ letterSpacing: '0.05em' }}>
            {primaryAction.badge.toUpperCase()}
          </Typography>
        </Box>

        <Typography
          fontWeight={900}
          fontSize={{ xs: '1.5rem', md: '2rem' }}
          sx={{ letterSpacing: '-0.02em', mb: 0.5 }}
        >
          {primaryAction.title}
        </Typography>
        <Typography
          fontWeight={900}
          fontSize={{ xs: '2rem', md: '2.8rem' }}
          sx={{ lineHeight: 1.1, letterSpacing: '-0.03em', mb: 2 }}
        >
          {primaryAction.subtitle}
        </Typography>
        <Typography
          fontWeight={800}
          fontSize={{ xs: '1rem', md: '1.1rem' }}
          sx={{ opacity: 0.95, lineHeight: 1.5, mb: 3.5, maxWidth: 480 }}
        >
          {primaryAction.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ButtonBase
            onClick={primaryAction.onClick}
            sx={{
              px: 4,
              py: 1.8,
              borderRadius: 4,
              bgcolor: primaryAction.btnColor,
              color: '#fff',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '0.05em',
              borderBottom: `4px solid ${primaryAction.btnBorder}`,
              transition: 'all 0.1s ease',
              '&:active': {
                borderBottomWidth: '0px',
                transform: 'translateY(4px)',
                mb: '4px', // keeps layout stable when border disappears
              },
            }}
          >
            {primaryAction.buttonLabel}
          </ButtonBase>
        </Box>
      </Box>

      {/* Mascot / Illustration Place */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          zIndex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          mr: { md: 4, lg: 8 },
        }}
      >
        <Box sx={{ width: { md: 200, lg: 300 }, height: { md: 200, lg: 300 } }}>
          <LearningProgress />
        </Box>
      </Box>
    </Box>
  );
}
