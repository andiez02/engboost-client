import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Fade,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../theme';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(8px)',
  },
  '& .MuiPaper-root': {
    borderRadius: '2rem',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
}));

/**
 * BaseModal Component
 * @param {boolean} open - Modal open state
 * @param {function} onClose - Function to handle modal close
 * @param {string} title - Modal title
 * @param {React.ReactNode} children - Modal content
 * @param {React.ReactNode} actions - Modal action buttons (optional)
 * @param {string} maxWidth - MUI Dialog maxWidth ('xs' | 'sm' | 'md' | 'lg' | 'xl' | false)
 * @param {boolean} fullWidth - Whether the modal should take up full width
 */
const BaseModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseIcon = true,
}) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      TransitionComponent={Fade}
      transitionDuration={400}
    >
      {/* Header */}
      <DialogTitle sx={{ m: 0, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: colors.dark, letterSpacing: '-0.02em' }}>
          {title}
        </Typography>
        {showCloseIcon && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
              '&:hover': {
                color: '#EF4444',
                background: 'rgba(239, 68, 68, 0.1)',
              },
              transition: 'all 0.2s',
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      {/* Content */}
      <DialogContent 
        dividers 
        sx={{ 
          p: 3, 
          borderTop: '1px solid rgba(0,0,0,0.05)', 
          borderBottom: actions ? '1px solid rgba(0,0,0,0.05)' : 'none' 
        }}
      >
        <Box sx={{ py: 1 }}>
          {children}
        </Box>
      </DialogContent>

      {/* Actions */}
      {actions && (
        <DialogActions sx={{ p: 2.5, px: 3 }}>
          {actions}
        </DialogActions>
      )}
    </StyledDialog>
  );
};

export default React.memo(BaseModal);
