import React, { useState, useEffect } from 'react';
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
  Paper,
  Box,
  Chip,
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../../../utils/constants';
import {
  getFlashcardsByFolderAPI,
  deleteFlashcardAPI,
} from '../../../../../../apis';
import Cards from '../../../../../../components/Card/Card';
import StudyFlashcardsModal from './StudyFlashcardsModal';
import { updateFlashcardCount } from '../../../../../../redux/folder/folderSlice';

const FolderDetailModal = ({
  open,
  onClose,
  folder,
  onEdit,
  onDelete,
  onFlashcardChange,
}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [folderTitle, setFolderTitle] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const folderId = folder?.id || folder?._id;
    if (open && folder && folderId) {
      setFolderTitle(folder.title);
      setSelectedFolder(folder);
      setEditMode(false);
      fetchFlashcards();
    } else {
      // Reset states when modal is closed or folder is deleted
      setFlashcards([]);
      setSelectedFolder(null);
      setFolderTitle('');
      setEditMode(false);
    }
  }, [folder, open]);

  const fetchFlashcards = async () => {
    const folderId = folder?.id || folder?._id;
    if (!folderId) return;

    setLoading(true);
    try {
      const response = await getFlashcardsByFolderAPI(folderId);
      setFlashcards(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditMode(true);
    handleMenuClose();
  };

  const handleSaveEdit = async () => {
    const folderId = selectedFolder?.id || selectedFolder?._id;
    if (folderTitle.trim() && onEdit && selectedFolder && folderId) {
      try {
        setIsUpdating(true);
        if (folderTitle.trim() !== selectedFolder.title) {
          console.log(
            'Updating folder:',
            folderId,
            'with new title:',
            folderTitle.trim()
          );
          await onEdit(folderId, { title: folderTitle.trim() });
          // Update local state with new title
          setSelectedFolder((prev) => ({
            ...prev,
            title: folderTitle.trim(),
          }));
        } else {
          console.log('Title unchanged, skipping update');
        }
      } catch (error) {
        console.error('Error updating folder:', error);
      } finally {
        setIsUpdating(false);
        setEditMode(false);
      }
    } else {
      setEditMode(false);
    }
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const folderId = selectedFolder?.id || selectedFolder?._id;
    if (onDelete && selectedFolder && folderId) {
      try {
        // Close modal first
        setDeleteDialogOpen(false);
        onClose();
        // Then delete folder
        await onDelete(folderId);
        // Show success message
        toast.success('Xóa thư mục thành công!');
      } catch (error) {
        console.error('Error deleting folder:', error);
        toast.error('Xóa thư mục thất bại. Vui lòng thử lại!');
      }
    }
  };

  const handleRemoveCard = async (cardId) => {
    const folderId = selectedFolder?.id || selectedFolder?._id;
    try {
      await deleteFlashcardAPI(cardId);
      setFlashcards(flashcards.filter((card) => (card.id || card._id) !== cardId));
      const updatedCount = (selectedFolder.flashcard_count || 0) - 1;
      const updatedFolder = {
        ...selectedFolder,
        flashcard_count: updatedCount,
      };
      setSelectedFolder(updatedFolder);

      // Update Redux store
      dispatch(
        updateFlashcardCount({
          folderId: folderId,
          count: updatedCount,
        })
      );

      if (onFlashcardChange) {
        onFlashcardChange(folderId, updatedCount);
      }
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const handleCreateFlashcard = () => {
    onClose();
    navigate(routes.FLASHCARD_SNAPLANG);
  };

  const handleStartStudy = () => {
    setIsStudyModalOpen(true);
  };

  if (!selectedFolder) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            height: '80vh',
            maxHeight: '800px',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            padding: '14px 20px',
            backgroundColor: '#ffffff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(59, 130, 246, 0.1)',
                color: 'rgb(59, 130, 246)',
                width: 40,
                height: 40,
              }}
            >
              <FolderOutlined fontSize="small" />
            </Avatar>

            {editMode ? (
              <TextField
                value={folderTitle}
                onChange={(e) => setFolderTitle(e.target.value)}
                variant="outlined"
                size="small"
                autoFocus
                inputProps={{ maxLength: 30 }}
                sx={{
                  minWidth: '220px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
            ) : (
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#1e293b' }}
              >
                {selectedFolder.title}
              </Typography>
            )}

            {!editMode && selectedFolder.flashcard_count > 0 && (
              <Chip
                label={`${selectedFolder.flashcard_count} flashcards`}
                size="small"
                sx={{
                  height: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  color: 'rgb(59, 130, 246)',
                }}
              />
            )}
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            {editMode ? (
              <>
                <Button
                  onClick={() => setEditMode(false)}
                  variant="outlined"
                  color="inherit"
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={
                    !folderTitle.trim() ||
                    isUpdating ||
                    folderTitle.trim() === selectedFolder.title
                  }
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: 'none',
                  }}
                >
                  Lưu
                </Button>
              </>
            ) : (
              <>
                {flashcards.length > 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayArrowIcon />}
                    size="small"
                    onClick={handleStartStudy}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: 'none',
                    }}
                  >
                    Bắt đầu học
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  size="small"
                  onClick={handleCreateFlashcard}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: 'none',
                  }}
                >
                  Thêm Flashcard
                </Button>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    borderRadius: '8px',
                    color: '#64748b',
                    padding: '6px',
                  }}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={onClose}
                  sx={{
                    borderRadius: '8px',
                    color: '#64748b',
                    padding: '6px',
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </>
            )}
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: '#f8fafc', p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : flashcards.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                padding: '40px 20px',
                borderRadius: '16px',
                bgcolor: '#ffffff',
                border: '1px dashed rgba(0,0,0,0.1)',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  color: 'rgb(59, 130, 246)',
                  width: 56,
                  height: 56,
                  margin: '0 auto 16px',
                }}
              >
                <FolderOutlined sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}
              >
                Chưa có flashcard nào
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  mb: 3,
                  maxWidth: '400px',
                  mx: 'auto',
                }}
              >
                Hãy tạo flashcard đầu tiên để bắt đầu học tập hiệu quả
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleCreateFlashcard}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: 'none',
                  padding: '6px 16px',
                }}
              >
                Tạo Flashcard Đầu Tiên
              </Button>
            </Paper>
          ) : (
            <Box>
              {flashcards.map((card) => (
                <Cards
                  key={card.id || card._id}
                  card={{
                    ...card,
                    id: card.id || card._id,
                    imageUrl: card.image_url,
                  }}
                  onRemove={handleRemoveCard}
                />
              ))}
            </Box>
          )}
        </Box>
      </Dialog>

      {/* Menu for Edit/Delete */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            padding: '6px',
            minWidth: '180px',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={handleEditClick}
          sx={{
            borderRadius: '8px',
            padding: '8px 12px',
            margin: '2px 0',
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
            },
          }}
        >
          <Edit fontSize="small" className="text-blue-500 mr-2" />
          <Typography variant="body2" className="font-medium">
            Đổi tên thư mục
          </Typography>
        </MenuItem>
        <Divider sx={{ margin: '4px 0' }} />
        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            borderRadius: '8px',
            padding: '8px 12px',
            margin: '2px 0',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
            },
          }}
        >
          <Delete fontSize="small" className="text-red-500 mr-2" />
          <Typography variant="body2" className="font-medium text-red-500">
            Xóa thư mục
          </Typography>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                width: 36,
                height: 36,
              }}
            >
              <Delete fontSize="small" />
            </Avatar>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: '1.1rem' }}
            >
              Xóa thư mục
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
            Bạn có chắc chắn muốn xóa thư mục{' '}
            <span style={{ fontWeight: 600 }}>"{selectedFolder.title}"</span>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569', mb: 3 }}>
            Tất cả flashcards trong thư mục này sẽ bị xóa và không thể khôi
            phục.
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              color="inherit"
              fullWidth
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                p: 1,
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              fullWidth
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                p: 1,
              }}
            >
              Xóa thư mục
            </Button>
          </Stack>
        </Box>
      </Dialog>

      <StudyFlashcardsModal
        open={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
        folder={selectedFolder}
      />
    </>
  );
};

export default FolderDetailModal;
