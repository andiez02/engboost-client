import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { createPost } from '../../redux/post/postSlice';
import { gamify, btn3d } from '../../theme';
import { toast } from 'react-toastify';
import { routes } from '../../utils/constants';

export default function ShareModal({ open, onClose, folder }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!folder?.id) return;
    setLoading(true);
    const result = await dispatch(
      createPost({ folderId: folder.id, content: content.trim() || undefined })
    );
    setLoading(false);

    if (createPost.fulfilled.match(result)) {
      toast.success('Shared successfully 🚀');
      setContent('');
      onClose();
      navigate(routes.DISCOVER);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setContent('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            border: `2px solid ${gamify.gray}`,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShareIcon sx={{ color: gamify.blue }} />
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: gamify.text }}>
            Share Folder
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {folder && (
          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              bgcolor: gamify.blueBg,
              border: `1px solid ${gamify.blue}33`,
            }}
          >
            <Typography sx={{ fontWeight: 700, color: gamify.text, fontSize: '0.95rem' }}>
              {folder.title}
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: gamify.sub, mt: 0.5 }}>
              {folder.flashcard_count ?? 0} flashcards
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Add a caption (optional)..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 500 } }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&.Mui-focused fieldset': { borderColor: gamify.blue },
            },
          }}
        />
        <Typography sx={{ fontSize: '0.75rem', color: gamify.sub, mt: 0.5, textAlign: 'right' }}>
          {content.length}/500
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            color: gamify.sub,
            textTransform: 'uppercase',
            fontSize: '0.8rem',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleShare}
          disabled={loading || !folder?.id}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ShareIcon />}
          sx={btn3d(gamify.blue, gamify.blueDark)}
        >
          {loading ? 'Sharing...' : 'Share'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
