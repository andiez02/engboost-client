import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Typography, ButtonBase } from '@mui/material';
import { fetchDueCards } from '../../../redux/study/studySlice';
import { formatTimeRemaining } from '../../../utils/formatTimeRemaining';

const VARIANTS = {
  'no-cards': {
    emoji: '📭',
    title: 'No cards to review yet',
    subtitle: 'Create your first deck to start learning.',
    cta: 'Create your first deck',
    path: '/flashcard/folders',
  },
  'caught-up': {
    emoji: '✅',
    title: "You're all caught up!",
    subtitle: "Nothing due today. Add more cards to keep the momentum going.",
    cta: 'Add more cards',
    path: '/flashcard/folders',
  },
  'folder-empty': {
    emoji: '📂',
    title: 'No due cards in this folder',
    subtitle: 'All cards here are up to date. Try studying all due cards instead.',
    cta: 'Study all due cards',
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
      background: 'linear-gradient(160deg, #f0f0ff 0%, #f8f8ff 50%, #f0f7ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2,
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: 400,
        bgcolor: '#fff',
        borderRadius: 5,
        boxShadow: '0 8px 48px rgba(79,70,229,0.12)',
        border: '1.5px solid rgba(79,70,229,0.08)',
        p: { xs: 3, sm: 5 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2.5,
        textAlign: 'center',
      }}>

        {/* emoji badge */}
        <Box sx={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
          fontSize: 32,
        }}>
          {config.emoji}
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.2px' }}>
            {config.title}
          </Typography>
          <Typography color="text.secondary" fontSize="0.9rem" sx={{ mt: 0.75, lineHeight: 1.6 }}>
            {folderName ? `"${folderName}" — ${config.subtitle}` : config.subtitle}
          </Typography>
        </Box>

        {/* Next review time + reviewed today stats */}
        {variant === 'caught-up' && (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {reviewedToday !== undefined && reviewedToday > 0 && (
              <Box sx={{
                py: 1.5,
                px: 2,
                borderRadius: 2,
                bgcolor: 'rgba(79,70,229,0.05)',
                border: '1px solid rgba(79,70,229,0.1)',
              }}>
                <Typography fontSize="0.75rem" color="text.secondary" fontWeight={600} sx={{ mb: 0.25 }}>
                  Đã ôn hôm nay
                </Typography>
                <Typography fontSize="1.5rem" fontWeight={800} color="#4F46E5">
                  {reviewedToday} thẻ
                </Typography>
              </Box>
            )}

            {timeDisplay && timeDisplay !== 'ngay bây giờ' && (
              <Box sx={{
                py: 1.5,
                px: 2,
                borderRadius: 2,
                bgcolor: 'rgba(124,58,237,0.05)',
                border: '1px solid rgba(124,58,237,0.1)',
              }}>
                <Typography fontSize="0.75rem" color="text.secondary" fontWeight={600} sx={{ mb: 0.25 }}>
                  Thẻ tiếp theo trong
                </Typography>
                <Typography fontSize="1.5rem" fontWeight={800} color="#7C3AED">
                  {timeDisplay}
                </Typography>
              </Box>
            )}

            {timeDisplay === 'ngay bây giờ' && (
              <ButtonBase
                onClick={() => navigate('/study')}
                sx={{
                  width: '100%',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
                  transition: 'all 0.15s ease',
                  '&:hover': { filter: 'brightness(1.08)', transform: 'translateY(-1px)' },
                }}
              >
                Ôn tập ngay
              </ButtonBase>
            )}
          </Box>
        )}

        {/* Action buttons */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, mt: 0.5 }}>
          <ButtonBase
            onClick={() => navigate(config.path)}
            sx={{
              width: '100%',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: '0 4px 16px rgba(79,70,229,0.3)',
              transition: 'all 0.15s ease',
              '&:hover': { filter: 'brightness(1.08)', transform: 'translateY(-1px)' },
            }}
          >
            {config.cta}
          </ButtonBase>

          {variant === 'caught-up' && (
            <>
              <ButtonBase
                onClick={() => navigate('/flashcard/folders')}
                sx={{
                  width: '100%',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  bgcolor: 'rgba(79,70,229,0.08)',
                  color: '#4F46E5',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  transition: 'all 0.15s ease',
                  '&:hover': { bgcolor: 'rgba(79,70,229,0.12)' },
                }}
              >
                Duyệt thư mục
              </ButtonBase>
              <ButtonBase
                onClick={() => navigate('/dashboard')}
                sx={{
                  width: '100%',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  bgcolor: 'rgba(79,70,229,0.08)',
                  color: '#4F46E5',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  transition: 'all 0.15s ease',
                  '&:hover': { bgcolor: 'rgba(79,70,229,0.12)' },
                }}
              >
                Về trang chủ
              </ButtonBase>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
