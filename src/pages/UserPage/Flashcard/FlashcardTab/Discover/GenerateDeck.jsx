import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Chip,
  alpha,
} from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { toast } from 'react-toastify';
import authorizedAxiosInstance from '../../../../../utils/authorizedAxios';
import { API_ROOT } from '../../../../../utils/constants';

const TOPICS = [
  { label: 'Food',        emoji: '🍜', topic: 'food',        color: '#f97316' },
  { label: 'Travel',      emoji: '✈️',  topic: 'travel',      color: '#3b82f6' },
  { label: 'Work',        emoji: '💼', topic: 'work',        color: '#8b5cf6' },
  { label: 'Daily Life',  emoji: '🏠', topic: 'daily life',  color: '#58CC02' },
  { label: 'Technology',  emoji: '💻', topic: 'technology',  color: '#06b6d4' },
  { label: 'Health',      emoji: '🏃', topic: 'health',      color: '#10b981' },
];

export default function GenerateDeck({ variant = 'discover' }) {
  const navigate = useNavigate();
  const [loadingTopic, setLoadingTopic] = useState(null);

  const handleGenerate = async (topic) => {
    if (loadingTopic) return;
    setLoadingTopic(topic);
    try {
      const res = await authorizedAxiosInstance.post(`${API_ROOT}/decks/generate`, {
        topic,
        level: 'beginner',
        count: 10,
      });
      const { folderId } = res.data.data;
      toast.success(`Deck "${topic}" created! Starting study session...`);
      navigate(`/study?folderId=${folderId}`);
    } catch {
      // errors are handled globally by the axios interceptor
    } finally {
      setLoadingTopic(null);
    }
  };

  return (
    <Box sx={{ mb: variant === 'create' ? 0 : 6 }}>
      {variant !== 'create' && (
        <>
          {/* Section header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <AutoAwesome sx={{ color: '#1CB0F6', fontSize: 28 }} />
            <Typography sx={{ fontWeight: 900, color: '#4B4B4B', fontSize: '1.5rem', textTransform: 'uppercase' }}>
              CHỌN CHỦ ĐỀ AI
            </Typography>
          </Box>
          <Typography
            sx={{ fontWeight: 700, color: '#AFAFAF', mb: 3, maxWidth: 520, fontSize: '0.95rem' }}
          >
            Chọn một chủ đề, hệ thống sẽ tạo 10 flashcards bằng AI — sẵn sàng học ngay.
          </Typography>
        </>
      )}

      <Grid container spacing={2}>
        {TOPICS.map(({ label, emoji, topic, color }) => {
          const isLoading = loadingTopic === topic;
          const isDisabled = !!loadingTopic && !isLoading;

          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={topic}>
              <Card
                sx={{
                  borderRadius: 4,
                  border: `2px solid ${alpha(color, 0.4)}`,
                  borderBottom: `4px solid ${alpha(color, 0.5)}`,
                  backgroundColor: '#fff',
                  boxShadow: 'none',
                  transition: 'all 0.1s ease',
                  opacity: isDisabled ? 0.5 : 1,
                  '&:hover': !isDisabled && {
                    borderColor: color,
                    borderBottomColor: color,
                    backgroundColor: alpha(color, 0.05),
                  },
                  '&:active': !isDisabled && {
                    borderBottomWidth: '0px',
                    transform: 'translateY(4px)',
                    mb: '4px'
                  }
                }}
              >
                <CardActionArea
                  onClick={() => handleGenerate(topic)}
                  disabled={!!loadingTopic}
                  sx={{ borderRadius: 4, height: '100%', p: 1 }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      py: 3,
                      px: 2,
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={36} sx={{ color, mb: 1 }} thickness={4} />
                    ) : (
                      <Typography sx={{ fontSize: 40, lineHeight: 1, mb: 0.5 }}>{emoji}</Typography>
                    )}
                    <Typography
                      sx={{ fontWeight: 900, color: '#4B4B4B', textAlign: 'center', fontSize: '1.05rem' }}
                    >
                      {label.toUpperCase()}
                    </Typography>
                    {isLoading && (
                      <Typography sx={{ fontWeight: 800, color, fontSize: '0.8rem', mt: -0.5 }}>
                        ĐANG TẠO...
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {variant !== 'create' && (
        <Box
          sx={{
            mt: 5,
            borderBottom: '2px solid #E5E5E5',
          }}
        />
      )}
    </Box>
  );
}
