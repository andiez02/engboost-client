import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  FileUpload as FileUploadIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const FlashcardForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [english, setEnglish] = useState('');
  const [vietnamese, setVietnamese] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!english.trim() || !vietnamese.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (!imagePreview) {
      toast.error('Vui lòng chọn hình ảnh!');
      return;
    }

    onSubmit({
      flashcards: [
        {
          english: english.trim(),
          vietnamese: vietnamese.trim(),
          image_url: imagePreview,
        },
      ],
    });

    // Reset form
    setEnglish('');
    setVietnamese('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        bgcolor: '#f8fafc',
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Thêm từ vựng mới
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Tiếng Anh"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          required
          fullWidth
          size="small"
          disabled={isSubmitting}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
        <TextField
          label="Tiếng Việt"
          value={vietnamese}
          onChange={(e) => setVietnamese(e.target.value)}
          required
          fullWidth
          size="small"
          disabled={isSubmitting}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<FileUploadIcon />}
            disabled={isSubmitting}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: 'rgba(0,0,0,0.12)',
              color: '#64748b',
              '&:hover': {
                borderColor: 'rgba(0,0,0,0.24)',
                bgcolor: 'rgba(0,0,0,0.02)',
              },
            }}
          >
            Chọn hình ảnh
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
          </Button>
          {imagePreview && (
            <>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Đã chọn 1 hình ảnh
              </Typography>
              <IconButton size="small" onClick={clearImage} color="default">
                <ClearIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
        {imagePreview && (
          <Box
            sx={{
              width: 100,
              height: 100,
              overflow: 'hidden',
              borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f8f9fa',
              position: 'relative',
            }}
          >
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://placehold.co/100x100/eee/999?text=Invalid';
                setImagePreview(null);
              }}
            />
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bgcolor: 'rgba(255,255,255,0.8)',
                padding: '2px',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
              onClick={clearImage}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}
        >
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: 'rgba(0,0,0,0.12)',
              color: '#64748b',
              '&:hover': {
                borderColor: 'rgba(0,0,0,0.24)',
                bgcolor: 'rgba(0,0,0,0.02)',
              },
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={
              isSubmitting ||
              !english.trim() ||
              !vietnamese.trim() ||
              !imagePreview
            }
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Thêm từ vựng'
            )}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default FlashcardForm;
