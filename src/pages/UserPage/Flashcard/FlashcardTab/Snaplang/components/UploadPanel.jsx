import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Fade,
  IconButton,
  ButtonBase,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import TranslateIcon from '@mui/icons-material/Translate';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import { gamify as t } from '../../../../../../theme';

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
}) => {
  const disabled = !previewUrl || loading || uploading;

  return (
    <Box
      sx={{
        position: { md: 'sticky' },
        top: { md: 100 },
        borderRadius: 4,
        overflow: 'hidden',
        bgcolor: '#fff',
        border: `2px solid ${t.gray}`,
        borderBottom: `4px solid ${t.gray}`,
      }}
    >
      {/* ── Section Label ── */}
      <Box sx={{ px: 3, pt: 2.5, pb: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '1rem' }}>📸</Typography>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: t.sub, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Tải ảnh lên
        </Typography>
      </Box>

      <Box sx={{ p: 2.5 }}>
        {/* ── Dropzone ── */}
        <Box
          sx={{
            position: 'relative',
            height: 240,
            width: '100%',
            mb: 2.5,
            borderRadius: 3,
            overflow: 'hidden',
            border: previewUrl
              ? `2px solid ${t.gray}`
              : dragActive
              ? `3px dashed ${t.blue}`
              : `3px dashed ${t.grayDark}`,
            bgcolor: previewUrl
              ? '#fff'
              : dragActive
              ? t.blueBg
              : t.surface,
            transition: 'all 0.15s ease',
            cursor: !previewUrl ? 'pointer' : 'default',
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
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  bgcolor: 'rgba(255,255,255,0.92)',
                }}
              >
                <CircularProgress size={40} thickness={4} sx={{ mb: 2, color: t.blue }} />
                <Typography sx={{ color: t.text, fontWeight: 900, fontSize: '0.95rem' }}>
                  Đang xử lý...
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
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 32,
                  height: 32,
                  bgcolor: t.red,
                  color: '#fff',
                  border: `2px solid ${t.red}`,
                  borderBottom: `3px solid ${t.redDark}`,
                  zIndex: 2,
                  '&:hover': { bgcolor: t.red },
                  '&:active': { borderBottomWidth: 0, transform: 'translateY(3px)' },
                }}
                onClick={(e) => { e.stopPropagation(); onRemoveImage(); }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </>
          ) : (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  bgcolor: dragActive ? t.blue : t.gray,
                  border: '2px solid',
                  borderColor: dragActive ? t.blueDark : t.grayDark,
                  borderBottom: '4px solid',
                  borderBottomColor: dragActive ? t.blueDark : t.grayDark,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 28, color: dragActive ? '#fff' : t.sub }} />
              </Box>
              <Typography sx={{ color: t.text, fontWeight: 900, textAlign: 'center', fontSize: '1.05rem' }}>
                {dragActive ? 'Thả ảnh vào đây!' : 'Kéo & thả ảnh'}
              </Typography>
              <Typography sx={{ color: t.sub, textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                hoặc nhấn để chọn từ thiết bị
              </Typography>
            </Box>
          )}
        </Box>

        {/* ── Action Buttons Row ── */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
          <ButtonBase
            onClick={onFileSelect}
            sx={{
              flex: 1,
              borderRadius: 3,
              py: 1.3,
              fontWeight: 900,
              fontSize: '0.85rem',
              bgcolor: '#fff',
              color: t.sub,
              border: `2px solid ${t.gray}`,
              borderBottom: `4px solid ${t.gray}`,
              transition: 'all 0.1s ease',
              '&:hover': { borderColor: t.grayDark, color: t.text },
              '&:active': { borderBottomWidth: 0, transform: 'translateY(4px)' },
            }}
          >
            <PhotoLibraryIcon sx={{ mr: 0.8, fontSize: 20 }} /> THƯ VIỆN
          </ButtonBase>
          <ButtonBase
            onClick={onCameraSelect}
            sx={{
              flex: 1,
              borderRadius: 3,
              py: 1.3,
              fontWeight: 900,
              fontSize: '0.85rem',
              bgcolor: t.blue,
              color: '#fff',
              border: `2px solid ${t.blue}`,
              borderBottom: `4px solid ${t.blueDark}`,
              transition: 'all 0.1s ease',
              '&:active': { borderBottomWidth: 0, transform: 'translateY(4px)' },
            }}
          >
            <CameraAltIcon sx={{ mr: 0.8, fontSize: 20 }} /> CHỤP ẢNH
          </ButtonBase>
        </Box>

        {/* ── Main CTA ── */}
        <ButtonBase
          onClick={onUpload}
          disabled={disabled}
          sx={{
            width: '100%',
            borderRadius: 3,
            py: 1.8,
            fontWeight: 900,
            fontSize: '1rem',
            letterSpacing: '0.03em',
            color: '#fff',
            bgcolor: disabled ? t.gray : t.green,
            border: '2px solid',
            borderColor: disabled ? t.gray : t.green,
            borderBottom: '4px solid',
            borderBottomColor: disabled ? t.grayDark : t.greenDark,
            transition: 'all 0.1s ease',
            ...(!disabled && {
              '&:active': { borderBottomWidth: 0, transform: 'translateY(4px)' },
            }),
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={22} sx={{ color: '#fff', mr: 1.5 }} />
              <span>ĐANG PHÂN TÍCH...</span>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TranslateIcon sx={{ mr: 1, fontSize: 22 }} /> TẠO FLASHCARDS
            </Box>
          )}
        </ButtonBase>
      </Box>
    </Box>
  );
};

export default React.memo(UploadPanel);
