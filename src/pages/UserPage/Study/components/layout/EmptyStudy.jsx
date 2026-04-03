import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Typography, ButtonBase } from '@mui/material';
import { fetchDueCards } from '../../../../../redux/study/studySlice';
import { formatTimeRemaining } from '../../../../../utils/formatTimeRemaining';

const VARIANTS = {
  'no-cards': {
    emoji: '📭',
    title: 'Chưa có thẻ nào',
    subtitle: 'Hãy tạo bộ thẻ đầu tiên của bạn để bắt đầu học.',
    cta: 'Tạo thẻ mới',
    path: '/flashcard/folders',
  },
  'caught-up': {
    emoji: '🎉',
    title: 'Tuyệt vời!',
    subtitle: 'Bạn đã hoàn thành mục tiêu hôm nay. Hãy tiếp tục khám phá hoặc ôn tập thêm để giữ vững phong độ nhé!',
    cta: 'Duyệt thêm thẻ mới',
    path: '/flashcard/folders',
  },
  'folder-empty': {
    emoji: '📂',
    title: 'Thư mục hoàn tất',
    subtitle: 'Thư mục này hiện không có thẻ nào cần ôn. Hãy thử ôn tập toàn bộ thẻ đến hạn.',
    cta: 'Ôn tập tất cả',
    path: '/study',
  },
};

export default function EmptyStudy({ variant = 'no-cards', folderName, nextReviewAt, reviewedToday, folderId = null }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const config = VARIANTS[variant] ?? VARIANTS['no-cards'];

  const [timeDisplay, setTimeDisplay] = useState(() => formatTimeRemaining(nextReviewAt));

  // Countdown_Timer — 1s tick
  useEffect(() => {
    if (!nextReviewAt) return;
    setTimeDisplay(formatTimeRemaining(nextReviewAt)); // sync immediately when nextReviewAt changes
    const id = setInterval(() => {
      setTimeDisplay(formatTimeRemaining(nextReviewAt));
    }, 1000);
    return () => clearInterval(id);
  }, [nextReviewAt]);

  // Auto_Refresh — 45s
  useEffect(() => {
    if (variant !== 'caught-up' && variant !== 'folder-empty') return;
    const id = setInterval(() => {
      dispatch(fetchDueCards(folderId ?? null));
    }, 45000);
    return () => clearInterval(id);
  }, [variant, folderId, dispatch]);

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2,
    }}>
      <Box sx={{
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
      }}>

        {/* emoji badge */}
        <Box sx={{ fontSize: '4rem', mb: 1, animation: 'bounce 2s infinite ease-in-out' }}>
          {config.emoji}
        </Box>

        <Typography fontWeight={900} fontSize="1.6rem" color="#4B4B4B" sx={{ mb: 1, letterSpacing: '-0.02em' }}>
          {config.title}
        </Typography>
        <Typography fontWeight={700} fontSize="1rem" color="#AFAFAF" sx={{ mb: 3 }}>
          {folderName ? `"${folderName}" — ${config.subtitle}` : config.subtitle}
        </Typography>

        {/* Next review time + reviewed today stats */}
        {variant === 'caught-up' && (
          <Box sx={{ width: '100%', bgcolor: '#FAFAFA', borderRadius: 4, p: 2, display: 'flex', gap: 2, border: '2px solid #E5E5E5', mb: 3 }}>
            {reviewedToday !== undefined && reviewedToday > 0 && (
              <>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography fontWeight={800} fontSize="0.75rem" color="#AFAFAF" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Đã ôn nay
                  </Typography>
                  <Typography fontWeight={900} fontSize="1.2rem" color="#58CC02">
                    {reviewedToday}
                  </Typography>
                </Box>
                {timeDisplay && <Box sx={{ width: 2, bgcolor: '#E5E5E5', my: 1 }} />}
              </>
            )}

            {timeDisplay && (
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography fontWeight={800} fontSize="0.75rem" color="#AFAFAF" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {timeDisplay === 'ngay bây giờ' ? 'Sẵn sàng ôn' : 'Thẻ kế tiếp'}
                </Typography>
                <Typography fontWeight={900} fontSize="1.2rem" color="#1CB0F6">
                  {timeDisplay}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <ButtonBase
            onClick={() => navigate(config.path)}
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
                mb: '-4px'
              }
            }}
          >
            {config.cta}
          </ButtonBase>

          {timeDisplay === 'ngay bây giờ' && variant === 'caught-up' && (
            <ButtonBase
              onClick={() => navigate('/study')}
              sx={{
                width: '100%',
                bgcolor: '#1CB0F6',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 800,
                py: 2,
                borderRadius: 4,
                borderBottom: '4px solid #1899D6',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.1s',
                '&:active': {
                  transform: 'translateY(4px)',
                  borderBottomWidth: 0,
                  mt: '4px',
                  mb: '-4px'
                }
              }}
            >
              Ôn ngay
            </ButtonBase>
          )}

          {variant === 'caught-up' && (
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
                  borderColor: '#E5E5E5'
                }
              }}
            >
              Về Trang Chủ
            </ButtonBase>
          )}
        </Box>
      </Box>
    </Box>
  );
}
