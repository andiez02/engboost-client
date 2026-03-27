import React from 'react';
import { Box, Fade, IconButton, Typography, alpha } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

function safeSpeak(text) {
  if (!text) return;
  if (typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  } catch {
    // Some browsers may block TTS.
  }
}

const FlashcardCard = React.memo(function FlashcardCard({
  card,
  onRemove,
  isPublic = false,
  isFavorite = false,
  onToggleFavorite,
  onEdit,
  showFlipHint = false,
  badgeText,
}) {
  const imageUrl = card?.imageUrl || card?.image_url || null;
  const exampleSentence =
    card?.object ||
    card?.example_sentence ||
    card?.exampleSentence ||
    card?.example ||
    card?.sentence ||
    '';

  const handleSpeak = (e) => {
    e.stopPropagation();
    safeSpeak(card?.english);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.(card.id);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(card.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(card);
  };

  const hasImage = Boolean(imageUrl);

  return (
    <Fade in timeout={220}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3.5,
          border: '1px solid rgba(15,23,42,0.08)',
          bgcolor: '#fff',
          overflow: 'hidden',
          boxShadow: '0 10px 28px rgba(15,23,42,0.05)',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: '0 16px 36px rgba(79,70,229,0.09)',
            borderColor: 'rgba(79,70,229,0.22)',
          },
          '&:active': {
            transform: 'translateY(-1px) scale(1.01)',
          },
        }}
      >
        {/* Media (ONLY when has image) */}
        {hasImage ? (
          <Box
            sx={{
              width: '100%',
              aspectRatio: '4 / 3',
              position: 'relative',
              bgcolor: '#F8FAFC',
              background: 'linear-gradient(180deg, rgba(15,23,42,0.02), rgba(15,23,42,0.0))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={imageUrl}
              alt={card?.english || 'flashcard image'}
              style={{
                width: '92%',
                height: '92%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 10px 20px rgba(15,23,42,0.08))',
              }}
              loading="lazy"
            />

            {/* top-left badge */}
            {badgeText ? (
              <Box
                sx={{
                  position: 'absolute',
                  left: 10,
                  top: 10,
                  px: 1.05,
                  py: 0.5,
                  borderRadius: 999,
                  bgcolor: 'rgba(255,255,255,0.82)',
                  border: '1px solid rgba(15,23,42,0.08)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.66rem',
                    fontWeight: 950,
                    color: '#4338CA',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    maxWidth: 150,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {badgeText}
                </Typography>
              </Box>
            ) : null}
          </Box>
        ) : null}

        {/* Content */}
        <Box sx={{ p: 1.6, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: '1rem',
              color: '#0F172A',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {card?.english || '—'}
          </Typography>
          <Typography
            sx={{
              mt: 0.55,
              fontSize: '0.86rem',
              color: '#64748B',
              fontStyle: 'italic',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {card?.vietnamese || '—'}
          </Typography>

          {/* Example sentence (ONLY when no image) */}
          {!hasImage && exampleSentence ? (
            <Box
              sx={{
                mt: 1,
                p: 1.1,
                borderRadius: 3,
                bgcolor: 'rgba(15,23,42,0.03)',
                border: '1px solid rgba(15,23,42,0.06)',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.78rem',
                  color: '#334155',
                  lineHeight: 1.35,
                  fontWeight: 650,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                “{exampleSentence}”
              </Typography>
            </Box>
          ) : null}

          {showFlipHint ? (
            <Typography sx={{ mt: 1.1, fontSize: '0.75rem', color: 'rgba(100,116,139,0.75)', fontWeight: 700 }}>
              Chạm để lật thẻ
            </Typography>
          ) : null}
        </Box>

        {/* Actions (bottom row) */}
        <Box
          sx={{
            px: 1.05,
            py: 0.85,
            borderTop: '1px solid rgba(15,23,42,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 0.5,
            bgcolor: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <IconButton
              size="small"
              onClick={handleSpeak}
              sx={{
                width: 30,
                height: 30,
                borderRadius: 3,
                color: alpha('#4F46E5', 0.6),
                '&:hover': { bgcolor: 'rgba(79,70,229,0.08)', color: '#4F46E5' },
              }}
            >
              <VolumeUpOutlinedIcon sx={{ fontSize: 17 }} />
            </IconButton>

            {onToggleFavorite ? (
              <IconButton
                size="small"
                onClick={handleToggleFavorite}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 3,
                  color: isFavorite ? '#F59E0B' : alpha('#64748B', 0.55),
                  '&:hover': { bgcolor: 'rgba(245,158,11,0.10)', color: '#F59E0B' },
                }}
              >
                {isFavorite ? (
                  <StarRoundedIcon sx={{ fontSize: 17 }} />
                ) : (
                  <StarBorderRoundedIcon sx={{ fontSize: 17 }} />
                )}
              </IconButton>
            ) : null}

            {onEdit ? (
              <IconButton
                size="small"
                onClick={handleEdit}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 3,
                  color: alpha('#64748B', 0.55),
                  '&:hover': { bgcolor: 'rgba(2,132,199,0.08)', color: '#0284C7' },
                }}
              >
                <EditRoundedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            ) : null}
          </Box>

          {!isPublic && onRemove ? (
            <IconButton
              size="small"
              aria-label="remove"
              onClick={handleRemove}
              sx={{
                width: 30,
                height: 30,
                borderRadius: 3,
                color: alpha('#64748B', 0.5),
                '&:hover': { bgcolor: 'rgba(239,68,68,0.08)', color: '#EF4444' },
              }}
            >
              <CloseIcon sx={{ fontSize: 17 }} />
            </IconButton>
          ) : (
            <Box sx={{ width: 30, height: 30 }} />
          )}
        </Box>
      </Box>
    </Fade>
  );
});

export default FlashcardCard;

