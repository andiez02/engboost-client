import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Shuffle as ShuffleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const StudyFlashcardsModal = ({ open, onClose, folder }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && folder?.flashcards) {
      setFlashcards(folder.flashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsShuffled(false);
    }
  }, [open, folder]);

  if (isLoading) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!flashcards.length) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            pb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Không có flashcard để học
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="Đóng"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              py: 4,
            }}
          >
            <Typography variant="body1" color="text.secondary" align="center">
              Thư mục này chưa có flashcard nào. Vui lòng thêm flashcard trước
              khi bắt đầu học.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const currentCard = flashcards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    if (!isShuffled) {
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled);
      setIsShuffled(true);
    } else {
      setFlashcards(folder.flashcards);
      setIsShuffled(false);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" fontWeight={600}>
            Học Flashcards
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentIndex + 1} / {flashcards.length}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="Đóng"
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            py: 4,
          }}
        >
          {/* Flashcard */}
          <Box
            sx={{
              width: '100%',
              height: '300px',
              perspective: '1000px',
              cursor: 'pointer',
            }}
            onClick={handleFlip}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
              }}
            >
              {/* Front of card */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  borderRadius: '16px',
                  background:
                    'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                {currentCard?.image_url && (
                  <Box
                    component="img"
                    src={currentCard.image_url}
                    alt={currentCard.english}
                    sx={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'contain',
                      mb: 2,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  />
                )}
                <Typography
                  variant="h4"
                  fontWeight={600}
                  align="center"
                  sx={{ wordBreak: 'break-word' }}
                >
                  {currentCard?.english}
                </Typography>
              </Box>

              {/* Back of card */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  borderRadius: '16px',
                  background: 'white',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={600}
                  align="center"
                  color="text.primary"
                  sx={{ wordBreak: 'break-word' }}
                >
                  {currentCard?.vietnamese}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Navigation buttons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <IconButton
              onClick={handlePrev}
              disabled={currentIndex === 0}
              sx={{
                backgroundColor: alpha('#8B5CF6', 0.1),
                '&:hover': {
                  backgroundColor: alpha('#8B5CF6', 0.2),
                },
              }}
            >
              <PrevIcon />
            </IconButton>

            <Button
              variant="contained"
              onClick={handleFlip}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                width: '160px',
                px: 3,
                py: 1,
                backgroundColor: '#8B5CF6',
                boxShadow: `0 4px 12px ${alpha('#8B5CF6', 0.3)}`,
                '&:hover': {
                  backgroundColor: '#7C3AED',
                },
              }}
            >
              {isFlipped ? 'Xem câu hỏi' : 'Xem đáp án'}
            </Button>

            <IconButton
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              sx={{
                backgroundColor: alpha('#8B5CF6', 0.1),
                '&:hover': {
                  backgroundColor: alpha('#8B5CF6', 0.2),
                },
              }}
            >
              <NextIcon />
            </IconButton>
          </Box>

          {/* Shuffle button */}
          <Button
            variant="outlined"
            startIcon={<ShuffleIcon />}
            onClick={handleShuffle}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              borderColor: '#E5E7EB',
              color: isShuffled ? '#8B5CF6' : 'text.secondary',
              '&:hover': {
                borderColor: '#8B5CF6',
                backgroundColor: alpha('#8B5CF6', 0.05),
              },
            }}
          >
            {isShuffled ? 'Bỏ xáo trộn' : 'Xáo trộn thẻ'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StudyFlashcardsModal;
