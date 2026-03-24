import React, { useRef, useEffect, useMemo, useCallback, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  TextField,
  useTheme,
  Card,
  Chip,
  IconButton,
  alpha,
} from '@mui/material';
import {
  School as SchoolIcon,
  Translate as TranslateIcon,
  Psychology as PsychologyIcon,
  SportsKabaddi as PracticeIcon,
  SmartToy as SmartToyIcon,
  Person as PersonIcon,
  Send as SendIcon,
  KeyboardArrowDown as ScrollIcon,
} from '@mui/icons-material';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import Lottie from 'lottie-react';
import chatbotAnimation from '../../assets/lotties/chatbot-animation.json';
import { routes } from '../../utils/constants';
import { colors } from '../../theme';

// Move static data outside component to avoid re-creation on every render
const SAMPLE_CONVERSATION = [
  {
    role: 'user',
    content: 'What\'s the difference between "affect" and "effect"?',
  },
  {
    role: 'assistant',
    content:
      'Great question! 👍\n\n"Affect" is usually a verb meaning "to influence": The weather affects my mood.\n\n"Effect" is typically a noun meaning "result": The medicine had a positive effect.\n\nRemember: A for Action (Affect = Verb), E for End result (Effect = Noun).',
  },
];

const FEATURES = [
  /* ... stay same ... */
];

// Memoized Feature Card for better performance
const FeatureCard = memo(({ feature, index }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 4,
        p: 4,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-12px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          borderColor: alpha(feature.color, 0.4),
        },
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          p: 2,
          borderRadius: 3,
          mb: 3,
          color: feature.color,
          bgcolor: alpha(feature.color, 0.1),
        }}
      >
        {feature.icon}
      </Box>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5 }}>
        {feature.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        {feature.description}
      </Typography>
    </Card>
  </Grid>
));

const ChatbotIntro = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const chatContainerRef = useRef(null);
  const featureSectionRef = useRef(null);
  const [isAnimationReady, setIsAnimationReady] = useState(false);

  // Defer animation playback to avoid lag during initial transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleStartChat = useCallback(() => {
    navigate(routes.CHATBOT);
  }, [navigate]);

  const scrollToFeatures = useCallback(() => {
    featureSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Correct Lottie renderer settings
  const lottieRendererSettings = useMemo(() => ({
    preserveAspectRatio: 'xMidYMid slice',
  }), []);

  return (
    <Box sx={{ bgcolor: colors.sand, minHeight: '100vh' }}>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          pt: 12,
          pb: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage:
              'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="AI-Powered Learning"
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 500,
                  '& .MuiChip-label': { px: 2 },
                }}
              />

              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.75rem' } }}
              >
                Học tiếng Anh thông minh với EngBoost AI
              </Typography>

              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.9, fontWeight: 'normal' }}
              >
                Trợ lý AI thông minh giúp bạn nâng cao kỹ năng tiếng Anh thông
                qua các cuộc hội thoại tự nhiên, giải thích ngữ pháp và từ vựng
                một cách dễ hiểu.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={handleStartChat}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: '1rem',
                    bgcolor: 'white',
                    color: 'primary.main',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  Bắt đầu trò chuyện
                </Button>

                <Button
                  variant="outlined"
                  onClick={scrollToFeatures}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Tìm hiểu thêm
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
              <Paper
                elevation={6}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  height: 500,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  transform: { md: 'perspective(1000px) rotateY(-5deg)' },
                  willChange: 'transform',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: { md: 'perspective(1000px) rotateY(0deg)' },
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'primary.dark',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}
                  >
                    <SmartToyIcon />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="medium">
                    EngBoost AI Assistant
                  </Typography>
                </Box>

                <Box
                  ref={chatContainerRef}
                  sx={{
                    flex: 1,
                    p: 2,
                    overflowY: 'auto',
                    bgcolor: '#f8f9fa',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        mr: 1.5,
                        width: 36,
                        height: 36,
                      }}
                    >
                      <SmartToyIcon fontSize="small" />
                    </Avatar>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: 'white',
                        borderRadius: '16px 16px 16px 0',
                        maxWidth: '80%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Typography variant="body2">
                        Xin chào! Tôi là trợ lý học tiếng Anh của EngBoost. 👋
                        <br />
                        <br />
                        Tôi có thể giúp bạn:
                        <br />• Học từ vựng mới
                        <br />• Giải thích ngữ pháp
                        <br />• Dịch thuật chính xác
                        <br />• Luyện tập hội thoại
                      </Typography>
                    </Paper>
                  </Box>

                  {SAMPLE_CONVERSATION.map((message, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent:
                          message.role === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5,
                          maxWidth: '80%',
                        }}
                      >
                        {message.role === 'assistant' && (
                          <Avatar
                            sx={{
                              bgcolor: colors.sage,
                              width: 36,
                              height: 36,
                            }}
                          >
                            <SmartToyIcon fontSize="small" />
                          </Avatar>
                        )}

                        <Paper
                          sx={{
                            p: 2,
                            bgcolor:
                              message.role === 'user'
                                ? colors.sage
                                : 'white',
                            color:
                              message.role === 'user'
                                ? 'white'
                                : colors.dark,
                            borderRadius:
                              message.role === 'user'
                                ? '16px 16px 0 16px'
                                : '16px 16px 16px 0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ whiteSpace: 'pre-wrap' }}
                          >
                            {message.content}
                          </Typography>
                        </Paper>

                        {message.role === 'user' && (
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.secondary.main,
                              width: 36,
                              height: 36,
                            }}
                          >
                            <PersonIcon fontSize="small" />
                          </Avatar>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'white',
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Nhập câu hỏi của bạn..."
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />
                  <IconButton
                    color="primary"
                    sx={{
                      ml: 1,
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                    onClick={handleStartChat}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <IconButton
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)',
            },
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': {
                transform: 'translateX(-50%) translateY(0)',
              },
              '40%': {
                transform: 'translateX(-50%) translateY(-10px)',
              },
              '60%': {
                transform: 'translateX(-50%) translateY(-5px)',
              },
            },
          }}
          onClick={scrollToFeatures}
        >
          <ScrollIcon />
        </IconButton>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }} ref={featureSectionRef}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip label="Tính năng nổi bật" color="primary" sx={{ mb: 2, fontWeight: 'bold' }} />
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
            Học tiếng Anh hiệu quả với AI
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto', fontSize: '1.1rem' }}
          >
            EngBoost AI cung cấp các công cụ thông minh giúp bạn học tiếng Anh
            nhanh chóng và hiệu quả
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 10 }}>
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </Grid>

        {/* Lottie Animation Section / High Performance Opt */}
        <Box sx={{ mb: 10 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                height: { xs: 300, md: 450 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {isAnimationReady ? (
                  <Lottie
                    animationData={chatbotAnimation}
                    loop={true}
                    autoplay={true}
                    rendererSettings={lottieRendererSettings}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <Box sx={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: '50%', 
                    bgcolor: alpha(colors.sage, 0.1),
                    animation: 'pulse 2s infinite ease-in-out',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 0.5, transform: 'scale(0.95)' },
                      '50%': { opacity: 1, transform: 'scale(1.05)' }
                    }
                  }} />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Chip
                label="AI Conversation"
                color="primary"
                size="small"
                sx={{ mb: 2, fontWeight: 'bold' }}
              />
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 3 }}>
                Trò chuyện tự nhiên với AI
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7 }}>
                EngBoost AI hiểu được ngữ cảnh và ý định của bạn, tạo ra các
                cuộc hội thoại tự nhiên giúp bạn cải thiện kỹ năng giao tiếp
                tiếng Anh một cách hiệu quả.
              </Typography>

              <Box sx={{ mb: 4 }}>
                {[
                  'Phản hồi thông minh và tự nhiên',
                  'Hiểu được ngữ cảnh và ý định của người dùng',
                  'Điều chỉnh độ khó phù hợp với trình độ',
                  'Sửa lỗi ngữ pháp và phát âm',
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        color: 'white',
                        mr: 2,
                        flexShrink: 0
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant="body1" fontWeight="500">{item}</Typography>
                  </Box>
                ))}
              </Box>

              <Button
                variant="contained"
                onClick={handleStartChat}
                size="large"
                sx={{
                  py: 1.5,
                  px: 5,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                }}
              >
                Bắt đầu trò chuyện
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 6, md: 10 },
            textAlign: 'center',
            borderRadius: 6,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage:
                'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <Typography variant="h3" fontWeight="bold" sx={{ mb: 3 }}>
            Sẵn sàng nâng cao kỹ năng tiếng Anh?
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 5, opacity: 0.9, maxWidth: 800, mx: 'auto', fontWeight: 'normal', lineHeight: 1.6 }}
          >
            Bắt đầu trò chuyện với EngBoost AI ngay hôm nay và trải nghiệm cách
            học tiếng Anh hiệu quả, thú vị và cá nhân hóa.
          </Typography>
          <Button
            variant="contained"
            onClick={handleStartChat}
            size="large"
            sx={{
              py: 2,
              px: 6,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: '1.1rem',
              bgcolor: 'white',
              color: 'primary.main',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.95)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
            }}
          >
            Bắt đầu ngay miễn phí
          </Button>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default ChatbotIntro;
