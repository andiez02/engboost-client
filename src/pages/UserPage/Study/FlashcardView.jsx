import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { flipCard } from '../../../redux/study/studySlice';

export default function FlashcardView({ card, isTransitioning }) {
  const dispatch = useDispatch();
  const isFlipped = useSelector((state) => state.study.isFlipped);

  return (
    <Box
      onClick={() => dispatch(flipCard())}
      sx={{
        width: '100%',
        perspective: '1400px',
        cursor: 'pointer',
        minHeight: 300,
        opacity: isTransitioning ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}
    >
      <Box
        key={card?.id}
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: 300,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
            borderRadius: 5,
            bgcolor: '#ffffff',
            boxShadow: '0 8px 40px rgba(79,70,229,0.10)',
            border: '1.5px solid rgba(79,70,229,0.08)',
            p: 5,
            gap: 1.5,
            userSelect: 'none',
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: '999px',
              bgcolor: 'rgba(79,70,229,0.08)',
              mb: 1,
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: '#4F46E5', fontWeight: 700, letterSpacing: 2, fontSize: '0.65rem' }}
            >
              ENGLISH
            </Typography>
          </Box>

          <Typography
            variant="h2"
            fontWeight={800}
            color="text.primary"
            textAlign="center"
            sx={{ lineHeight: 1.15, letterSpacing: '-0.5px' }}
          >
            {card.english}
          </Typography>

          {card.object && (
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
              sx={{ mt: 0.5, opacity: 0.7 }}
            >
              {card.object}
            </Typography>
          )}

          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            Tap to reveal
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
            borderRadius: 5,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            boxShadow: '0 8px 40px rgba(79,70,229,0.30)',
            p: 5,
            gap: 1.5,
            userSelect: 'none',
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: '999px',
              bgcolor: 'rgba(255,255,255,0.15)',
              mb: 1,
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, letterSpacing: 2, fontSize: '0.65rem' }}
            >
              MEANING
            </Typography>
          </Box>

          <Typography
            variant="h2"
            fontWeight={800}
            color="white"
            textAlign="center"
            sx={{ lineHeight: 1.15 }}
          >
            {card.vietnamese}
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.55)', mt: 3 }}
          >
            Rate your recall below
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
