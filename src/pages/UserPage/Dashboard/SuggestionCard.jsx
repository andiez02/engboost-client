import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AnimatePresence, motion } from 'framer-motion';

function getSuggestion({ due, reviewedToday, nextReviewAt }) {
  if (due > 0) {
    return {
      title: 'Học thẻ chờ',
      body: 'Giải quyết các thẻ đang vẫy gọi bạn nào.',
      actionLabel: 'Học ngay',
      path: '/study',
      btnColor: '#58CC02',
      btnBorder: '#46A302',
      icon: '🎯',
      bgColor: 'rgba(88, 204, 2, 0.08)',
      borderColor: 'rgba(88, 204, 2, 0.25)',
      labelColor: '#46A302',
    };
  }

  if (reviewedToday > 0) {
    return {
      title: 'Củng cố thẻ khó',
      body: `Bạn đã học ${reviewedToday} thẻ. Một lượt ôn thẻ khó sẽ giúp bạn nhớ dai hơn rất nhiều!`,
      actionLabel: 'Ôn thẻ khó',
      path: '/study?mode=weak',
      btnColor: '#FF9600',
      btnBorder: '#D87A00',
      icon: '🔥',
      bgColor: 'rgba(255, 150, 0, 0.08)',
      borderColor: 'rgba(255, 150, 0, 0.25)',
      labelColor: '#D87A00',
    };
  }

  if (nextReviewAt) {
    return {
      title: 'Chuẩn bị tạo đà!',
      body: 'Chưa có lịch hiện tại nhưng bạn luôn có thể học thêm từ vựng mới để giữ phong độ.',
      actionLabel: 'Học từ mới',
      path: '/flashcard/discover',
      btnColor: '#1CB0F6',
      btnBorder: '#1899D6',
      icon: '⏱️',
      bgColor: 'rgba(28, 176, 246, 0.08)',
      borderColor: 'rgba(28, 176, 246, 0.25)',
      labelColor: '#1899D6',
    };
  }

  return {
    title: 'Khởi động vòng học mới',
    body: 'Thời điểm hoàn hảo để thêm những từ vựng thật xịn vào danh sách của bạn!',
    actionLabel: 'Khám phá ngay',
    path: '/flashcard/discover',
    btnColor: '#CE82FF',
    btnBorder: '#A568CC',
    icon: '✨',
    bgColor: 'rgba(206, 130, 255, 0.08)',
    borderColor: 'rgba(206, 130, 255, 0.25)',
    labelColor: '#A568CC',
  };
}

export default function SuggestionCard({ due, reviewedToday, nextReviewAt }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const suggestion = getSuggestion({ due, reviewedToday, nextReviewAt });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ opacity: 0, x: 50, scale: 0.95 }}
           animate={{ opacity: 1, x: 0, scale: 1 }}
           exit={{ opacity: 0, x: 50, scale: 0.95, overflow: 'hidden' }}
           transition={{ duration: 0.2 }}
           style={{
             width: '100%'
           }}
        >
          <Box
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              bgcolor: suggestion.bgColor || '#fff',
              border: `2px solid ${suggestion.borderColor || '#E5E5E5'}`,
              borderBottom: `4px solid ${suggestion.borderColor || '#E5E5E5'}`,
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography fontSize="1.2rem">{suggestion.icon}</Typography>
                    <Typography fontSize="0.75rem" fontWeight={900} color={suggestion.labelColor} sx={{ letterSpacing: '0.05em' }}>
                      NHIỆM VỤ HÀNG NGÀY
                    </Typography>
                  </Box>
                  <Typography fontWeight={900} fontSize="1.1rem" sx={{ mt: 0.5, color: '#4B4B4B', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    {suggestion.title}
                  </Typography>
                  <Typography color="text.secondary" fontWeight={700} fontSize="0.85rem" sx={{ mt: 0.5, lineHeight: 1.35 }}>
                    {suggestion.body}
                  </Typography>
                </Box>

                <IconButton
                  onClick={() => setIsVisible(false)}
                  size="small"
                  sx={{
                    mt: -0.4,
                    mr: -0.4,
                    color: 'rgba(0,0,0,0.3)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' },
                  }}
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ mt: 2.5 }}>
                <ButtonBase
                  onClick={() => navigate(suggestion.path)}
                  sx={{
                    width: '100%',
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    bgcolor: suggestion.btnColor,
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    letterSpacing: '0.05em',
                    borderBottom: `4px solid ${suggestion.btnBorder}`,
                    transition: 'all 0.1s ease',
                    '&:active': {
                      borderBottomWidth: '0px',
                      transform: 'translateY(4px)',
                      mb: '4px',
                    },
                  }}
                >
                  {suggestion.actionLabel.toUpperCase()}
                </ButtonBase>
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
