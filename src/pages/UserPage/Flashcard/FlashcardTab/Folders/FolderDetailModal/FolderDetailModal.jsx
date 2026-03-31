import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Dialog,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Divider,
  TextField,
  Typography,
  Box,
  Avatar,
  Stack,
  CircularProgress,
  Slide,
  Fade,
  Skeleton,
} from '@mui/material';
import {
  MoreVert,
  Close,
  Edit,
  Delete,
  Add,
  FolderOutlined,
  StyleOutlined,
  VolumeUpOutlined,
  ArrowBackIos,
  ArrowForwardIos,
  AutoStoriesOutlined,
} from '@mui/icons-material';
import ShareIcon from '@mui/icons-material/Share';
import { routes } from '../../../../../../utils/constants';
import {
  getFlashcardsByFolderAPI,
  deleteFlashcardAPI,
} from '../../../../../../apis';
import FlashcardCard from '../../../../../../components/Flashcard/FlashcardCard';
import { updateFlashcardCount } from '../../../../../../redux/folder/folderSlice';
import ShareModal from '../../../../../../components/Post/ShareModal';
import { gamify as t, btn3d } from '../../../../../../theme';

/* ─── Shared speak helper ───────────────────────────────────────────────── */
function safeSpeak(text) {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new window.SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } catch { /* noop */ }
}

/* ─── Inline card detail panel (renders inside Dialog) ──────────────────── */
const CardDetailPanel = memo(function CardDetailPanel({ card, cards, onClose, onNavigate }) {
  if (!card) return null;
  const idx = cards.findIndex((c) => (c.id || c._id) === (card.id || card._id));
  const hasPrev = idx > 0;
  const hasNext = idx < cards.length - 1;
  const imageUrl = card.image_url || card.imageUrl || null;
  const example = card.example || card.example_sentence || card.exampleSentence || card.sentence || '';

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(idx - 1);
      if (e.key === 'ArrowRight' && hasNext) onNavigate(idx + 1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [idx, hasPrev, hasNext, onNavigate, onClose]);

  return (
    <Slide direction="left" in mountOnEnter unmountOnExit>
      <Box sx={{
        flex: 1,
        minWidth: { xs: '100%', sm: 500 },
        borderLeft: `2px solid ${t.gray}`,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Panel header */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2.5, py: 1.5, borderBottom: `2px solid ${t.gray}`, flexShrink: 0,
          bgcolor: '#fafbfc',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoStoriesOutlined sx={{ fontSize: 14, color: t.sub }} />
            <Typography sx={{ fontWeight: 800, fontSize: '0.72rem', color: t.sub, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {idx + 1} / {cards.length}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" disabled={!hasPrev} onClick={() => onNavigate(idx - 1)}
              sx={{
                width: 28, height: 28, borderRadius: 2,
                border: `1.5px solid ${hasPrev ? t.blue : t.gray}`,
                color: hasPrev ? t.blue : t.gray,
                transition: 'all 0.15s ease',
                '&:hover': hasPrev ? { bgcolor: t.blueBg, borderColor: t.blue } : {},
              }}>
              <ArrowBackIos sx={{ fontSize: 11, ml: 0.3 }} />
            </IconButton>
            <IconButton size="small" disabled={!hasNext} onClick={() => onNavigate(idx + 1)}
              sx={{
                width: 28, height: 28, borderRadius: 2,
                border: `1.5px solid ${hasNext ? t.blue : t.gray}`,
                color: hasNext ? t.blue : t.gray,
                transition: 'all 0.15s ease',
                '&:hover': hasNext ? { bgcolor: t.blueBg, borderColor: t.blue } : {},
              }}>
              <ArrowForwardIos sx={{ fontSize: 11 }} />
            </IconButton>
            <IconButton size="small" onClick={onClose}
              sx={{
                width: 28, height: 28, borderRadius: 2,
                border: `1.5px solid ${t.gray}`, color: t.sub,
                transition: 'all 0.15s ease',
                '&:hover': { bgcolor: t.redBg, color: t.red, borderColor: t.red },
              }}>
              <Close sx={{ fontSize: 13 }} />
            </IconButton>
          </Stack>
        </Box>

        {/* Oxford-style dictionary content */}
        <Box sx={{
          flex: 1, overflow: 'auto', px: 4, py: 3,
          display: 'flex', flexDirection: 'column', gap: 0,
          width: '100%',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { background: t.gray, borderRadius: 10 },
        }}>

          {/* ── Headword block ── */}
          <Fade in timeout={300}>
            <Box sx={{ mb: 3, width: '100%' }}>
              {/* Word */}
              <Typography sx={{
                fontSize: '2.2rem', fontWeight: 900, color: '#1a1a2e',
                lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: 'Georgia, serif',
                width: '100%',
              }}>
                {card.english || '—'}
              </Typography>

              {/* Part of speech + audio row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
                {card.object && (
                  <Typography component="span" sx={{
                    fontSize: '0.78rem', fontStyle: 'italic',
                    color: '#fff', fontWeight: 700,
                    bgcolor: '#c0392b', px: 1, py: 0.15, borderRadius: 1,
                    lineHeight: 1.5,
                  }}>
                    {card.object}
                  </Typography>
                )}
                <IconButton size="small" onClick={() => safeSpeak(card.english)}
                  sx={{
                    width: 28, height: 28, borderRadius: 2,
                    color: t.blue, bgcolor: t.blueBg,
                    border: `1.5px solid ${t.blue}`,
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: t.blue, color: '#fff', transform: 'scale(1.08)' },
                    '&:active': { transform: 'scale(0.95)' },
                  }}>
                  <VolumeUpOutlined sx={{ fontSize: 15 }} />
                </IconButton>
              </Box>

              {/* Accent divider */}
              <Box sx={{
                mt: 1.5, height: 3, borderRadius: 2, width: 48,
                background: 'linear-gradient(90deg, #c0392b, #e74c3c)',
              }} />
            </Box>
          </Fade>

          {/* ── Image (if present) ── */}
          {imageUrl && (
            <Fade in timeout={400}>
              <Box sx={{
                mb: 3, borderRadius: 3, overflow: 'hidden',
                border: `1.5px solid ${t.gray}`, bgcolor: '#fafafa',
                width: '100%',
                transition: 'box-shadow 0.2s ease',
                '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
              }}>
                <img src={imageUrl} alt={card.english || ''} loading="lazy"
                  style={{ width: '100%', maxHeight: 320, objectFit: 'contain', display: 'block' }} />
              </Box>
            </Fade>
          )}

          {/* ── Meaning block ── */}
          <Fade in timeout={500}>
            <Box sx={{ mb: 3, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.75 }}>
                <Typography sx={{
                  fontSize: '0.65rem', fontWeight: 900, color: t.sub,
                  textTransform: 'uppercase', letterSpacing: '0.12em', flexShrink: 0,
                }}>
                  nghĩa
                </Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: t.gray }} />
              </Box>
              <Box sx={{
                pl: 1.5,
                borderLeft: `3px solid ${t.blue}`,
                py: 0.5,
              }}>
                <Typography sx={{
                  fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e',
                  lineHeight: 1.45,
                }}>
                  {card.vietnamese || '—'}
                </Typography>
              </Box>
            </Box>
          </Fade>

          {/* ── Example block ── */}
          {example && (
            <Fade in timeout={600}>
              <Box sx={{ mb: 3, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.75 }}>
                  <Typography sx={{
                    fontSize: '0.65rem', fontWeight: 900, color: t.sub,
                    textTransform: 'uppercase', letterSpacing: '0.12em', flexShrink: 0,
                  }}>
                    ví dụ
                  </Typography>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: t.gray }} />
                </Box>
                <Box sx={{
                  pl: 1.5,
                  borderLeft: '3px solid #c0392b',
                  bgcolor: 'rgba(192,57,43,0.03)',
                  py: 1, pr: 1, borderRadius: '0 8px 8px 0',
                }}>
                  <Typography sx={{
                    fontSize: '0.9rem', fontStyle: 'italic', color: '#475569',
                    lineHeight: 1.75, fontFamily: 'Georgia, serif',
                  }}>
                    &ldquo;{example}&rdquo;
                  </Typography>
                </Box>
              </Box>
            </Fade>
          )}
        </Box>
      </Box>
    </Slide>
  );
});

/* ─── Count badge ────────────────────────────────────────────────────────── */
const CountBadge = memo(({ count }) =>
  count > 0 ? (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.2,
        py: 0.35,
        borderRadius: 2,
        fontSize: '0.72rem',
        fontWeight: 900,
        bgcolor: t.blueBg,
        color: t.blue,
        border: `2px solid ${t.blue}`,
        transition: 'transform 0.15s ease',
        '&:hover': { transform: 'scale(1.05)' },
      }}
    >
      <StyleOutlined sx={{ fontSize: 11 }} />
      {count}
    </Box>
  ) : null,
);

/* ─── Loading skeleton ───────────────────────────────────────────────────── */
const LoadingSkeleton = memo(() => (
  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
    {[...Array(5)].map((_, i) => (
      <Box key={i} sx={{
        display: 'flex', gap: 1.5, alignItems: 'center',
        p: 1.5, borderRadius: 3, bgcolor: '#fff',
        border: `1px solid ${t.gray}`,
        animation: `pulse 1.8s ease-in-out ${i * 0.12}s infinite`,
        '@keyframes pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      }}>
        <Skeleton variant="rounded" width={42} height={42} sx={{ borderRadius: 2, flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="60%" height={16} sx={{ borderRadius: 1, mb: 0.75 }} />
          <Skeleton width="40%" height={12} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    ))}
  </Box>
));

/* ─── Empty state ────────────────────────────────────────────────────────── */
const EmptyState = memo(({ onCreate }) => (
  <Fade in timeout={500}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 320,
        gap: 2,
        px: 3,
      }}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          borderRadius: 4,
          bgcolor: t.surface,
          border: `2px solid ${t.gray}`,
          borderBottom: `5px solid ${t.grayDark}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
          animation: 'float 3s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-6px)' },
          },
        }}
      >
        <span style={{ fontSize: 40 }}>📁</span>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 900, color: t.text, fontSize: '1.05rem', mb: 0.5 }}>
          Chưa có flashcard nào
        </Typography>
        <Typography sx={{ color: t.sub, fontSize: '0.85rem', fontWeight: 700, maxWidth: 280, mx: 'auto' }}>
          Tạo flashcard đầu tiên để bắt đầu!
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onCreate}
        disableElevation
        sx={{ ...btn3d(t.green, t.greenDark), mt: 1, px: 3, py: 1 }}
      >
        Tạo Flashcard
      </Button>
    </Box>
  </Fade>
));

/* ─── Card list item wrapper with stagger animation ──────────────────────── */
const CardListItem = memo(({ card, isActive, onCardClick, onRemove, index }) => {
  const id = card.id || card._id;

  return (
    <div
      style={{
        background: isActive ? 'rgba(28,176,246,0.06)' : 'transparent',
        borderRadius: 10,
        outline: isActive ? `2px solid rgba(28,176,246,0.3)` : 'none',
        outlineOffset: -1,
        transition: 'all 0.2s ease',
        animation: `fadeSlideIn 0.3s ease ${index * 0.03}s both`,
      }}
    >
      <FlashcardCard
        card={{ ...card, id, imageUrl: card.image_url || card.imageUrl || null }}
        onRemove={onRemove}
        onCardClick={(c) => onCardClick(isActive ? null : c)}
        compact
        hideAudio
      />
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════ */
const FolderDetailModal = ({
  open,
  onClose,
  folder,
  onEdit,
  onDelete,
  onFlashcardChange,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [folderTitle, setFolderTitle] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  const fetchFlashcards = useCallback(async () => {
    const folderId = folder?.id || folder?._id;
    if (!folderId) return;
    setLoading(true);
    try {
      const response = await getFlashcardsByFolderAPI(folderId);
      setFlashcards(Array.isArray(response.data) ? response.data : []);
    } catch {
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  }, [folder?.id, folder?._id]);

  useEffect(() => {
    const folderId = folder?.id || folder?._id;
    if (open && folder && folderId) {
      setFolderTitle(folder.title);
      setSelectedFolder(folder);
      setEditMode(false);
      setSelectedCard(null);
      fetchFlashcards();
    } else {
      setFlashcards([]);
      setSelectedFolder(null);
      setFolderTitle('');
      setEditMode(false);
      setSelectedCard(null);
    }
  }, [folder, open, fetchFlashcards]);

  const handleSaveEdit = useCallback(async () => {
    const folderId = selectedFolder?.id || selectedFolder?._id;
    if (folderTitle.trim() && onEdit && selectedFolder && folderId) {
      try {
        setIsUpdating(true);
        if (folderTitle.trim() !== selectedFolder.title) {
          await onEdit(folderId, { title: folderTitle.trim() });
          setSelectedFolder((prev) => ({ ...prev, title: folderTitle.trim() }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsUpdating(false);
        setEditMode(false);
      }
    } else {
      setEditMode(false);
    }
  }, [folderTitle, onEdit, selectedFolder]);

  const handleConfirmDelete = useCallback(async () => {
    const folderId = selectedFolder?.id || selectedFolder?._id;
    if (onDelete && selectedFolder && folderId) {
      try {
        setDeleteDialogOpen(false);
        onClose();
        await onDelete(folderId);
        toast.success('Xóa thư mục thành công!');
      } catch {
        toast.error('Xóa thư mục thất bại. Vui lòng thử lại!');
      }
    }
  }, [onDelete, selectedFolder, onClose]);

  const handleRemoveCard = useCallback(async (cardId) => {
    const folderId = selectedFolder?.id || selectedFolder?._id;
    try {
      await deleteFlashcardAPI(cardId);
      setFlashcards((prev) => prev.filter((c) => (c.id || c._id) !== cardId));
      const updatedCount = (selectedFolder.flashcard_count || 0) - 1;
      setSelectedFolder((prev) => ({ ...prev, flashcard_count: updatedCount }));
      dispatch(updateFlashcardCount({ folderId, count: updatedCount }));
      onFlashcardChange?.(folderId, updatedCount);
      // If the removed card was selected, deselect
      setSelectedCard((prev) => {
        if (prev && (prev.id || prev._id) === cardId) return null;
        return prev;
      });
    } catch (e) {
      console.error(e);
    }
  }, [selectedFolder, dispatch, onFlashcardChange]);

  const handleCreateFlashcard = useCallback(() => {
    onClose();
    navigate(routes.FLASHCARD_SNAPLANG);
  }, [onClose, navigate]);

  const handleCardClick = useCallback((card) => {
    setSelectedCard(card);
  }, []);

  const handleDetailNavigate = useCallback((idx) => {
    setSelectedCard(flashcards[idx]);
  }, [flashcards]);

  const handleDetailClose = useCallback(() => {
    setSelectedCard(null);
  }, []);

  /* Memoize the dialog width so it doesn't recalculate on every render */
  const dialogWidth = useMemo(() => selectedCard ? 1100 : 700, [selectedCard]);

  if (!selectedFolder) return null;

  /* ── header content ── */
  const headerContent = editMode ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2.5,
        py: 1.8,
        borderBottom: `2px solid ${t.gray}`,
        bgcolor: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
        <Avatar sx={{
          bgcolor: t.blueBg, color: t.blue, width: 38, height: 38,
          border: `2px solid ${t.blue}`,
          transition: 'transform 0.2s ease',
        }}>
          <FolderOutlined fontSize="small" />
        </Avatar>
        <TextField
          value={folderTitle}
          onChange={(e) => setFolderTitle(e.target.value)}
          variant="outlined"
          size="small"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveEdit();
            if (e.key === 'Escape') setEditMode(false);
          }}
          inputProps={{ maxLength: 30 }}
          sx={{
            minWidth: 220,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              fontSize: '0.9rem',
              fontWeight: 900,
              '& fieldset': { borderWidth: 2, borderColor: t.gray },
              '&.Mui-focused fieldset': { borderColor: t.blue },
            },
          }}
        />
      </Box>
      <Stack direction="row" spacing={1}>
        <Button onClick={() => setEditMode(false)} variant="outlined" size="small" disableElevation
          sx={{
            borderRadius: 3, textTransform: 'uppercase', fontWeight: 900,
            fontSize: '0.78rem', color: t.sub, borderColor: t.gray, borderWidth: 2,
            borderBottom: `4px solid ${t.grayDark}`,
            '&:active': { borderBottomWidth: 0, transform: 'translateY(4px)' },
          }}
        >
          Hủy
        </Button>
        <Button onClick={handleSaveEdit} variant="contained" size="small" disableElevation
          disabled={!folderTitle.trim() || isUpdating || folderTitle.trim() === selectedFolder.title}
          sx={{ ...btn3d(t.green, t.greenDark), px: 2.5 }}
        >
          {isUpdating ? <CircularProgress size={14} color="inherit" /> : 'Lưu'}
        </Button>
      </Stack>
    </Box>
  ) : (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2.5,
        py: 1.8,
        borderBottom: `2px solid ${t.gray}`,
        bgcolor: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <Avatar sx={{
          bgcolor: t.blueBg, color: t.blue, width: 42, height: 42, flexShrink: 0,
          border: `2px solid ${t.blue}`,
          borderBottom: `3px solid ${t.blueDark}`,
          transition: 'transform 0.2s ease',
          '&:hover': { transform: 'scale(1.05)' },
        }}>
          <FolderOutlined fontSize="small" />
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography noWrap sx={{ fontWeight: 900, fontSize: '1.05rem', color: t.text, lineHeight: 1.2 }}>
              {selectedFolder.title}
            </Typography>
            <CountBadge count={selectedFolder.flashcard_count} />
          </Box>
        </Box>
      </Box>

      <Stack direction="row" spacing={0.8} alignItems="center" flexShrink={0}>
        <Button
          variant="contained"
          startIcon={<ShareIcon sx={{ fontSize: '1rem !important' }} />}
          size="small"
          onClick={() => setShareOpen(true)}
          disableElevation
          sx={{ ...btn3d(t.green, t.greenDark), px: 2, py: 0.7, fontSize: '0.75rem' }}
        >
          Share 🌍
        </Button>
        <Button variant="outlined" startIcon={<Add sx={{ fontSize: '1rem !important' }} />}
          size="small" onClick={handleCreateFlashcard} disableElevation
          sx={{
            borderRadius: 3, textTransform: 'uppercase', fontWeight: 900,
            fontSize: '0.75rem', px: 2, py: 0.7, color: t.text,
            borderColor: t.gray, borderWidth: 2,
            borderBottom: `4px solid ${t.grayDark}`,
            '&:hover': { bgcolor: t.surface },
            '&:active': { borderBottomWidth: 0, transform: 'translateY(4px)' },
          }}>
          Thêm
        </Button>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small"
          sx={{
            borderRadius: 3, color: t.sub, border: `2px solid ${t.gray}`,
            width: 34, height: 34, transition: 'all 0.15s ease',
            '&:hover': { bgcolor: t.surface, borderColor: t.grayDark },
          }}>
          <MoreVert sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton onClick={onClose} size="small"
          sx={{
            borderRadius: 3, color: t.sub, border: `2px solid ${t.gray}`,
            width: 34, height: 34, transition: 'all 0.15s ease',
            '&:hover': { bgcolor: t.redBg, color: t.red, borderColor: t.red },
          }}>
          <Close sx={{ fontSize: 18 }} />
        </IconButton>
      </Stack>
    </Box>
  );

  return (
    <>
      {/* Stagger animation keyframe (injected once) */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Main Dialog ──────────────────────────────────────────────────── */}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            border: `2px solid ${t.gray}`,
            borderBottom: `4px solid ${t.grayDark}`,
            boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 8px 20px rgba(0,0,0,0.06)',
            height: '82vh',
            maxHeight: 820,
            width: dialogWidth,
            maxWidth: '95vw',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        }}
      >
        {headerContent}

        {/* Body: list + optional detail panel side by side */}
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
          {/* Card list */}
          <Box
            sx={{
              width: selectedCard ? 340 : '100%',
              minWidth: selectedCard ? 280 : 'auto',
              flexShrink: 0,
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'auto',
              bgcolor: t.surface,
              p: loading || flashcards.length === 0 ? 0 : 1.5,
              '&::-webkit-scrollbar': { width: 5 },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: t.gray,
                borderRadius: 10,
                '&:hover': { background: t.grayDark },
              },
            }}
          >
            {loading ? (
              <LoadingSkeleton />
            ) : flashcards.length === 0 ? (
              <EmptyState onCreate={handleCreateFlashcard} />
            ) : (
              <div className={selectedCard ? 'grid grid-cols-1 gap-1' : 'grid grid-cols-2 gap-1'}>
                {flashcards.map((card, index) => {
                  const id = card.id || card._id;
                  const isActive = (selectedCard?.id || selectedCard?._id) === id;
                  return (
                    <CardListItem
                      key={id}
                      card={card}
                      isActive={isActive}
                      onCardClick={handleCardClick}
                      onRemove={handleRemoveCard}
                      index={index}
                    />
                  );
                })}
              </div>
            )}
          </Box>

          {/* Detail panel — slides in from right */}
          {selectedCard && (
            <CardDetailPanel
              card={selectedCard}
              cards={flashcards}
              onClose={handleDetailClose}
              onNavigate={handleDetailNavigate}
            />
          )}
        </Box>
      </Dialog>

      {/* ── Dropdown menu ────────────────────────────────────────────────── */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `2px solid ${t.gray}`,
            borderBottom: `4px solid ${t.grayDark}`,
            boxShadow: '0 8px 28px rgba(0,0,0,0.1)',
            p: '4px',
            minWidth: 180,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => { setEditMode(true); setAnchorEl(null); }}
          sx={{
            borderRadius: 2, px: 1.5, py: 1, gap: 1.2,
            transition: 'all 0.15s ease',
            '&:hover': { bgcolor: t.blueBg },
          }}
        >
          <Edit fontSize="small" sx={{ color: t.blue, fontSize: 16 }} />
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 900, color: t.text }}>
            Đổi tên
          </Typography>
        </MenuItem>
        <Divider sx={{ my: '4px', borderColor: t.gray }} />
        <MenuItem
          onClick={() => { setAnchorEl(null); setDeleteDialogOpen(true); }}
          sx={{
            borderRadius: 2, px: 1.5, py: 1, gap: 1.2,
            transition: 'all 0.15s ease',
            '&:hover': { bgcolor: t.redBg },
          }}
        >
          <Delete fontSize="small" sx={{ color: t.red, fontSize: 16 }} />
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 900, color: t.red }}>
            Xóa thư mục
          </Typography>
        </MenuItem>
      </Menu>

      {/* ── Share Modal ───────────────────────────────────────────────────── */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        folder={selectedFolder}
      />

      {/* ── Delete confirmation ───────────────────────────────────────────── */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            border: `2px solid ${t.gray}`,
            borderBottom: `4px solid ${t.grayDark}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: 3,
              bgcolor: t.redBg,
              border: `2px solid ${t.red}`,
              borderBottom: `4px solid ${t.redDark}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5,
            }}
          >
            <Delete sx={{ color: t.red, fontSize: 26 }} />
          </Box>

          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: t.text, mb: 1 }}>
            Xóa thư mục?
          </Typography>
          <Typography sx={{ color: t.sub, fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.6, mb: 3 }}>
            Tất cả flashcard trong{' '}
            <Box component="span" sx={{ fontWeight: 900, color: t.text }}>
              &ldquo;{selectedFolder.title}&rdquo;
            </Box>{' '}
            sẽ bị xóa vĩnh viễn.
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" fullWidth disableElevation
              sx={{
                borderRadius: 3, textTransform: 'uppercase', fontWeight: 900, py: 1.2,
                borderColor: t.gray, borderWidth: 2,
                borderBottom: `4px solid ${t.grayDark}`, color: t.sub,
                '&:active': { borderBottomWidth: 0, transform: 'translateY(4px)' },
              }}>
              Hủy
            </Button>
            <Button onClick={handleConfirmDelete} variant="contained" fullWidth disableElevation
              sx={{ ...btn3d(t.red, t.redDark), py: 1.2 }}>
              Xóa
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </>
  );
};

export default FolderDetailModal;