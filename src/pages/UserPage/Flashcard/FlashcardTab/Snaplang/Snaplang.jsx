import React, { useState, useRef, useCallback } from 'react';
import {
  Container,
  Grid,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
  snaplangDetectAPI,
  saveFlashcardsToFolderAPI,
} from '../../../../../apis';

// Sub-components
import SnaplangHeader from './components/SnaplangHeader';
import UploadPanel from './components/UploadPanel';
import ResultsTray from './components/ResultsTray';
import SaveFlashcardModal from '../../../../../components/SaveFlashcardModal/SaveFlashcardModal';
import { useModal } from '../../../../../modal/ModalSystem/useModal';

function Snaplang() {
  const { openModal } = useModal();
  const location = useLocation();
  const { folderId, folderTitle } = location.state || {};
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setAlert({
        open: true,
        message: 'Chỉ hỗ trợ định dạng JPEG, PNG, GIF và WEBP',
        severity: 'error',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAlert({
        open: true,
        message: 'Kích thước ảnh không được vượt quá 5MB',
        severity: 'error',
      });
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => {
        setPreviewUrl(reader.result);
        setImage(file);
        setUploading(false);
        setAlert({
          open: true,
          message: 'Tải ảnh lên thành công',
          severity: 'success',
        });
      }, 500);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageChange = useCallback((event) => {
    if (event.target.files?.[0]) {
      handleFile(event.target.files?.[0]);
    }
    event.target.value = '';
  }, [handleFile]);

  const handleUpload = useCallback(async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const data = await snaplangDetectAPI(formData);

      if (!data.detections || data.detections.length === 0) {
        setAlert({
          open: true,
          message: 'Không nhận diện được vật thể nào.',
          severity: 'warning',
        });
        setLoading(false);
        return;
      }

      const newFlashcards = data.detections.map((item) => ({
        id: Date.now() + Math.random(),
        imageUrl: previewUrl,
        object: item.object,
        english: item.english,
        vietnamese: item.vietnamese,
      }));

      setFlashcards((prev) => [...newFlashcards, ...prev]);

      setAlert({
        open: true,
        message: `Đã tạo ${newFlashcards.length} flashcard(s) thành công`,
        severity: 'success',
      });
    } catch (error) {
      console.error(error);
      setAlert({
        open: true,
        message: 'Có lỗi xảy ra khi nhận diện ảnh',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      setImage(null);
      setPreviewUrl(null);
    }
  }, [image, previewUrl]);

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setPreviewUrl(null);
  }, []);

  const handleRemoveFlashcard = useCallback((id) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== id));
    setAlert({
      open: true,
      message: 'Đã xóa flashcard',
      severity: 'info',
    });
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  const triggerCameraInput = useCallback(() => {
    cameraInputRef.current.click();
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, open: false }));
  }, []);

  const handleSaveFlashcards = useCallback(async (folderData) => {
    try {
      setSaving(true);

      const data = {
        create_new_folder: folderData.isNew,
        flashcards: flashcards.map((card) => ({
          english: card.english,
          vietnamese: card.vietnamese,
          image_url: card.imageUrl,
          object: card.object,
        })),
      };

      // Only include folder_id or folder_title based on whether creating new folder
      if (folderData.isNew) {
        data.folder_title = folderData.title;
      } else {
        data.folder_id = folderData.id;
      }

      const response = await saveFlashcardsToFolderAPI(data);

      if (response?.success && response?.data?.inserted_count > 0) {
        const successMessage = `Đã lưu thành công ${
          response.data.inserted_count
        } flashcard vào ${
          folderData.isNew
            ? `thư mục mới "${folderData.title}"`
            : 'thư mục đã chọn'
        }`;

        if (folderData.onFolderUpdate && response.data.folder) {
          await folderData.onFolderUpdate(response.data.folder);
        }

        setTimeout(() => {
          setFlashcards([]);

          setTimeout(() => {
            setAlert({
              open: true,
              message: successMessage,
              severity: 'success',
            });
            setSaving(false);
          }, 500);
        }, 300);

        return true;
      } else {
        throw new Error('Không có flashcard nào được lưu. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error saving flashcards:', error);
      setAlert({
        open: true,
        message: error.message || 'Lưu flashcard thất bại. Vui lòng thử lại.',
        severity: 'error',
      });
      setSaving(false);
      return false;
    }
  }, [flashcards]);

  const saveAllFlashcards = useCallback(() => {
    if (flashcards.length === 0) {
      setAlert({
        open: true,
        message: 'Không có flashcard nào để lưu',
        severity: 'warning',
      });
      return;
    }
    
    openModal(SaveFlashcardModal, {
      flashcards,
      onSave: handleSaveFlashcards,
      initialFolderId: folderId,
      initialFolderTitle: folderTitle,
      onFolderUpdate: location.state?.onFolderUpdate
    }, {
      type: 'drawer-right',
      size: 'sm'
    });
  }, [flashcards, openModal, handleSaveFlashcards, folderId, folderTitle, location.state]);

  const handleClearFlashcards = useCallback(() => {
    setFlashcards([]);
    setAlert({
      open: true,
      message: 'Đã xóa tất cả kết quả',
      severity: 'info',
    });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column: Input Panel */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SnaplangHeader />
            <UploadPanel
              previewUrl={previewUrl}
              uploading={uploading}
              loading={loading}
              dragActive={dragActive}
              onUpload={handleUpload}
              onFileSelect={triggerFileInput}
              onCameraSelect={triggerCameraInput}
              onRemoveImage={handleRemoveImage}
              onDrag={handleDrag}
              onDrop={handleDrop}
            />
          </Box>
        </Grid>

        {/* Right Column: Results Tray */}
        <Grid item xs={12} md={7}>
          <ResultsTray
            flashcards={flashcards}
            saving={saving}
            onClear={handleClearFlashcards}
            onSaveAll={saveAllFlashcards}
            onRemoveCard={handleRemoveFlashcard}
          />
        </Grid>
      </Grid>

      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ top: '80px !important' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
            fontWeight: 500,
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default React.memo(Snaplang);
