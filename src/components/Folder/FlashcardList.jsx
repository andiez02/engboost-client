import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Delete, Image } from '@mui/icons-material';

const FlashcardList = ({ flashcards, loading, onDeleteCard }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <Typography
          variant="subtitle2"
          sx={{ color: '#64748b', fontWeight: 600 }}
        >
          Danh sách từ vựng
        </Typography>
      </Box>
      <Divider />
      <Box>
        {flashcards.map((card, index) => (
          <React.Fragment key={card._id}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: '16px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(59, 130, 246, 0.02)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  gap: 2,
                }}
              >
                {card.image_url ? (
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    <img
                      src={card.image_url}
                      alt={card.front}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://placehold.co/60x60/eee/999?text=No+Image';
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.03)',
                      borderRadius: '8px',
                      flexShrink: 0,
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <Image color="disabled" sx={{ fontSize: 24 }} />
                  </Box>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      lineHeight: 1.4,
                    }}
                  >
                    {card.front}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      lineHeight: 1.4,
                    }}
                  >
                    {card.back}
                  </Typography>
                </Box>
              </Box>

              <IconButton
                size="small"
                onClick={() => onDeleteCard(card._id)}
                sx={{
                  color: '#ef4444',
                  opacity: 0.7,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    opacity: 1,
                    bgcolor: 'rgba(239, 68, 68, 0.08)',
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
            {index < flashcards.length - 1 && <Divider sx={{ mx: 2 }} />}
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};

export default FlashcardList;
