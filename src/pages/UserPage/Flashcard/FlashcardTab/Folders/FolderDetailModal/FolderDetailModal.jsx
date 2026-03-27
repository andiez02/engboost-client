import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
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
} from '@mui/material';
import {
  MoreVert,
  Close,
  Edit,
  Delete,
  Add,
  FolderOutlined,
  PlayArrow as PlayArrowIcon,
  StyleOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../../../utils/constants';
import {
  getFlashcardsByFolderAPI,
  deleteFlashcardAPI,
} from '../../../../../../apis';
import FlashcardCard from '../../../../../../components/Flashcard/FlashcardCard';
import { updateFlashcardCount } from '../../../../../../redux/folder/folderSlice';
import FlashcardPreviewModal from './FlashcardPreviewModal';
import { gamify as t, btn3d } from '../../../../../../theme';

/* ─── Count badge ────────────────────────────────────────────────────────── */
const CountBadge = ({ count }) =>
  count > 0 ? (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.2,
        py: 0.4,
        borderRadius: 2,
        fontSize: '0.75rem',
        fontWeight: 900,
        bgcolor: t.blueBg,
        color: t.blue,
        border: `2px solid ${t.blue}`,
      }}
    >
      <StyleOutlined sx={{ fontSize: 12 }} />
      {count}
    </Box>
  ) : null;

/* ─── Empty state ────────────────────────────────────────────────────────── */
const EmptyState = ({ onCreate }) => (
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
        width: 80,
        height: 80,
        borderRadius: 4,
        bgcolor: t.surface,
        border: `2px solid ${t.gray}`,
        borderBottom: `4px solid ${t.gray}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 1,
      }}
    >
      <span style={{ fontSize: 36 }}>📁</span>
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
);

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
  const [previewOpen, setPreviewOpen] = useState(false);


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
      fetchFlashcards();
    } else {
      setFlashcards([]);
      setSelectedFolder(null);
      setFolderTitle('');
      setEditMode(false);
    }
  }, [folder, open, fetchFlashcards]);

  const handleSaveEdit = async () => {
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
  };

  const handleConfirmDelete = async () => {
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
  };

  const handleRemoveCard = async (cardId) => {
    const folderId = selectedFolder?.id || selectedFolder?._id;
    try {
      await deleteFlashcardAPI(cardId);
      const next = flashcards.filter((c) => (c.id || c._id) !== cardId);
      setFlashcards(next);
      const updatedCount = (selectedFolder.flashcard_count || 0) - 1;
      setSelectedFolder((prev) => ({ ...prev, flashcard_count: updatedCount }));
      dispatch(updateFlashcardCount({ folderId, count: updatedCount }));
      onFlashcardChange?.(folderId, updatedCount);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateFlashcard = () => {
    onClose();
    navigate(routes.FLASHCARD_SNAPLANG);
  };

  if (!selectedFolder) return null;

  /* ── header content ── */
  const headerContent = editMode ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2.5,
        py: 2,
        borderBottom: `2px solid ${t.gray}`,
        bgcolor: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
        <Avatar sx={{ bgcolor: t.blueBg, color: t.blue, width: 38, height: 38, border: `2px solid ${t.blue}` }}>
          <FolderOutlined fontSize="small" />
        </Avatar>
        <TextField
          value={folderTitle}
          onChange={(e) => setFolderTitle(e.target.value)}
          variant="outlined"
          size="small"
          autoFocus
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
          sx={{ borderRadius: 3, textTransform: 'uppercase', fontWeight: 900, fontSize: '0.78rem', color: t.sub, borderColor: t.gray, borderWidth: 2, borderBottom: `4px solid ${t.grayDark}`, '&:active': { borderBottomWidth: 0, transform: 'translateY(4px)' } }}
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
        py: 2,
        borderBottom: `2px solid ${t.gray}`,
        bgcolor: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <Avatar sx={{ bgcolor: t.blueBg, color: t.blue, width: 42, height: 42, flexShrink: 0, border: `2px solid ${t.blue}` }}>
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
        {flashcards.length > 0 && (
          <Button variant="contained" startIcon={<StyleOutlined sx={{ fontSize: '1rem !important' }} />} size="small" onClick={() => setPreviewOpen(true)} disableElevation
            sx={{ ...btn3d(t.blue, t.blueDark), px: 2, py: 0.7, fontSize: '0.75rem' }}>
            Xem thẻ
          </Button>
        )}
        <Button variant="outlined" startIcon={<Add sx={{ fontSize: '1rem !important' }} />} size="small" onClick={handleCreateFlashcard} disableElevation
          sx={{ borderRadius: 3, textTransform: 'uppercase', fontWeight: 900, fontSize: '0.75rem', px: 2, py: 0.7, color: t.text, borderColor: t.gray, borderWidth: 2, borderBottom: `4px solid ${t.grayDark}`, '&:hover': { bgcolor: t.surface }, '&:active': { borderBottomWidth: 0, transform: 'translateY(4px)' } }}>
          Thêm
        </Button>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small"
          sx={{ borderRadius: 3, color: t.sub, border: `2px solid ${t.gray}`, width: 34, height: 34, '&:hover': { bgcolor: t.surface } }}>
          <MoreVert sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton onClick={onClose} size="small"
          sx={{ borderRadius: 3, color: t.sub, border: `2px solid ${t.gray}`, width: 34, height: 34, '&:hover': { bgcolor: t.redBg, color: t.red, borderColor: t.red } }}>
          <Close sx={{ fontSize: 18 }} />
        </IconButton>
      </Stack>
    </Box>
  );

  return (
    <>
      {/* ── Main Dialog ──────────────────────────────────────────────────── */}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            border: `2px solid ${t.gray}`,
            borderBottom: `4px solid ${t.grayDark}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            height: '82vh',
            maxHeight: 820,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {headerContent}

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            bgcolor: t.surface,
            p: loading || flashcards.length === 0 ? 0 : 2.5,
            '&::-webkit-scrollbar': { width: 5 },
            '&::-webkit-scrollbar-thumb': {
              background: t.gray,
              borderRadius: 10,
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress size={32} sx={{ color: t.blue }} />
            </Box>
          ) : flashcards.length === 0 ? (
            <EmptyState onCreate={handleCreateFlashcard} />
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 2,
                alignItems: 'stretch',
              }}
            >
              {flashcards.map((card) => {
                const id = card.id || card._id;
                return (
                  <FlashcardCard
                    key={id}
                    card={{
                      ...card,
                      id,
                      imageUrl: card.image_url || card.imageUrl || null,
                    }}
                    onRemove={handleRemoveCard}
                  />
                );
              })}
            </Box>
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
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            p: '4px',
            minWidth: 180,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => { setEditMode(true); setAnchorEl(null); }}
          sx={{ borderRadius: 2, px: 1.5, py: 1, gap: 1.2, '&:hover': { bgcolor: t.blueBg } }}
        >
          <Edit fontSize="small" sx={{ color: t.blue, fontSize: 16 }} />
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 900, color: t.text }}>
            Đổi tên
          </Typography>
        </MenuItem>
        <Divider sx={{ my: '4px', borderColor: t.gray }} />
        <MenuItem
          onClick={() => { setAnchorEl(null); setDeleteDialogOpen(true); }}
          sx={{ borderRadius: 2, px: 1.5, py: 1, gap: 1.2, '&:hover': { bgcolor: t.redBg } }}
        >
          <Delete fontSize="small" sx={{ color: t.red, fontSize: 16 }} />
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 900, color: t.red }}>
            Xóa thư mục
          </Typography>
        </MenuItem>
      </Menu>

      {/* ── Flashcard Preview Modal ───────────────────────────────────────── */}
      <FlashcardPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        cards={flashcards}
      />

      {/* ── Delete confirmation ───────────────────────────────────────────── */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: 3, bgcolor: t.redBg, border: `2px solid ${t.red}`, borderBottom: `4px solid ${t.redDark}`,
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
              "{selectedFolder.title}"
            </Box>{' '}
            sẽ bị xóa vĩnh viễn.
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" fullWidth disableElevation
              sx={{ borderRadius: 3, textTransform: 'uppercase', fontWeight: 900, py: 1.2, borderColor: t.gray, borderWidth: 2, borderBottom: `4px solid ${t.grayDark}`, color: t.sub, '&:active': { borderBottomWidth: 0, transform: 'translateY(4px)' } }}>
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