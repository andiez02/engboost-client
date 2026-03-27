import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Close,
  ArrowBackIos,
  ArrowForwardIos,
} from '@mui/icons-material';
import { gamify as t } from '../../../../../../theme';

/* ─── Single flip card ───────────────────────────────────────────────────── */
function FlipCard({ card }) {
  const [flipped, setFlipped] = useState(false);

  // Reset flip when card changes
  React.useEffect(() => {
    setFlipped(false);
  }, [card?.id]);

  return (
    <Box
      onClick={() => setFlipped((f) => !f)}
      sx={{
        width: '100%',
        perspective: '1400px',
        cursor: 'pointer',
        minHeight: 280,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: 280,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            bgcolor: '#ffffff',
            border: `2px solid ${t.gray}`,
            borderBottom: `4px solid ${t.grayDark}`,
            p: 5,
            gap: 1.5,
            userSelect: 'none',
          }}
        >
          <Box sx={{ px: 2, py: 0.5, borderRadius: 2, bgcolor: t.blueBg, border: `2px solid ${t.blue}`, mb: 1 }}>
            <Typography
              variant="overline"
              sx={{ color: t.blue, fontWeight: 900, letterSpacing: 2, fontSize: '0.65rem' }}
            >
              ENGLISH
            </Typography>
          </Box>
          <Typography
            variant="h3"
            fontWeight={900}
            color={t.text}
            textAlign="center"
            sx={{ lineHeight: 1.15, letterSpacing: '-0.5px' }}
          >
            {card.english}
          </Typography>
          {card.object && (
            <Typography variant="body2" sx={{ color: t.sub, fontWeight: 700, mt: 0.5 }}>
              {card.object}
            </Typography>
          )}
          <Typography variant="caption" sx={{ color: t.sub, mt: 3, fontWeight: 700 }}>
            Nhấn để xem nghĩa
          </Typography>
        </Box>

        {/* Back */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            bgcolor: t.green,
            border: `2px solid ${t.green}`,
            borderBottom: `4px solid ${t.greenDark}`,
            p: 5,
            gap: 1.5,
            userSelect: 'none',
          }}
        >
          <Box sx={{ px: 2, py: 0.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)', mb: 1 }}>
            <Typography
              variant="overline"
              sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 900, letterSpacing: 2, fontSize: '0.65rem' }}
            >
              NGHĨA
            </Typography>
          </Box>
          <Typography
            variant="h3"
            fontWeight={900}
            color="white"
            textAlign="center"
            sx={{ lineHeight: 1.15 }}
          >
            {card.vietnamese}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mt: 3, fontWeight: 700 }}>
            Nhấn để lật lại
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

/* ─── Main modal ─────────────────────────────────────────────────────────── */
const FlashcardPreviewModal = ({ open, onClose, cards = [], initialIndex = 0 }) => {
  const [index, setIndex] = useState(initialIndex);

  // Reset to first card when modal opens
  React.useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  if (!cards.length) return null;

  const card = cards[index];
  const total = cards.length;

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(total - 1, i + 1));

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      onKeyDown={handleKeyDown}
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          border: `2px solid ${t.gray}`,
          borderBottom: `4px solid ${t.grayDark}`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          bgcolor: t.blueBg,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.5,
          borderBottom: `2px solid ${t.gray}`,
          bgcolor: '#fff',
        }}
      >
        <Typography sx={{ fontWeight: 900, fontSize: '0.9rem', color: t.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Xem flashcard
        </Typography>
        <Box sx={{ px: 1.5, py: 0.4, borderRadius: 2, bgcolor: t.blueBg, border: `2px solid ${t.blue}` }}>
          <Typography sx={{ fontSize: '0.82rem', color: t.blue, fontWeight: 900 }}>
            {index + 1} / {total}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small"
          sx={{ borderRadius: 3, color: t.sub, border: `2px solid ${t.gray}`, width: 30, height: 30, '&:hover': { bgcolor: t.redBg, color: t.red, borderColor: t.red } }}>
          <Close sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Card area */}
      <Box sx={{ px: 3, pt: 3, pb: 1 }}>
        <FlipCard card={card} />
      </Box>

      {/* Progress dots */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.6, py: 1.5 }}>
        {cards.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i)}
            sx={{
              width: i === index ? 20 : 7,
              height: 7,
              borderRadius: '999px',
              bgcolor: i === index ? t.blue : t.gray,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          />
        ))}
      </Box>

      {/* Navigation */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, pb: 3, pt: 0.5 }}
      >
        <IconButton onClick={prev} disabled={index === 0}
          sx={{
            borderRadius: 3,
            border: `2px solid ${t.gray}`,
            borderBottom: `4px solid ${t.grayDark}`,
            bgcolor: '#fff',
            width: 44, height: 44,
            color: index === 0 ? t.gray : t.blue,
            '&:hover:not(:disabled)': { bgcolor: t.blueBg, borderColor: t.blue },
            '&:active:not(:disabled)': { borderBottomWidth: 0, transform: 'translateY(4px)' },
          }}>
          <ArrowBackIos sx={{ fontSize: 14, ml: 0.5 }} />
        </IconButton>

        <Typography sx={{ fontSize: '0.75rem', color: t.sub, fontWeight: 700 }}>
          ← → để chuyển thẻ
        </Typography>

        <IconButton onClick={next} disabled={index === total - 1}
          sx={{
            borderRadius: 3,
            border: `2px solid ${t.gray}`,
            borderBottom: `4px solid ${t.grayDark}`,
            bgcolor: '#fff',
            width: 44, height: 44,
            color: index === total - 1 ? t.gray : t.blue,
            '&:hover:not(:disabled)': { bgcolor: t.blueBg, borderColor: t.blue },
            '&:active:not(:disabled)': { borderBottomWidth: 0, transform: 'translateY(4px)' },
          }}>
          <ArrowForwardIos sx={{ fontSize: 14 }} />
        </IconButton>
      </Stack>
    </Dialog>
  );
};

export default FlashcardPreviewModal;
