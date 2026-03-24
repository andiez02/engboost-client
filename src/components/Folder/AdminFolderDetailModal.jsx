import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Menu,
  MenuItem,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  MoreVert,
  FolderOutlined,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import FlashcardList from './FlashcardList';
import EmptyFlashcardState from './EmptyFlashcardState';
import FlashcardForm from './FlashcardForm';
import {
  getFlashcardsByFolderAPI,
  deleteFlashcardAPI,
  saveFlashcardsToFolderAPI,
  makeFolderPublicAPI,
} from '../../apis/index';

const AdminFolderDetailModal = ({
  open,
  onClose,
  folder,
  onEdit,
  onDelete,
}) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingFlashcard, setIsAddingFlashcard] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [deleteFlashcardDialogOpen, setDeleteFlashcardDialogOpen] =
    useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState(null);
  const [publicDialogOpen, setPublicDialogOpen] = useState(false);

  useEffect(() => {
    if (open && folder) {
      console.log('Setting selected folder:', folder);
      console.log('Folder ID:', folder._id);
      setSelectedFolder(folder);
      setNewTitle(folder.title);
    } else {
      console.log('Clearing selected folder, open:', open, 'folder:', folder);
      setSelectedFolder(null);
      setNewTitle('');
      setFlashcards([]);
    }
  }, [open, folder]);

  useEffect(() => {
    if (selectedFolder) {
      console.log('Fetching flashcards for selected folder:', selectedFolder);
      console.log('Selected folder ID:', selectedFolder._id);
      fetchFlashcards();
    }
  }, [selectedFolder]);

  const fetchFlashcards = async () => {
    if (!selectedFolder) {
      console.error('No selected folder found');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching flashcards for folder:', selectedFolder._id);
      const data = await getFlashcardsByFolderAPI(selectedFolder._id);
      // Map english and vietnamese to front and back for display
      const formattedData = data.map((card) => ({
        ...card,
        front: card.english,
        back: card.vietnamese,
      }));
      console.log('Formatted flashcards:', formattedData);
      setFlashcards(formattedData);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlashcard = async (flashcardData) => {
    if (!selectedFolder) {
      toast.error('Không tìm thấy thư mục. Vui lòng thử lại!');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Creating flashcard for folder:', selectedFolder._id);
      console.log('Flashcard data:', flashcardData);
      await saveFlashcardsToFolderAPI({
        folder_id: selectedFolder._id,
        create_new_folder: false,
        folder_title: null,
        flashcards: flashcardData.flashcards.map((card) => ({
          english: card.english,
          vietnamese: card.vietnamese,
          imageUrl: card.image_url,
          object: card.english, // Object is same as English word
        })),
      });
      await fetchFlashcards();
      setIsAddingFlashcard(false);

      // Update folder's flashcard count
      const updatedCount =
        (selectedFolder.flashcard_count || 0) + flashcardData.flashcards.length;
      const updatedFolder = {
        ...selectedFolder,
        flashcard_count: updatedCount,
      };
      setSelectedFolder(updatedFolder);

      // Update parent folder list
      if (onEdit) {
        await onEdit(selectedFolder._id, {
          title: selectedFolder.title,
          is_public: selectedFolder.is_public,
        });
      }

      toast.success('Thêm từ vựng thành công!');
    } catch (error) {
      console.error('Error creating flashcard:', error);
      toast.error('Thêm từ vựng thất bại. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFlashcardClick = (flashcardId) => {
    setFlashcardToDelete(flashcardId);
    setDeleteFlashcardDialogOpen(true);
  };

  const handleConfirmDeleteFlashcard = async () => {
    if (!flashcardToDelete || !selectedFolder) return;

    try {
      await deleteFlashcardAPI(flashcardToDelete);
      // Update local state
      setFlashcards(
        flashcards.filter((card) => card._id !== flashcardToDelete)
      );

      // Update folder's flashcard count
      const updatedCount = (selectedFolder.flashcard_count || 0) - 1;
      const updatedFolder = {
        ...selectedFolder,
        flashcard_count: updatedCount,
      };
      setSelectedFolder(updatedFolder);

      // Update parent folder list
      if (onEdit) {
        await onEdit(selectedFolder._id, {
          title: selectedFolder.title,
          is_public: selectedFolder.is_public,
        });
      }
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast.error('Xóa từ vựng thất bại. Vui lòng thử lại!');
    } finally {
      setDeleteFlashcardDialogOpen(false);
      setFlashcardToDelete(null);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditingTitle(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!newTitle.trim() || !selectedFolder) return;

    try {
      setIsSubmitting(true);
      if (newTitle.trim() !== selectedFolder.title) {
        const response = await onEdit(selectedFolder._id, {
          title: newTitle.trim(),
          is_public: selectedFolder.is_public,
        });
        if (response && response.folder) {
          setSelectedFolder(response.folder);
          setIsEditingTitle(false);
          toast.success(response.message);
        }
      } else {
        setIsEditingTitle(false);
      }
    } catch (error) {
      console.error('Error updating folder:', error);
      toast.error('Cập nhật tên thư mục thất bại. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedFolder) return;

    try {
      setIsSubmitting(true);
      await onDelete(selectedFolder._id);
      setDeleteDialogOpen(false);
      onClose();
      toast.success('Xóa thư mục thành công!');
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Xóa thư mục thất bại. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmTogglePublic = async () => {
    if (!selectedFolder) return;

    try {
      setIsSubmitting(true);
      const newPublicStatus = !selectedFolder.is_public;
      const response = await makeFolderPublicAPI(
        selectedFolder._id,
        newPublicStatus
      );
      if (response && response.folder) {
        setSelectedFolder(response.folder);
        // Update parent folder list
        if (onEdit) {
          await onEdit(selectedFolder._id, {
            title: selectedFolder.title,
            is_public: response.folder.is_public,
          });
        }
        toast.success(
          response.message ||
            (newPublicStatus
              ? 'Đã chuyển thư mục thành công khai'
              : 'Đã chuyển thư mục thành riêng tư')
        );
      }
    } catch (error) {
      console.error('Error updating folder public status:', error);
      toast.error('Cập nhật trạng thái thư mục thất bại. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
      setPublicDialogOpen(false);
    }
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
            borderRadius: '16px',
            maxHeight: '90vh',
            transition: 'all 0.2s ease-in-out',
            transform: open ? 'scale(1)' : 'scale(0.95)',
            opacity: open ? 1 : 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}
          component="div"
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

            {isEditingTitle ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  size="small"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  sx={{
                    width: '300px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveEdit}
                  disabled={
                    isSubmitting ||
                    !newTitle.trim() ||
                    newTitle.trim() === selectedFolder.title
                  }
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: 'none',
                    bgcolor: '#3b82f6',
                    '&:hover': {
                      bgcolor: '#2563eb',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Lưu
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setIsEditingTitle(false);
                    setNewTitle(selectedFolder.title);
                  }}
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
              </Box>
            ) : (
              <>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedFolder.title}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    color: '#64748b',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.02)',
                    },
                  }}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={() => setIsAddingFlashcard(true)}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: 'none',
                  }}
                >
                  Thêm từ vựng
                </Button>
              </>
            )}
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: '#64748b',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.02)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
              }}
            >
              <CircularProgress size={24} />
            </Box>
          ) : (
            <>
              {flashcards.length === 0 ? (
                <EmptyFlashcardState
                  onAddClick={() => setIsAddingFlashcard(true)}
                />
              ) : (
                <FlashcardList
                  flashcards={flashcards}
                  onDeleteCard={handleDeleteFlashcardClick}
                />
              )}

              {isAddingFlashcard && (
                <FlashcardForm
                  onSubmit={handleCreateFlashcard}
                  onCancel={() => setIsAddingFlashcard(false)}
                  isSubmitting={isSubmitting}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            minWidth: '180px',
          },
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1.5, color: '#64748b' }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1.5, color: '#ef4444' }} />
          Xóa thư mục
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 2,
            maxWidth: '400px',
            width: '100%',
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Xác nhận xóa thư mục
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Bạn có chắc chắn muốn xóa thư mục này? Hành động này không thể hoàn
          tác.
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
            disabled={isSubmitting}
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
      </Dialog>

      <Dialog
        open={deleteFlashcardDialogOpen}
        onClose={() => setDeleteFlashcardDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 2,
            maxWidth: '400px',
            width: '100%',
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Xác nhận xóa từ vựng
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Bạn có chắc chắn muốn xóa từ vựng này? Hành động này không thể hoàn
          tác.
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button
            onClick={() => setDeleteFlashcardDialogOpen(false)}
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
            onClick={handleConfirmDeleteFlashcard}
            variant="contained"
            color="error"
            fullWidth
            disabled={isSubmitting}
            className="interceptor-loading"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              p: 1,
            }}
          >
            Xóa từ vựng
          </Button>
        </Stack>
      </Dialog>
    </>
  );
};

export default AdminFolderDetailModal;
