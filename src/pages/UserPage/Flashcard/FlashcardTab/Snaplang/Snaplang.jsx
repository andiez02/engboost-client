import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Container,
  Grid,
  Snackbar,
  Alert,
  Box,
  Button,
  ButtonBase,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  snaplangDetectAPI,
  saveFlashcardsToFolderAPI,
} from '../../../../../apis';

// Sub-components
import UploadPanel from './components/UploadPanel';
import ResultsTray from './components/ResultsTray';
import SaveFlashcardModal from '../../../../../components/SaveFlashcardModal/SaveFlashcardModal';
import { useModal } from '../../../../../modal/ModalSystem/useModal';
import GenerateDeck from '../Discover/GenerateDeck';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import FloatingNotification from '../../../../../components/Feedback/FloatingNotification';
import useFloatingNotification from '../../../../../hooks/useFloatingNotification';

const CREATE_STREAK_DAYS_KEY = 'engboost_createflashcards_streak_days';
const CREATE_STREAK_LAST_DATE_KEY = 'engboost_createflashcards_last_date';

function StatBadge({ icon, children, tint }) {
  return (
    <Box
      sx={{
        height: 48,
        px: 2,
        borderRadius: 3,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        bgcolor: '#fff',
        border: `2px solid ${tint}`,
        borderBottom: `4px solid ${tint}`,
        color: tint,
      }}
    >
      {icon}
      <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
        {children}
      </Typography>
    </Box>
  );
}

function toLocalISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseLocalISODate(s) {
  const [y, m, d] = s.split('-').map((v) => Number(v));
  return new Date(y, m - 1, d);
}

function buildSensesFromDetection(item) {
  if (Array.isArray(item?.senses) && item.senses.length > 0) {
    return item.senses;
  }

  const detectedExamples = Array.isArray(item?.examples)
    ? item.examples
    : item?.example
      ? [item.example]
      : [];

  const normalizedExamples = detectedExamples
    .map((ex) => (typeof ex === 'string' ? { sentence: ex } : ex))
    .filter((ex) => ex?.sentence)
    .map((ex) => ({
      sentence: String(ex.sentence).trim(),
      translation: ex?.translation ? String(ex.translation).trim() : undefined,
    }));

  const headword = (item?.headword || item?.english || '').trim();
  const translation = (item?.translation || item?.vietnamese || headword).trim();
  const definition = (item?.definition || `${headword}: ${translation}`).trim();

  return [{
    translation,
    definition,
    examples: normalizedExamples,
  }];
}

function Snaplang() {
  const { openModal } = useModal();
  const location = useLocation();
  const navigate = useNavigate();
  const { folderId, folderTitle } = location.state || {};
  const searchParams = new URLSearchParams(location.search);
  const initialMode = searchParams.get('mode') === 'ai' ? 'ai' : 'upload';
  const [mode, setMode] = useState(initialMode);

  const reviewedToday = useSelector((state) => state.study.stats?.reviewedToday ?? 0);
  const { notification, showNotification, hideNotification } = useFloatingNotification();

  const [streakDays, setStreakDays] = useState(() => {
    if (typeof window === 'undefined') return 1;
    const raw = Number(localStorage.getItem(CREATE_STREAK_DAYS_KEY));
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  });

  const [rewardData, setRewardData] = useState(null);
  const autoStudyAfterSaveRef = useRef(false);

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [savedFolderId, setSavedFolderId] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const bumpCreateStreak = useCallback(() => {
    if (typeof window === 'undefined') return;

    const todayStr = toLocalISODate(new Date());
    const lastStr = localStorage.getItem(CREATE_STREAK_LAST_DATE_KEY);
    const prevDaysRaw = Number(localStorage.getItem(CREATE_STREAK_DAYS_KEY));
    const prevDays = Number.isFinite(prevDaysRaw) && prevDaysRaw > 0 ? prevDaysRaw : 1;

    // First time
    if (!lastStr) {
      localStorage.setItem(CREATE_STREAK_LAST_DATE_KEY, todayStr);
      localStorage.setItem(CREATE_STREAK_DAYS_KEY, String(prevDays));
      setStreakDays(prevDays);
      return;
    }

    const today = parseLocalISODate(todayStr);
    const last = parseLocalISODate(lastStr);
    const diffDays = Math.round((today.getTime() - last.getTime()) / 86_400_000);

    const nextDays = diffDays === 0 ? prevDays : diffDays === 1 ? prevDays + 1 : 1;
    localStorage.setItem(CREATE_STREAK_LAST_DATE_KEY, todayStr);
    localStorage.setItem(CREATE_STREAK_DAYS_KEY, String(nextDays));
    setStreakDays(nextDays);
  }, []);

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
        image_url: previewUrl,
        pos: item.pos || item.object || null,
        headword: item.headword || item.english,
        english: item.headword || item.english,
        translation: item.translation || item.vietnamese,
        vietnamese: item.translation || item.vietnamese,
        senses: buildSensesFromDetection(item),
      }));

      setFlashcards((prev) => [...newFlashcards, ...prev]);

      const createdCount = newFlashcards.length ?? 0;
      if (createdCount > 0) {
        setRewardData({ count: createdCount, xp: 5 });
        bumpCreateStreak();
      }
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
  }, [image, previewUrl, bumpCreateStreak]);

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
          headword: card.headword || card.english,
          image_url: card.imageUrl,
          pos: card.pos,
          senses: Array.isArray(card.senses) && card.senses.length > 0
            ? card.senses
            : [{
              translation: card.translation || card.vietnamese || card.headword || card.english || '',
              definition: card.definition || `${card.headword || card.english}: ${card.translation || card.vietnamese || card.headword || card.english}`,
              examples: card.example ? [{ sentence: card.example }] : [],
            }],
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

        const savedId = response.data.folder?.id || folderData.id;
        setSavedFolderId(savedId || null);
        const shouldAutoStudy = autoStudyAfterSaveRef.current;
        autoStudyAfterSaveRef.current = false;

        if (shouldAutoStudy && savedId) {
          // Navigate shortly after saving to keep the flow feeling responsive.
          setTimeout(() => {
            navigate(`/study?folderId=${savedId}`);
          }, 450);
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
  }, [flashcards, navigate]);

  const saveAllFlashcards = useCallback((opts = {}) => {
    if (flashcards.length === 0) {
      setAlert({
        open: true,
        message: 'Không có flashcard nào để lưu',
        severity: 'warning',
      });
      return;
    }

    autoStudyAfterSaveRef.current = !!opts.autoStudy;
    
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

  useEffect(() => {
    if (!rewardData?.count) return;

    showNotification({
      title: `🎉 Bạn đã tạo ${rewardData.count} từ mới!`,
      message: 'Tuyệt vời! Bắt đầu học ngay để thẻ vào đúng nhịp.',
      badgeText: '🆕 Từ mới',
      metaText: rewardData.xp > 0 ? `✨ +${rewardData.xp} XP` : null,
      durationMs: 8000,
    });
  }, [rewardData, showNotification]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <FloatingNotification
        notification={notification}
        onClose={hideNotification}
      />

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            {/* <Typography variant="h4" sx={{ fontWeight: 950, color: '#0F172A', lineHeight: 1.1 }}>
              Create Flashcards
            </Typography> */}
            <Typography sx={{ mt: 0.8, color: 'text.secondary', maxWidth: 520 }}>
              Tạo flashcards từ ảnh hoặc từ chủ đề bằng AI. Hãy làm 1 bước nhỏ để tiến bộ mỗi ngày.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
          }}
        >
          <ButtonBase
            onClick={() => setMode('upload')}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              border: '2px solid',
              borderColor: mode === 'upload' ? '#1CB0F6' : '#E5E5E5',
              borderBottom: '4px solid',
              borderBottomColor: mode === 'upload' ? '#1899D6' : '#E5E5E5',
              bgcolor: mode === 'upload' ? '#DDF4FF' : '#fff',
              color: mode === 'upload' ? '#1CB0F6' : '#AFAFAF',
              transition: 'all 0.1s ease',
              borderBottomWidth: mode === 'upload' ? '2px' : '4px',
              transform: mode === 'upload' ? 'translateY(2px)' : 'none',
              marginBottom: mode === 'upload' ? '2px' : '0',
              '&:hover': mode !== 'upload' ? { bgcolor: '#F7F7F7' } : {},
            }}
          >
            <PhotoCameraOutlinedIcon sx={{ fontSize: 24, mr: 1 }} />
            <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>
              TẠO TỪ ẢNH
            </Typography>
          </ButtonBase>

          <ButtonBase
            onClick={() => setMode('ai')}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              border: '2px solid',
              borderColor: mode === 'ai' ? '#CE82FF' : '#E5E5E5',
              borderBottom: '4px solid',
              borderBottomColor: mode === 'ai' ? '#A568CC' : '#E5E5E5',
              bgcolor: mode === 'ai' ? '#F6E5FF' : '#fff',
              color: mode === 'ai' ? '#CE82FF' : '#AFAFAF',
              transition: 'all 0.1s ease',
              borderBottomWidth: mode === 'ai' ? '2px' : '4px',
              transform: mode === 'ai' ? 'translateY(2px)' : 'none',
              marginBottom: mode === 'ai' ? '2px' : '0',
              '&:hover': mode !== 'ai' ? { bgcolor: '#F7F7F7' } : {},
            }}
          >
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 24, mr: 1 }} />
            <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>
              TẠO BẰNG AI
            </Typography>
          </ButtonBase>
        </Box>
      </Box>

      {/* Mode Content */}
      {mode === 'upload' ? (
        <Grid container spacing={4}>
          {/* Left Column: Input Panel */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
      ) : (
        <GenerateDeck variant="create" />
      )}

      {mode === 'upload' ? (
        <>
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
            autoHideDuration={5000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ top: '120px !important' }}
          >
            <Alert
              onClose={handleCloseAlert}
              severity={alert.severity}
              variant="filled"
              action={
                alert.severity === 'success' && savedFolderId ? (
                  <Button
                    color="inherit"
                    size="small"
                    sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
                    onClick={() => navigate(`/study?folderId=${savedFolderId}`)}
                  >
                    Học ngay
                  </Button>
                ) : undefined
              }
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
        </>
      ) : null}
    </Container>
  );
}

export default React.memo(Snaplang);
