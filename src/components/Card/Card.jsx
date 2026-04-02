import React from 'react';
import { Typography, IconButton, Box, Fade, alpha } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import { getFlashcardViewModel } from '../../utils/flashcardSelectors';

const Cards = React.memo(({ card, onRemove, isPublic = false }) => {
  const viewModel = getFlashcardViewModel(card);
  const { headword, translation, pos, imageUrl } = viewModel || {};
  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!headword) return;
    const utt = new SpeechSynthesisUtterance(headword);
    utt.lang = 'en-US';
    window.speechSynthesis.speak(utt);
  };

  return (
    <Fade in timeout={280}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 2,
          py: 1.6,
          borderRadius: '14px',
          border: '1px solid rgba(0,0,0,0.07)',
          bgcolor: '#fff',
          transition: 'box-shadow 0.18s, border-color 0.18s',
          '&:hover': {
            borderColor: 'rgba(79,70,229,0.22)',
            boxShadow: '0 4px 18px rgba(79,70,229,0.07)',
          },
        }}
      >
        {/* ── Image ── */}
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: '10px',
            bgcolor: 'rgba(79,70,229,0.05)',
            flexShrink: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={imageUrl}
            alt={headword}
            style={{ width: '86%', height: '86%', objectFit: 'contain' }}
          />
        </Box>

        {/* ── Category tag ── */}
        <Box
          sx={{
            width: 72,
            flexShrink: 0,
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              px: 1,
              py: 0.3,
              borderRadius: '6px',
              bgcolor: 'rgba(79,70,229,0.08)',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#4F46E5',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 64,
              }}
            >
              {pos || '—'}
            </Typography>
          </Box>
        </Box>

        {/* ── Divider ── */}
        <Box sx={{ width: '1px', height: 36, bgcolor: 'rgba(0,0,0,0.07)', flexShrink: 0, display: { xs: 'none', sm: 'block' } }} />

        {/* ── English ── */}
        <Box sx={{ flex: '0 0 140px', minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.92rem',
              color: '#0F172A',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {headword}
          </Typography>
        </Box>

        {/* ── Divider ── */}
        <Box sx={{ width: '1px', height: 36, bgcolor: 'rgba(0,0,0,0.07)', flexShrink: 0 }} />

        {/* ── Vietnamese ── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '0.86rem',
              color: '#64748B',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {translation}
          </Typography>
        </Box>

        {/* ── Actions ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          <IconButton
            size="small"
            onClick={handleSpeak}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              color: alpha('#4F46E5', 0.5),
              '&:hover': { bgcolor: 'rgba(79,70,229,0.08)', color: '#4F46E5' },
            }}
          >
            <VolumeUpOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>

          {!isPublic && (
            <IconButton
              size="small"
              aria-label="remove"
              className="interceptor-loading"
              onClick={() => onRemove(card.id)}
              sx={{
                width: 30,
                height: 30,
                borderRadius: '8px',
                color: alpha('#64748B', 0.4),
                '&:hover': { bgcolor: 'rgba(239,68,68,0.07)', color: '#EF4444' },
              }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Fade>
  );
});

export default Cards;