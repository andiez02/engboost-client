import React, { useState, useRef, useCallback } from 'react';
import { Grid, Snackbar, Alert, Box, Button, Typography } from '@mui/material';import { useLocation, useNavigate } from 'react-router-dom';
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
import EditNoteIcon from '@mui/icons-material/EditNote';
import ManualCreate from './components/ManualCreate';
// import useFloatingNotification from '../../../../../hooks/useFloatingNotification';

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
  const [streakDays, setStreakDays] = useState(() => {
    const raw = Number(localStorage.getItem(CREATE_STREAK_DAYS_KEY));
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  });
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

  // useEffect(() => {
  //   if (!rewardData?.count) return;

  //   showNotification({
  //     title: `🎉 Bạn đã tạo ${rewardData.count} từ mới!`,
  //     message: 'Tuyệt vời! Bắt đầu học ngay để thẻ vào đúng nhịp.',
  //     badgeText: '🆕 Từ mới',
  //     metaText: rewardData.xp > 0 ? `✨ +${rewardData.xp} XP` : null,
  //     durationMs: 8000,
  //   });
  // }, [rewardData, showNotification]);

  return (
    <div>
      {/* Description + mode switcher */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#AFAFAF', marginBottom: 16, maxWidth: 520 }}>
          Tạo flashcards từ ảnh hoặc từ chủ đề bằng AI. Hãy làm 1 bước nhỏ để tiến bộ mỗi ngày.
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setMode('upload')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 14,
              fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.04em',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.12s cubic-bezier(.4,0,.2,1)',
              border: `2px solid ${mode === 'upload' ? '#1CB0F6' : '#E5E5E5'}`,
              borderBottom: mode === 'upload' ? '2px solid #1899D6' : '4px solid #E0E0E0',
              background: mode === 'upload' ? '#DDF4FF' : '#fff',
              color: mode === 'upload' ? '#1CB0F6' : '#AFAFAF',
              transform: mode === 'upload' ? 'translateY(2px)' : 'none',
            }}
          >
            <PhotoCameraOutlinedIcon sx={{ fontSize: 17 }} />
            Tạo từ ảnh
          </button>

          <button
            onClick={() => setMode('ai')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 14,
              fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.04em',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.12s cubic-bezier(.4,0,.2,1)',
              border: `2px solid ${mode === 'ai' ? '#CE82FF' : '#E5E5E5'}`,
              borderBottom: mode === 'ai' ? '2px solid #A568CC' : '4px solid #E0E0E0',
              background: mode === 'ai' ? '#F6E5FF' : '#fff',
              color: mode === 'ai' ? '#CE82FF' : '#AFAFAF',
              transform: mode === 'ai' ? 'translateY(2px)' : 'none',
            }}
          >
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 17 }} />
            Tạo bằng AI
          </button>

          <button
            onClick={() => setMode('manual')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 14,
              fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.04em',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.12s cubic-bezier(.4,0,.2,1)',
              border: `2px solid ${mode === 'manual' ? '#58CC02' : '#E5E5E5'}`,
              borderBottom: mode === 'manual' ? '2px solid #46A302' : '4px solid #E0E0E0',
              background: mode === 'manual' ? '#D7FFB8' : '#fff',
              color: mode === 'manual' ? '#46A302' : '#AFAFAF',
              transform: mode === 'manual' ? 'translateY(2px)' : 'none',
            }}
          >
            <EditNoteIcon sx={{ fontSize: 17 }} />
            Tự tạo
          </button>
        </div>
      </div>

      {mode === 'manual' ? (
        <ManualCreate />
      ) : mode === 'upload' ? (
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
    </div>
  );
}

export default React.memo(Snaplang);
