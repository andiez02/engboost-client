import { AnimatePresence, motion } from 'framer-motion';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const MotionDiv = motion.div;

export default function FloatingNotification({ notification, onClose }) {
  return (
    <AnimatePresence>
      {notification ? (
        <MotionDiv
          initial={{ opacity: 0, y: -14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 96,
            right: 24,
            zIndex: 1500,
            width: 'min(420px, calc(100vw - 32px))',
          }}
        >
          <Box
            sx={{
              borderRadius: '1.5rem',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(99,102,241,0.16)',
              boxShadow: '0 18px 44px rgba(15,23,42,0.14)',
            }}
          >
            <Box
              sx={{
                p: 2.25,
                background: 'linear-gradient(135deg, rgba(79,70,229,0.10) 0%, rgba(16,185,129,0.06) 100%)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 950, color: '#0F172A', fontSize: '1rem' }}>
                    {notification.title}
                  </Typography>
                  {notification.message ? (
                    <Typography sx={{ mt: 0.7, color: 'text.secondary', lineHeight: 1.5, fontSize: '0.92rem' }}>
                      {notification.message}
                    </Typography>
                  ) : null}

                  {(notification.badgeText || notification.metaText) ? (
                    <Box sx={{ mt: 1.2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {notification.badgeText ? (
                        <Box sx={{ px: 1.2, py: 0.6, borderRadius: 999, bgcolor: 'rgba(79,70,229,0.10)', border: '1px solid rgba(79,70,229,0.18)' }}>
                          <Typography sx={{ fontWeight: 900, color: '#4338CA', fontSize: '0.8rem' }}>
                            {notification.badgeText}
                          </Typography>
                        </Box>
                      ) : null}
                      {notification.metaText ? (
                        <Box sx={{ px: 1.2, py: 0.6, borderRadius: 999, bgcolor: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.18)' }}>
                          <Typography sx={{ fontWeight: 900, color: '#C2410C', fontSize: '0.8rem' }}>
                            {notification.metaText}
                          </Typography>
                        </Box>
                      ) : null}
                    </Box>
                  ) : null}
                </Box>

                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{
                    mt: -0.4,
                    mr: -0.4,
                    color: 'rgba(15,23,42,0.5)',
                    '&:hover': { bgcolor: 'rgba(15,23,42,0.06)' },
                  }}
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Box>

              {(notification.primaryAction || notification.secondaryAction) ? (
                <Box sx={{ mt: 2, display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
                  {notification.primaryAction ? (
                    <ButtonBase
                      onClick={notification.primaryAction.onClick}
                      sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: 999,
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        color: '#fff',
                        fontWeight: 950,
                        boxShadow: '0 12px 30px rgba(79,70,229,0.22)',
                        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 16px 34px rgba(79,70,229,0.28)',
                        },
                      }}
                    >
                      {notification.primaryAction.label}
                    </ButtonBase>
                  ) : null}

                  {notification.secondaryAction ? (
                    <ButtonBase
                      onClick={notification.secondaryAction.onClick}
                      sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: 999,
                        background: '#EEF2FF',
                        color: '#4338CA',
                        fontWeight: 900,
                        border: '1px solid rgba(99,102,241,0.22)',
                        transition: 'transform 0.18s ease, background-color 0.18s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          backgroundColor: '#E0E7FF',
                        },
                      }}
                    >
                      {notification.secondaryAction.label}
                    </ButtonBase>
                  ) : null}
                </Box>
              ) : null}
            </Box>
          </Box>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );
}
