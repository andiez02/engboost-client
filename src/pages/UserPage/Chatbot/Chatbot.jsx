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
  Grow,
} from '@mui/material';
import {
  Send,
  Bot,
  Copy,
  RefreshCw,
  Zap,
} from 'lucide-react';
import Sidebar from '../../../components/Layout/SideBar';
import HeaderUser from '../../../components/Layout/HeaderUser';
import { gamify, btn3d } from '../../../theme';

function ChatbotPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      text: 'Xin chào! Tớ là trợ lý rùa AI thông minh của cậu đây.\nHôm nay cậu muốn học từ vựng hay luyện ngữ pháp nào?',
      sender: 'bot',
      time: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const messagesEndRef = useRef(null);
  const currentUser = useSelector(selectCurrentUser);
  const inputRef = useRef(null);

  const suggestions = [
    'Giúp tớ phân biệt "lay" và "lie" nhé!',
    'Hôm nay học từ vựng chủ đề Động vật đi.',
    'Chữa lỗi ngữ pháp trong câu "I has went to school" giúp tớ.',
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length > 1) {
      setShowSuggestions(false);
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

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
          'Xin lỗi, tớ đang bận chút việc, cậu nói lại nhé!',
        sender: 'bot',
        time: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: 'Lỗi rồi! Dây mạng nhà tớ bị đứt hay sao á 😭',
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
        text: 'Xin chào! Tớ là trợ lý rùa AI thông minh của cậu đây.\nHôm nay cậu muốn học từ vựng hay luyện ngữ pháp nào?',
        sender: 'bot',
        time: new Date(),
      },
    ]);
    setShowSuggestions(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setTimeout(() => {
      // Simulate enter press or trigger submit directly
      if (inputRef.current) {
        inputRef.current.value = suggestion; 
        const fakeEvent = { preventDefault: () => {} };
        // We defer sending just a bit to allow input state to register
      }
    }, 50);
  };
  
  // Actually we need an effect or wrapper to send immediately after clicking suggestion:
  const sendClickedSuggestion = (suggestion) => {
    setInputMessage(suggestion);
    // Let state update before we fire off
    setTimeout(() => {
      const triggerSend = async () => {
        setIsLoading(true);
        const userMsg = { text: suggestion, sender: 'user', time: new Date() };
        setMessages((prev) => [...prev, userMsg]);
        setInputMessage('');
        try {
          const res = await sendChatMessageAPI(suggestion);
          setMessages((prev) => [...prev, { text: res.data.reply, sender: 'bot', time: new Date() }]);
        } catch (e) {
          setMessages((prev) => [...prev, { text: 'Lỗi mạng rồi.', sender: 'bot', time: new Date() }]);
        } finally {
          setIsLoading(false);
        }
      };
      triggerSend();
    }, 0);
  };

  const formatTime = (date) => format(new Date(date), 'HH:mm');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className="flex overflow-hidden h-screen"
      style={{ backgroundColor: gamify.surface }}
    >
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-58' : 'ml-20'}`}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            bgcolor: gamify.surface,
          }}
        >
          <HeaderUser isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

          {/* Header Action Bar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: '60px', 
              px: { xs: 2, md: 4 },
              pt: 2,
              pb: 2,
              borderBottom: `2px solid ${gamify.gray}`,
              bgcolor: gamify.white,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  mr: 2,
                  bgcolor: gamify.white,
                  border: `2px solid ${gamify.gray}`,
                  borderBottom: `4px solid ${gamify.grayDark}`,
                  color: gamify.text,
                }}
              >
                <Bot size={28} />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color: gamify.text,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                AI Tutor
                <Zap
                  size={20}
                  style={{
                    marginLeft: 8,
                    color: gamify.xp,
                  }}
                />
              </Typography>
            </Box>

            <Tooltip title="Làm mới cuộc trò chuyện">
              <Box
                component="button"
                onClick={resetConversation}
                sx={{
                  ...btn3d(gamify.white, gamify.grayDark),
                  color: gamify.text,
                  border: `2px solid ${gamify.gray}`,
                  borderBottom: `4px solid ${gamify.grayDark}`,
                  p: 1.5,
                  minWidth: 'auto',
                }}
              >
                <RefreshCw size={20} />
              </Box>
            </Tooltip>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: { xs: 2, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              bgcolor: gamify.surface,
            }}
          >
            <Box sx={{ maxWidth: 860, width: '100%', mx: 'auto' }}>
              {messages.map((message, index) => (
                <Grow
                  in={true}
                  key={index}
                  timeout={400}
                  style={{ transformOrigin: message.sender === 'user' ? 'right center' : 'left center' }}
                >
                  <Box
                    sx={{
                      mb: 4,
                      display: 'flex',
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      position: 'relative',
                    }}
                  >
                    {/* Character Avatar */}
                    {message.sender === 'bot' ? (
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          mb: 1,
                          bgcolor: gamify.white,
                          border: `2px solid ${gamify.gray}`,
                          color: gamify.text,
                        }}
                      >
                        <Bot size={28} />
                      </Avatar>
                    ) : (
                      <Avatar
                        src={currentUser?.user?.avatar}
                        sx={{
                          width: 48,
                          height: 48,
                          mb: 1,
                          bgcolor: gamify.blueBg,
                          border: `2px solid ${gamify.blueDark}`,
                          color: gamify.blue,
                        }}
                      />
                    )}

                    {/* Speech Bubble Padding spacer */}
                    <Box sx={{ width: 16 }} />

                    {/* Speech Bubble */}
                    <Box
                      sx={{
                        maxWidth: '75%',
                        position: 'relative',
                        '&:hover .message-actions': { opacity: 1 },
                      }}
                    >
                      {/* Name Tag */}
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mb: 0.5,
                          fontWeight: 800,
                          color: message.sender === 'bot' ? gamify.text : gamify.blue,
                          textAlign: message.sender === 'user' ? 'right' : 'left',
                        }}
                      >
                        {message.sender === 'bot' ? 'Gia sư Rùa AI' : (currentUser?.user?.username || 'Bạn')}
                      </Typography>

                      {/* Bubble Body */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 4,
                          position: 'relative',
                          bgcolor: message.sender === 'bot' ? gamify.white : gamify.blue,
                          border: `2px solid ${
                            message.sender === 'bot' ? gamify.gray : gamify.blueDark
                          }`,
                          borderBottom: `4px solid ${
                            message.sender === 'bot' ? gamify.grayDark : gamify.blueDark
                          }`,
                          color: message.sender === 'bot' ? gamify.text : gamify.white,
                          // The tail of dialog
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            bottom: 12,
                            [message.sender === 'bot' ? 'left' : 'right']: -8,
                            width: 14,
                            height: 14,
                            bgcolor: message.sender === 'bot' ? gamify.white : gamify.blue,
                            borderLeft: message.sender === 'bot' ? `2px solid ${gamify.gray}` : 'none',
                            borderBottom: message.sender === 'bot' ? `2px solid ${gamify.gray}` : 'none',
                            borderRight: message.sender === 'user' ? `2px solid ${gamify.blueDark}` : 'none',
                            borderTop: message.sender === 'user' ? `2px solid ${gamify.blueDark}` : 'none',
                            transform: message.sender === 'bot' ? 'rotate(45deg)' : 'rotate(45deg)',
                            zIndex: 0,
                          },
                        }}
                      >
                        {/* Text Content */}
                        <Box sx={{ position: 'relative', zIndex: 1, letterSpacing: 0.3 }}>
                          {message.sender === 'bot' ? (
                            <Box className="markdown-body gamify-markdown">
                              <ReactMarkdown>{message.text}</ReactMarkdown>
                            </Box>
                          ) : (
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                whiteSpace: 'pre-line',
                                lineHeight: 1.6,
                              }}
                            >
                              {message.text}
                            </Typography>
                          )}
                        </Box>

                        {/* Copy Action */}
                        <Box
                          className="message-actions"
                          sx={{
                            position: 'absolute',
                            top: -16,
                            [message.sender === 'bot' ? 'right' : 'left']: 16,
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            zIndex: 10,
                          }}
                        >
                          <Tooltip title="Sao chép">
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(message.text)}
                              sx={{
                                bgcolor: gamify.white,
                                border: `2px solid ${gamify.gray}`,
                                color: gamify.text,
                                '&:hover': { bgcolor: gamify.gray },
                              }}
                            >
                              <Copy size={14} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Paper>

                      {/* Time */}
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 1,
                          color: gamify.sub,
                          fontWeight: 600,
                          textAlign: message.sender === 'user' ? 'right' : 'left',
                        }}
                      >
                        {formatTime(message.time)}
                      </Typography>
                    </Box>
                  </Box>
                </Grow>
              ))}

              {/* Loading Indicator Bubble */}
              {isLoading && (
                <Grow in={true} timeout={300}>
                  <Box
                    sx={{
                      mb: 4,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        mb: 1,
                        bgcolor: gamify.white,
                        border: `2px solid ${gamify.gray}`,
                        color: gamify.text,
                      }}
                    >
                      <Bot size={28} />
                    </Avatar>
                    <Box sx={{ width: 16 }} />
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 4,
                        bgcolor: gamify.white,
                        border: `2px solid ${gamify.gray}`,
                        borderBottom: `4px solid ${gamify.grayDark}`,
                        position: 'relative',
                        minWidth: 100,
                        display: 'flex',
                        justifyContent: 'center',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          bottom: 12,
                          left: -8,
                          width: 14,
                          height: 14,
                          bgcolor: gamify.white,
                          borderLeft: `2px solid ${gamify.gray}`,
                          borderBottom: `2px solid ${gamify.gray}`,
                          transform: 'rotate(45deg)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {[0, 1, 2].map((i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              bgcolor: gamify.grayDark,
                              animation: 'bounce 1.2s infinite ease-in-out',
                              animationDelay: `${i * 0.2}s`,
                              '@keyframes bounce': {
                                '0%, 100%': { transform: 'translateY(0)' },
                                '50%': { transform: 'translateY(-6px)' },
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                </Grow>
              )}

              {/* Suggestions */}
              {showSuggestions && messages.length === 1 && (
                <Box sx={{ mt: 2, mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', ml: { xs: 0, sm: '64px' } }}>
                  {suggestions.map((suggestion, index) => (
                    <Box
                      key={index}
                      component="button"
                      onClick={() => sendClickedSuggestion(suggestion)}
                      sx={{
                        ...btn3d(gamify.white, gamify.grayDark),
                        color: gamify.blue,
                        border: `2px solid ${gamify.gray}`,
                        borderBottom: `4px solid ${gamify.grayDark}`,
                        px: 3,
                        py: 2,
                        textAlign: 'left',
                        whiteSpace: 'normal',
                        fontWeight: 700,
                        letterSpacing: 0.2,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        '&:hover': {
                          bgcolor: gamify.blueBg,
                          borderColor: gamify.blue,
                        },
                      }}
                    >
                      {suggestion}
                    </Box>
                  ))}
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Box>
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              borderTop: `2px solid ${gamify.gray}`,
              bgcolor: gamify.white,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              component="form"
              onSubmit={handleSendMessage}
              sx={{
                display: 'flex',
                gap: 2,
                width: '100%',
                maxWidth: 860,
                alignItems: 'flex-end',
              }}
            >
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Hỏi tớ bài tập tiếng Anh nào..."
                inputRef={inputRef}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    bgcolor: gamify.surface,
                    fontWeight: 600,
                    px: 2,
                    py: 1.5,
                    border: `2px solid ${gamify.gray}`,
                    borderBottom: `4px solid ${gamify.grayDark}`,
                    transition: 'all 0.1s',
                    '& fieldset': { border: 'none' },
                    '&:focus-within': {
                      border: `2px solid ${gamify.blueDark}`,
                      borderBottom: `4px solid ${gamify.blueDark}`,
                      bgcolor: gamify.white,
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
              <Box
                component="button"
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                sx={{
                  ...btn3d(gamify.blue, gamify.blueDark),
                  minWidth: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  flexShrink: 0,
                  pb: '4px', // text visual alignment
                }}
              >
                <Send size={24} strokeWidth={2.5} />
              </Box>
            </Box>
          </Box>
        </Box>
      </div>

      {/* Global CSS for Markdown in Gamify Style */}
      <style jsx global>{`
        .gamify-markdown {
          font-family: 'Nunito', 'Inter', sans-serif;
          font-weight: 600;
          color: ${gamify.text};
        }
        .gamify-markdown p {
          margin: 0.5em 0;
        }
        .gamify-markdown strong {
          color: ${gamify.blueDark};
          font-weight: 800;
        }
        .gamify-markdown em {
          color: ${gamify.red};
          font-weight: 700;
          font-style: italic;
        }
        .gamify-markdown h1, .gamify-markdown h2, .gamify-markdown h3 {
          color: ${gamify.blueDark};
          font-weight: 900;
          margin: 1em 0 0.5em;
        }
        .gamify-markdown ul, .gamify-markdown ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .gamify-markdown li {
          margin: 0.2em 0;
        }
        .gamify-markdown code {
          background-color: ${gamify.surface};
          color: ${gamify.redDark};
          padding: 0.2em 0.5em;
          border-radius: 6px;
          border: 1px solid ${gamify.gray};
          font-weight: 700;
          font-size: 0.9em;
        }
        .gamify-markdown pre {
          background-color: ${gamify.surface};
          border: 2px solid ${gamify.gray};
          border-radius: 12px;
          padding: 1em;
          overflow-x: auto;
          margin: 1em 0;
        }
        .gamify-markdown pre code {
          background: none;
          border: none;
          padding: 0;
          color: ${gamify.text};
        }
        .gamify-markdown blockquote {
          border-left: 4px solid ${gamify.blue};
          background-color: ${gamify.blueBg};
          padding: 0.5em 1em;
          margin: 1em 0;
          border-radius: 8px;
          color: ${gamify.blueDark};
        }
      `}</style>
    </div>
  );
}

export default ChatbotPage;
