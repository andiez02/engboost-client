import React from 'react';
import { Box, Typography, Chip, alpha } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { colors } from "../../../../../../theme";

const SnaplangHeader = () => {
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${colors.sage} 0%, ${colors.blue} 100%)`,
        p: { xs: 3, md: 4 },
        borderRadius: '2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 12px 30px ${alpha(colors.sage, 0.2)}`,
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <LanguageIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant='h4'
              sx={{ fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}
            >
              Snaplang
            </Typography>
            <Chip 
              label="AI Powered" 
              size="small" 
              sx={{ 
                mt: 0.5, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                fontWeight: 700,
                fontSize: '0.65rem',
                height: 20
              }} 
            />
          </Box>
        </Box>
        <Typography variant='body1' sx={{ opacity: 0.9, fontWeight: 500, lineHeight: 1.5, maxWidth: 300, fontSize: '0.95rem' }}>
          Chụp ảnh vật thể xung quanh và học từ vựng tiếng Anh tức thì.
        </Typography>
      </Box>
    </Box>
  );
};

export default React.memo(SnaplangHeader);
