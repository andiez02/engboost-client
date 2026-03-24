import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Fade,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import TranslateIcon from '@mui/icons-material/Translate';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from "../../../../../../theme";

const UploadPanel = ({
  previewUrl,
  uploading,
  loading,
  dragActive,
  onUpload,
  onFileSelect,
  onCameraSelect,
  onRemoveImage,
  onDrag,
  onDrop,
  imageName,
}) => {
  return (
    <Box
      sx={{
        position: { md: 'sticky' },
        top: { md: 100 },
        borderRadius: '2rem',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
      }}
    >
      <Paper elevation={0} sx={{ p: 4, borderRadius: 0 }}>
        {/* Image Selection Area */}
        <Box
          sx={{
            position: 'relative',
            height: 320,
            width: '100%',
            mb: 4,
            borderRadius: '1.5rem',
            overflow: 'hidden',
            border: previewUrl
              ? 'none'
              : dragActive
              ? `2px dashed ${colors.sage}`
              : '2px dashed rgba(0,0,0,0.1)',
            bgcolor: previewUrl
              ? 'transparent'
              : dragActive
              ? `${colors.sage}08`
              : 'rgba(0,0,0,0.02)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: previewUrl ? '0 12px 30px rgba(0,0,0,0.12)' : 'none',
          }}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
          onClick={!previewUrl ? onFileSelect : undefined}
        >
          {uploading && (
            <Fade in={uploading}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <CircularProgress size={44} thickness={4} sx={{ mb: 2, color: colors.sage }} />
                <Typography variant='body1' sx={{ color: colors.dark, fontWeight: 700 }}>
                  Đang xử lý ảnh...
                </Typography>
              </Box>
            </Fade>
          )}

          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Selected"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Tooltip title="Xóa ảnh" arrow>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    zIndex: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    '&:hover': { bgcolor: '#EF4444', color: 'white' },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage();
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                p: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '24px',
                  bgcolor: alpha(colors.sage, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 40, color: colors.sage }} />
              </Box>
              <Typography variant='h6' sx={{ color: colors.dark, fontWeight: 800, mb: 1, textAlign: 'center' }}>
                {dragActive ? 'Thả ảnh vào đây' : 'Tải lên hình ảnh'}
              </Typography>
              <Typography variant='body2' sx={{ color: `${colors.dark}80`, textAlign: 'center', fontWeight: 500 }}>
                Kéo thả hoặc nhấn để chọn ảnh từ thiết bị
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2.5, mb: 4 }}>
          <Button
            fullWidth
            variant='outlined'
            startIcon={<PhotoLibraryIcon />}
            onClick={onFileSelect}
            sx={{
              borderRadius: '1rem',
              textTransform: 'none',
              py: 1.5,
              fontWeight: 700,
              borderColor: 'rgba(0,0,0,0.1)',
              color: colors.dark,
              '&:hover': { borderColor: colors.sage, bgcolor: alpha(colors.sage, 0.05) },
            }}
          >
            Thư viện
          </Button>
          <Button
            fullWidth
            variant='contained'
            startIcon={<CameraAltIcon />}
            onClick={onCameraSelect}
            sx={{
              borderRadius: '1rem',
              textTransform: 'none',
              py: 1.5,
              fontWeight: 700,
              bgcolor: colors.sage,
              '&:hover': { bgcolor: colors.sage, transform: 'translateY(-2px)' },
              transition: 'all 0.3s',
            }}
          >
            Chụp ảnh
          </Button>
        </Box>

        <Button
          variant='contained'
          fullWidth
          size='large'
          startIcon={loading ? null : <TranslateIcon />}
          onClick={onUpload}
          disabled={!previewUrl || loading || uploading}
          sx={{
            borderRadius: '1.2rem',
            py: 2.2,
            textTransform: 'none',
            fontWeight: 800,
            backgroundColor: colors.dark,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: colors.sage,
              transform: 'translateY(-3px)',
              boxShadow: `0 15px 35px ${alpha(colors.sage, 0.3)}`,
            },
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fontSize: '1.1rem',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={24} color='inherit' sx={{ mr: 2 }} />
              <Typography sx={{ fontWeight: 800 }}>AI đang phân tích...</Typography>
            </Box>
          ) : (
            'Nhận diện & Học tập'
          )}
        </Button>
      </Paper>
    </Box>
  );
};

export default React.memo(UploadPanel);
