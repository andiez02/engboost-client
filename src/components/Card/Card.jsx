import React from 'react';
import { Card, Typography, IconButton, Box, Fade, alpha } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Cards = React.memo(({ card, onRemove, isPublic = false }) => (
  <Fade in={true} timeout={300}>
    <Card
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: alpha('#000', 0.06),
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: alpha('#3b82f6', 0.2),
          boxShadow: `0 4px 12px ${alpha('#000', 0.05)}`,
        },
      }}
    >
      <Box sx={{ display: 'flex', p: 2, position: 'relative' }}>
        {/* Image container */}
        <Box
          sx={{
            width: '70px',
            height: '70px',
            borderRadius: 1.5,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha('#f8fafc', 0.9),
          }}
        >
          <img
            src={card.imageUrl}
            alt={card.object}
            style={{
              width: '90%',
              height: '90%',
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            ml: 2.5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Category label */}
          <Typography
            variant="caption"
            sx={{
              color: '#3b82f6',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              fontSize: '0.65rem',
              mb: 0.75,
            }}
          >
            {card.object}
          </Typography>

          {/* English word */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: '#0f172a',
              mb: 0.5,
              fontSize: '0.95rem',
              letterSpacing: '-0.01em',
            }}
          >
            {card.english}
          </Typography>

          {/* Vietnamese translation */}
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.85rem',
              color: '#64748b',
            }}
          >
            {card.vietnamese}
          </Typography>
        </Box>

        {/* Remove button */}
        {!isPublic && (
          <IconButton
            size="small"
            aria-label="remove"
            className="interceptor-loading"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: alpha('#64748b', 0.5),
              p: 0.5,
              '&:hover': {
                bgcolor: alpha('#f87171', 0.08),
                color: '#ef4444',
              },
            }}
            onClick={() => onRemove(card.id)}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
    </Card>
  </Fade>
));

export default Cards;
