import { useState, useRef, useEffect } from 'react';
import { sendChatMessageAPI } from '../../../apis';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/user/userSlice';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import {
  Avatar,
  TextField,
  IconButton,
  Typography,
  Box,
  Paper,
  Tooltip,
  Chip,
  Fade,
  Zoom,
  useTheme,
  alpha,
  Grow,
  LinearProgress,
} from '@mui/material';
import {
  Send,
  Bot,
  Sparkles,
  Copy,
  Lightbulb,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Zap,
  BookOpen,
  Mic,
  Rocket,
  Brain,
} from 'lucide-react';
import Sidebar from '../../../components/Layout/SideBar';
import HeaderUser from '../../../components/Layout/HeaderUser';

function ChatbotPage() {
  const theme = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      text: 'Xin chào! Tôi là trợ lý học tiếng Anh của bạn. Bạn cần giúp đỡ gì?',
      sender: 'bot',
      time: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [typingEffect, setTypingEffect] = useState('');
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);

  const messagesEndRef = useRef(null);
  const currentUser = useSelector(selectCurrentUser);
  const inputRef = useRef(null);

  const suggestions = [
    {
      text: 'Giải thích cách sử dụng thì hiện tại hoàn thành',
      icon: <BookOpen size={16} />,
    },
    { text: "Cách phát âm từ 'entrepreneur'", icon: <Mic size={16} /> },
    { text: 'Từ vựng về chủ đề công nghệ', icon: <Rocket size={16} /> },
  ];

  // Hiệu ứng đánh máy cho tin nhắn chào mừng
  useEffect(() => {
    if (showWelcomeAnimation && messages.length === 1) {
      const text = messages[0].text;
      // Chuyển chuỗi thành mảng các ký tự Unicode đầy đủ
      const characters = [...text];
      let i = 0;
      setTypingEffect('');

      const typingInterval = setInterval(() => {
        if (i < characters.length) {
          setTypingEffect((prev) => prev + characters[i]);
          i++;
        } else {
          clearInterval(typingInterval);
          setShowWelcomeAnimation(false);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    }
  }, [showWelcomeAnimation, messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingEffect]);

  useEffect(() => {
    // Ẩn gợi ý khi người dùng đã gửi tin nhắn
    if (messages.length > 1) {
      setShowSuggestions(false);
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      time: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessageAPI(inputMessage);

      const botMessage = {
        text:
          response.data.reply ||
          'Xin lỗi, tôi không hiểu câu hỏi của bạn. Vui lòng thử lại.',
        sender: 'bot',
        time: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: 'Đã xảy ra lỗi khi kết nối với trợ lý. Vui lòng thử lại sau.',
        sender: 'bot',
        time: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        text: 'Xin chào! Tôi là trợ lý học tiếng Anh của bạn. Bạn cần giúp đỡ gì?',
        sender: 'bot',
        time: new Date(),
      },
    ]);
    setShowSuggestions(true);
    setShowWelcomeAnimation(true);

    // Focus vào input sau khi reset
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const formatTime = (date) => {
    return format(new Date(date), 'HH:mm');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Có thể thêm thông báo toast ở đây
  };

  // Tạo gradient ngẫu nhiên cho avatar người dùng nếu không có avatar
  const getRandomGradient = () => {
    const gradients = [
      'linear-gradient(45deg, #FF9A8B, #FF6A88)',
      'linear-gradient(45deg, #FBDA61, #FF5ACD)',
      'linear-gradient(45deg, #4158D0, #C850C0)',
      'linear-gradient(45deg, #0093E9, #80D0C7)',
      'linear-gradient(45deg, #8EC5FC, #E0C3FC)',
      'linear-gradient(45deg, #85FFBD, #FFFB7D)',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // Hiệu ứng gradient cho nút gửi
  const buttonGradient = 'linear-gradient(45deg, #3b82f6, #2563eb)';

  return (
    <div
      className="flex overflow-hidden h-screen"
      style={{
        backgroundColor: '#f4f6f9',
      }}
    >
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-58' : 'ml-20'
        }`}
      >
        {/* Main chat area */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            bgcolor: 'white',
            borderRadius: { xs: 0, md: 3 },
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            mx: { xs: 0, md: 2 },
            my: { xs: 0, md: 2 },
          }}
        >
          <HeaderUser
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          {/* Header with reset button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: '60px', // Để tránh bị che bởi header
              pt: 2,
              pb: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
              position: 'relative',
              bgcolor: 'white',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '10%',
                width: '80%',
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
              },
            }}
          >
            <Zoom in={true} timeout={800}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 2,
                    bgcolor: theme.palette.primary.main,
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)',
                      },
                      '70%': {
                        boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)',
                      },
                      '100%': {
                        boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)',
                      },
                    },
                  }}
                >
                  <Bot size={24} />
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Trợ lý học tiếng Anh
                  <Zap
                    size={18}
                    style={{
                      marginLeft: 8,
                      color: theme.palette.primary.main,
                      filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))',
                    }}
                  />
                </Typography>
              </Box>
            </Zoom>

            <Tooltip title="Bắt đầu cuộc trò chuyện mới">
              <IconButton
                onClick={resetConversation}
                sx={{
                  ml: 2,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'rotate(180deg)',
                  },
                  transition: 'all 0.5s',
                }}
              >
                <RefreshCw size={20} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Messages area - Chỉ áp dụng background chấm chỉ ở đây */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: { xs: 2, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              bgcolor: alpha(theme.palette.primary.main, 0.01),
              backgroundImage:
                'radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <Box sx={{ maxWidth: 900, width: '100%', mx: 'auto' }}>
              {messages.map((message, index) => (
                <Grow
                  in={true}
                  key={index}
                  timeout={500}
                  style={{
                    transformOrigin:
                      message.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  <Box
                    sx={{
                      mb: 4,
                      display: 'flex',
                      justifyContent:
                        message.sender === 'user' ? 'flex-end' : 'flex-start',
                      position: 'relative',
                    }}
                  >
                    {message.sender === 'bot' && (
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          mr: 2,
                          mt: 0.5,
                          bgcolor: theme.palette.primary.main,
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          border: '2px solid white',
                        }}
                      >
                        <Bot size={24} />
                      </Avatar>
                    )}

                    <Box
                      sx={{
                        maxWidth: '70%',
                        position: 'relative',
                        '&:hover .message-actions': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mb: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent:
                            message.sender === 'user'
                              ? 'flex-end'
                              : 'flex-start',
                          fontWeight: 600,
                        }}
                      >
                        {message.sender === 'bot' ? (
                          <>
                            <span>Trợ lý EngBoost</span>
                            <Sparkles
                              size={16}
                              style={{
                                marginLeft: 8,
                                color: theme.palette.primary.main,
                                filter:
                                  'drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))',
                              }}
                            />
                          </>
                        ) : (
                          currentUser?.user?.username || 'Bạn'
                        )}
                      </Typography>

                      <Paper
                        elevation={message.sender === 'user' ? 6 : 1}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          background:
                            message.sender === 'bot'
                              ? 'white'
                              : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          color:
                            message.sender === 'bot' ? 'text.primary' : 'white',
                          border:
                            message.sender === 'bot' ? '1px solid' : 'none',
                          borderColor: 'divider',
                          position: 'relative',
                          transition: 'all 0.3s',
                          ...(message.sender === 'user'
                            ? {
                                borderTopRightRadius: 0,
                                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                              }
                            : {
                                borderTopLeftRadius: 0,
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                              }),
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow:
                              message.sender === 'user'
                                ? '0 8px 20px rgba(37, 99, 235, 0.4)'
                                : '0 4px 15px rgba(0, 0, 0, 0.08)',
                          },
                        }}
                      >
                        {index === 0 && showWelcomeAnimation ? (
                          <Typography
                            variant="body1"
                            sx={{
                              lineHeight: 1.6,
                              whiteSpace: 'pre-line',
                              minHeight: '24px',
                            }}
                          >
                            {typingEffect}
                            <span className="typing-cursor">|</span>
                          </Typography>
                        ) : message.sender === 'bot' ? (
                          <Box className="markdown-body">
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                          </Box>
                        ) : (
                          <Typography
                            variant="body1"
                            sx={{
                              lineHeight: 1.6,
                              whiteSpace: 'pre-line',
                            }}
                          >
                            {message.text}
                          </Typography>
                        )}

                        <Box
                          className="message-actions"
                          sx={{
                            position: 'absolute',
                            top: -40,
                            right: message.sender === 'bot' ? 8 : 'auto',
                            left: message.sender === 'user' ? 8 : 'auto',
                            opacity: 0,
                            transform: 'translateY(10px)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            gap: 0.5,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            p: 0.5,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                            zIndex: 10,
                          }}
                        >
                          <Tooltip title="Sao chép">
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(message.text)}
                              sx={{
                                '&:hover': {
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s',
                              }}
                            >
                              <Copy size={16} />
                            </IconButton>
                          </Tooltip>

                          {message.sender === 'bot' && (
                            <>
                              <Tooltip title="Hữu ích">
                                <IconButton
                                  size="small"
                                  sx={{
                                    '&:hover': {
                                      bgcolor: alpha(
                                        theme.palette.success.main,
                                        0.1
                                      ),
                                      color: theme.palette.success.main,
                                      transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.2s',
                                  }}
                                >
                                  <ThumbsUp size={16} />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Không hữu ích">
                                <IconButton
                                  size="small"
                                  sx={{
                                    '&:hover': {
                                      bgcolor: alpha(
                                        theme.palette.error.main,
                                        0.1
                                      ),
                                      color: theme.palette.error.main,
                                      transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.2s',
                                  }}
                                >
                                  <ThumbsDown size={16} />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </Paper>

                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          color: 'text.secondary',
                          textAlign:
                            message.sender === 'user' ? 'right' : 'left',
                          fontStyle: 'italic',
                        }}
                      >
                        {formatTime(message.time)}
                      </Typography>
                    </Box>

                    {message.sender === 'user' && (
                      <Avatar
                        src={currentUser?.user?.avatar}
                        sx={{
                          width: 40,
                          height: 40,
                          ml: 2,
                          mt: 0.5,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          border: '2px solid white',
                          background:
                            !currentUser?.user?.avatar && getRandomGradient(),
                        }}
                      />
                    )}
                  </Box>
                </Grow>
              ))}

              {isLoading && (
                <Fade in={true} timeout={300}>
                  <Box
                    sx={{
                      mb: 4,
                      display: 'flex',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        mt: 0.5,
                        bgcolor: theme.palette.primary.main,
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        border: '2px solid white',
                      }}
                    >
                      <Bot size={24} />
                    </Avatar>

                    <Box sx={{ maxWidth: '70%' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 0.5, fontWeight: 600 }}
                      >
                        Trợ lý EngBoost
                      </Typography>

                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          borderTopLeftRadius: 0,
                          bgcolor: 'white',
                          border: '1px solid',
                          borderColor: 'divider',
                          minWidth: 120,
                          minHeight: 60,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 0.8, mb: 1 }}>
                          {[0, 1, 2].map((i) => (
                            <Box
                              key={i}
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: theme.palette.primary.main,
                                opacity: 0.7,
                                animation: 'bounce 1.4s infinite ease-in-out',
                                animationDelay: `${i * 0.2}s`,
                                '@keyframes bounce': {
                                  '0%, 100%': {
                                    transform: 'translateY(0)',
                                  },
                                  '50%': {
                                    transform: 'translateY(-10px)',
                                  },
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                </Fade>
              )}

              {/* Gợi ý câu hỏi */}
              {showSuggestions && messages.length === 1 && (
                <Fade in={true} timeout={800}>
                  <Box sx={{ mt: 4, mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.primary',
                        fontWeight: 600,
                      }}
                    >
                      <Lightbulb
                        size={18}
                        style={{
                          marginRight: 8,
                          color: '#f59e0b',
                          filter:
                            'drop-shadow(0 0 3px rgba(245, 158, 11, 0.5))',
                        }}
                      />
                      Gợi ý câu hỏi
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {suggestions.map((suggestion, index) => (
                        <Grow in={true} key={index} timeout={500 + index * 100}>
                          <Chip
                            icon={suggestion.icon}
                            label={suggestion.text}
                            onClick={() =>
                              handleSuggestionClick(suggestion.text)
                            }
                            sx={{
                              borderRadius: 3,
                              py: 3,
                              px: 1,
                              bgcolor: 'white',
                              border: '1px solid',
                              borderColor: alpha(
                                theme.palette.primary.main,
                                0.3
                              ),
                              '&:hover': {
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.08
                                ),
                                borderColor: theme.palette.primary.main,
                                transform: 'translateY(-3px)',
                                boxShadow:
                                  '0 6px 15px rgba(59, 130, 246, 0.15)',
                              },
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                              fontWeight: 500,
                            }}
                          />
                        </Grow>
                      ))}
                    </Box>
                  </Box>
                </Fade>
              )}

              <div ref={messagesEndRef} />
            </Box>
          </Box>

          {/* Input area */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'white',
              boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '10%',
                width: '80%',
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
              },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSendMessage}
              sx={{
                display: 'flex',
                gap: 1.5,
                maxWidth: 800,
                mx: 'auto',
                position: 'relative',
              }}
            >
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                variant="outlined"
                inputRef={inputRef}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    py: 1.5,
                    px: 2,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s',
                    '&:hover, &.Mui-focused': {
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.15)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '1px',
                    },
                  },
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <Tooltip title="Gửi tin nhắn">
                <IconButton
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  sx={{
                    background: buttonGradient,
                    color: 'white',
                    '&:hover': {
                      background: buttonGradient,
                      opacity: 0.9,
                      transform: 'translateY(-2px)',
                    },
                    '&.Mui-disabled': {
                      background: alpha(theme.palette.primary.main, 0.4),
                      color: 'white',
                    },
                    height: 56,
                    width: 56,
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s',
                  }}
                >
                  <Send size={24} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </div>

      <style jsx global>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .typing-cursor {
          animation: blink 1s infinite;
          font-weight: bold;
        }

        .markdown-body {
          font-family: inherit;
          line-height: 1.6;
        }

        .markdown-body p {
          margin: 0.8em 0;
        }

        .markdown-body strong {
          font-weight: 600;
          color: #3b82f6;
        }

        .markdown-body h1 {
          font-size: 1.5rem;
          margin: 1em 0 0.5em;
          font-weight: 600;
          color: #1e40af;
        }

        .markdown-body h2 {
          font-size: 1.3rem;
          margin: 1em 0 0.5em;
          font-weight: 600;
          color: #1e40af;
        }

        .markdown-body h3 {
          font-size: 1.1rem;
          margin: 1em 0 0.5em;
          font-weight: 600;
          color: #1e40af;
        }

        .markdown-body h4 {
          font-size: 1rem;
          margin: 1em 0 0.5em;
          font-weight: 600;
          color: #1e40af;
        }

        .markdown-body ul,
        .markdown-body ol {
          padding-left: 1.5em;
          margin: 0.8em 0;
        }

        .markdown-body li {
          margin: 0.3em 0;
        }

        .markdown-body li p {
          margin: 0.3em 0;
        }

        .markdown-body code {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.9em;
        }

        .markdown-body pre {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 1em;
          border-radius: 5px;
          overflow-x: auto;
          margin: 0.8em 0;
        }

        .markdown-body blockquote {
          border-left: 3px solid rgba(59, 130, 246, 0.5);
          padding-left: 1em;
          margin: 0.8em 0;
          color: rgba(0, 0, 0, 0.7);
          font-style: italic;
        }

        .markdown-body a {
          color: #3b82f6;
          text-decoration: none;
        }

        .markdown-body a:hover {
          text-decoration: underline;
        }

        .markdown-body table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }

        .markdown-body th,
        .markdown-body td {
          border: 1px solid #e5e7eb;
          padding: 0.5em;
          text-align: left;
        }

        .markdown-body th {
          background-color: rgba(59, 130, 246, 0.1);
          font-weight: 600;
        }

        .markdown-body tr:nth-child(even) {
          background-color: rgba(0, 0, 0, 0.02);
        }

        .markdown-body img {
          max-width: 100%;
          border-radius: 5px;
          margin: 0.8em 0;
        }

        .markdown-body hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 1.5em 0;
        }

        /* Đảm bảo các dấu đầu dòng hiển thị đúng */
        .markdown-body ul {
          list-style-type: disc;
        }

        .markdown-body ol {
          list-style-type: decimal;
        }

        .markdown-body ul ul,
        .markdown-body ol ul {
          list-style-type: circle;
        }

        .markdown-body ul ul ul,
        .markdown-body ol ul ul {
          list-style-type: square;
        }
      `}</style>
    </div>
  );
}

export default ChatbotPage;
