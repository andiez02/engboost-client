import { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import IosShareIcon from '@mui/icons-material/IosShare';
import { toast } from 'react-toastify';

/**
 * ShareButton — triggers native share, clipboard copy, or manual copy fallback.
 * @param {string} message - Pre-formatted share text
 */
export default function ShareButton({ message }) {
  const [showManualCopy, setShowManualCopy] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: message });
      } catch (err) {
        // User cancelled or share failed — silently ignore
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(message);
        toast('Đã sao chép!', {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          style: {
            borderRadius: '12px',
            border: '2px solid #E5E5E5',
            borderBottom: '4px solid #E5E5E5',
            padding: '10px 16px',
            fontWeight: 700,
          },
        });
      } catch (err) {
        console.warn('[ShareButton] Clipboard write failed:', err);
        setShowManualCopy(true);
      }
    } else {
      console.warn('[ShareButton] Neither navigator.share nor navigator.clipboard is available.');
      setShowManualCopy(true);
    }
  };

  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        startIcon={<IosShareIcon />}
        onClick={handleShare}
        sx={{
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 700,
          borderColor: '#E5E5E5',
          color: '#4B4B4B',
          '&:hover': {
            borderColor: '#FF9600',
            color: '#FF9600',
            backgroundColor: 'rgba(255,150,0,0.05)',
          },
        }}
      >
        Chia sẻ
      </Button>

      {showManualCopy && (
        <Box mt={1}>
          <TextField
            fullWidth
            size="small"
            value={message}
            inputProps={{ readOnly: true, onClick: (e) => e.target.select() }}
            sx={{ borderRadius: '8px' }}
          />
        </Box>
      )}
    </Box>
  );
}
