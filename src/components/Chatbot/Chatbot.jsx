import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Container,
  Divider,
  Avatar,
  List,
  ListItem,
  IconButton,
} from '@mui/material';
import { Send, History, Person, SmartToy } from '@mui/icons-material';
import { sendChatMessageAPI } from '../../apis';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [displayedResponse, setDisplayedResponse] = useState('');

  // Typing effect
  useEffect(() => {
    if (
      displayedResponse &&
      displayedResponse.length === messages[messages.length - 1]?.content.length
    ) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], content: displayedResponse },
      ]);
    }
  }, [displayedResponse, messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);

    try {
      const result = await sendChatMessageAPI(input);
      const responseText = result?.data?.reply || '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      // Typing effect
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedResponse((prev) => {
          const newText = prev + responseText[index];
          if (index >= responseText.length - 1) {
            clearInterval(interval);
            setHistory((prevHistory) => [
              ...prevHistory,
              { question: input, answer: responseText },
            ]);
          }
          index++;
          return newText;
        });
      }, 20);
    } catch (error) {
      console.log(error);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xl mt-10"
      sx={{
        height: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
        p: 0,
      }}
    >
      {/* History Sidebar */}
      <Paper
        sx={{
          width: 300,
          height: '100%',
          borderRadius: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography
            variant="h6"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <History sx={{ mr: 1 }} /> Lịch sử
          </Typography>
        </Box>
        <List sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
          {history.map((item, index) => (
            <ListItem key={index} button sx={{ py: 1.5 }}>
              <Typography noWrap sx={{ fontSize: 14 }}>
                {item.question}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Messages Container */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            bgcolor: 'rgba(0, 0, 0, 0.02)',
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                mb: 2,
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
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <SmartToy />
                  </Avatar>
                )}

                <Paper
                  sx={{
                    p: 2,
                    bgcolor:
                      message.role === 'user'
                        ? 'primary.main'
                        : 'background.paper',
                    color:
                      message.role === 'user' ? 'common.white' : 'text.primary',
                    borderRadius:
                      message.role === 'user'
                        ? '18px 18px 4px 18px'
                        : '18px 18px 18px 4px',
                  }}
                >
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.role === 'assistant' &&
                    index === messages.length - 1
                      ? displayedResponse
                      : message.content}
                  </Typography>
                </Paper>

                {message.role === 'user' && (
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <Person />
                  </Avatar>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Input Area */}
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            borderRadius: 0,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, maxWidth: 1200, mx: 'auto' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 25,
                  bgcolor: 'background.paper',
                },
              }}
            />

            <IconButton
              type="submit"
              color="primary"
              disabled={!input.trim() || loading}
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Send />
              )}
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Chatbot;
