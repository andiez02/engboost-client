import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  ButtonBase,
  CircularProgress,
  TextField,
  alpha,
} from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { toast } from 'react-toastify';
import authorizedAxiosInstance from '../../../../../utils/authorizedAxios';
import { API_ROOT } from '../../../../../utils/constants';
import { gamify } from '../../../../../theme';

const TOPICS = [
  { label: 'Food',        emoji: '🍜', topic: 'food',        color: '#f97316' },
  { label: 'Travel',      emoji: '✈️',  topic: 'travel',      color: '#3b82f6' },
  { label: 'Work',        emoji: '💼', topic: 'work',        color: '#8b5cf6' },
  { label: 'Daily Life',  emoji: '🏠', topic: 'daily life',  color: '#58CC02' },
  { label: 'Technology',  emoji: '💻', topic: 'technology',  color: '#06b6d4' },
  { label: 'Health',      emoji: '🏃', topic: 'health',      color: '#10b981' },
];

const MAX_CUSTOM_TOPIC_WORDS = 6;

const countWords = (value) =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

export default function GenerateDeck({ variant = 'discover' }) {
  const navigate = useNavigate();
  const [loadingTopic, setLoadingTopic] = useState(null);
  const [customTopic, setCustomTopic] = useState('');

  const handleGenerate = async (topic) => {
    const normalizedTopic = topic.trim();
    if (loadingTopic || !normalizedTopic) return;
    setLoadingTopic(topic);
    try {
      const res = await authorizedAxiosInstance.post(`${API_ROOT}/decks/generate`, {
        topic: normalizedTopic,
        level: 'beginner',
        count: 10,
      });
      const { folderId } = res.data.data;
      toast.success(`Deck "${normalizedTopic}" created! Starting study session...`);
      navigate(`/study?folderId=${folderId}`);
    } catch {
      // errors are handled globally by the axios interceptor
    } finally {
      setLoadingTopic(null);
    }
  };

  const handleCustomTopicChange = (event) => {
    const nextValue = event.target.value.replace(/\s+/g, ' ').replace(/^\s/, '');

    if (countWords(nextValue) <= MAX_CUSTOM_TOPIC_WORDS) {
      setCustomTopic(nextValue);
    }
  };

  const handleCustomGenerate = () => {
    const normalizedTopic = customTopic.trim();

    if (!normalizedTopic) {
      toast.info('Nhập chủ đề bạn muốn tạo trước nhé.');
      return;
    }

    handleGenerate(normalizedTopic);
  };

  const customWordCount = countWords(customTopic);

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
            sx={{ fontWeight: 700, color: gamify.sub, mb: 3, maxWidth: 560, fontSize: '0.95rem' }}
          >
            Chọn một chủ đề có sẵn hoặc nhập chủ đề riêng, hệ thống sẽ tạo 10 flashcards bằng AI và đưa bạn vào buổi học ngay.
          </Typography>
        </>
      )}

      <Grid container spacing={2}>
        {TOPICS.map(({ label, emoji, topic, color }) => {
          const isLoading = loadingTopic === topic;
          const isDisabled = !!loadingTopic && !isLoading;

          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={topic}>
              <ButtonBase
                onClick={() => handleGenerate(topic)}
                disabled={!!loadingTopic}
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  textAlign: 'left',
                  borderRadius: 4,
                  border: `2px solid ${alpha(color, 0.4)}`,
                  borderBottom: `4px solid ${alpha(color, 0.5)}`,
                  backgroundColor: '#fff',
                  boxShadow: 'none',
                  transition: 'all 0.1s ease',
                  opacity: isDisabled ? 0.5 : 1,
                  overflow: 'hidden',
                  '&:hover': !isDisabled ? {
                    borderColor: color,
                    borderBottomColor: color,
                    backgroundColor: alpha(color, 0.05),
                  } : undefined,
                  '&:active': !isDisabled ? {
                    borderBottomWidth: '0px',
                    transform: 'translateY(4px)',
                  } : undefined,
                  '&.Mui-disabled': {
                    color: 'inherit',
                  },
                }}
              >
                <Box
                  sx={{
                    minHeight: 176,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.25,
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={34} sx={{ color }} thickness={4.5} />
                      ) : (
                        <Typography sx={{ fontSize: 40, lineHeight: 1 }}>{emoji}</Typography>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: gamify.text,
                        textAlign: 'center',
                        fontSize: '1rem',
                        lineHeight: 1.2,
                        minHeight: 38,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {label.toUpperCase()}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      minHeight: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: isLoading ? color : gamify.sub,
                        fontSize: '0.76rem',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {isLoading ? 'ĐANG TẠO...' : '10 FLASHCARDS'}
                    </Typography>
                  </Box>
                </Box>
              </ButtonBase>
            </Grid>
          );
        })}

        <Grid item xs={12} md={6} lg={4}>
          <Box
            sx={{
              height: '100%',
              minHeight: 176,
              borderRadius: 4,
              border: `2px dashed ${alpha(gamify.blue, 0.4)}`,
              borderBottom: `4px solid ${alpha(gamify.blue, 0.5)}`,
              backgroundColor: alpha(gamify.blue, 0.03),
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease',
              '&:hover': {
                borderColor: gamify.blue,
                borderBottomColor: gamify.blueDark,
                backgroundColor: alpha(gamify.blue, 0.06),
              },
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AutoAwesome sx={{ color: gamify.blue, fontSize: 22 }} />
                <Typography
                  sx={{ fontWeight: 900, color: gamify.text, fontSize: '0.98rem' }}
                >
                  CUSTOM TOPIC
                </Typography>
              </Box>

              <Typography
                sx={{ fontWeight: 700, color: gamify.sub, fontSize: '0.82rem', mb: 1.5 }}
              >
                Nhập chủ đề riêng của bạn. Tối đa {MAX_CUSTOM_TOPIC_WORDS} từ.
              </Typography>

              <TextField
                fullWidth
                size="small"
                placeholder="Ví dụ: business english meeting"
                value={customTopic}
                onChange={handleCustomTopicChange}
                disabled={!!loadingTopic}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleCustomGenerate();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: '#fff',
                    fontWeight: 700,
                    '& fieldset': {
                      borderColor: alpha(gamify.blue, 0.25),
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(gamify.blue, 0.45),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: gamify.blue,
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                mt: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Typography sx={{ fontSize: '0.76rem', fontWeight: 800, color: gamify.sub }}>
                {customWordCount}/{MAX_CUSTOM_TOPIC_WORDS} từ
              </Typography>

              <ButtonBase
                onClick={handleCustomGenerate}
                disabled={!!loadingTopic || !customTopic.trim()}
                sx={{
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 3,
                  border: `2px solid ${gamify.blue}`,
                  borderBottom: `4px solid ${gamify.blueDark}`,
                  bgcolor: gamify.blue,
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '0.76rem',
                  letterSpacing: '0.05em',
                  '&:hover': {
                    bgcolor: gamify.blue,
                  },
                  '&:active': {
                    transform: 'translateY(4px)',
                    borderBottomWidth: '0px',
                  },
                  '&.Mui-disabled': {
                    bgcolor: gamify.gray,
                    borderColor: gamify.gray,
                    borderBottomColor: gamify.grayDark,
                    color: gamify.sub,
                  },
                }}
              >
                {loadingTopic === customTopic.trim() ? 'ĐANG TẠO...' : 'TẠO DECK'}
              </ButtonBase>
            </Box>
          </Box>
        </Grid>
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
