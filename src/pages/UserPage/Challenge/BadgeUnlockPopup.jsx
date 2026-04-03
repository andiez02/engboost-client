import { Box, Typography, Modal } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../../../theme';

/**
 * Popup shown when a new achievement is unlocked.
 * Renders badge icon with glow + gold styling to celebrate the moment.
 */
export default function BadgeUnlockPopup({ open, badge, onClose }) {
  if (!badge) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(6px)',
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ outline: 'none' }}
          >
            <Box
              sx={{
                bgcolor: '#fff',
                borderRadius: '24px',
                p: 4,
                maxWidth: 360,
                width: '85vw',
                textAlign: 'center',
                boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                border: '2px solid #FFD700', // Gold border for celebration
              }}
            >
              {/* Badge icon */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 1, repeat: 1, ease: 'easeInOut' }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: '#FFF8E0', // Light gold bg
                    border: '3px solid #FFD700',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mx: 'auto',
                    mb: 2.5,
                    boxShadow: '0 0 30px rgba(255, 215, 0, 0.4)',
                    overflow: 'hidden',
                  }}
                >
                  {badge.icon?.startsWith('http') ? (
                    <img src={badge.icon} alt={badge.title} style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '2.2rem' }}>{badge.icon || '🏆'}</span>
                  )}
                </Box>
              </motion.div>

              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: '#B8860B', // Dark gold
                  mb: 0.75,
                }}
              >
                🏆 Huy hiệu mới!
              </Typography>

              <Typography
                sx={{
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  color: tokens.color.text,
                  mb: 0.5,
                }}
              >
                {badge.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: tokens.color.textSub,
                  mb: 3,
                }}
              >
                {badge.description}
              </Typography>

              <Box
                component="button"
                onClick={onClose}
                sx={{
                  width: '100%',
                  py: 1.25,
                  borderRadius: '12px',
                  bgcolor: '#FFF8E0',
                  border: '2px solid #FFD700',
                  color: '#B8860B',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: tokens.shadow.sm,
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                  },
                }}
              >
                Tuyệt! ✨
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
