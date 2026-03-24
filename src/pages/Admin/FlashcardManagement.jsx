import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Modal,
  Fade,
  Backdrop,
  TextField,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack,
  alpha,
  useTheme,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Public as PublicIcon,
  PublicOff as PublicOffIcon,
} from '@mui/icons-material';
import {
  getFoldersAPI,
  createFolderAPI,
  updateFolderAPI,
  deleteFolderAPI,
  makeFolderPublicAPI,
} from '../../apis';
import AdminFolderDetailModal from '../../components/Folder/AdminFolderDetailModal';
import {
  fetchFolders,
  createFolder,
  deleteFolder,
  updateFolder,
} from '../../redux/folder/folderSlice';
import { toast } from 'react-toastify';

const FlashcardManagement = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { folders, isLoading } = useSelector((state) => state.folders);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolderTitle, setNewFolderTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicDialogOpen, setPublicDialogOpen] = useState(false);
  const [folderToToggle, setFolderToToggle] = useState(null);

  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  const handleCreateFolder = async () => {
    if (!newFolderTitle.trim()) return;

    try {
      setIsSubmitting(true);
      await dispatch(
        createFolder({
          title: newFolderTitle.trim(),
          is_public: false,
        })
      );
      setIsCreateDialogOpen(false);
      setNewFolderTitle('');
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFolder = async (folderId, data) => {
    try {
      setIsSubmitting(true);
      const response = await updateFolderAPI(folderId, data);
      if (response && response.folder) {
        dispatch(updateFolder(response.folder));
        return response;
      }
    } catch (error) {
      console.error('Error updating folder:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      setIsSubmitting(true);
      await dispatch(deleteFolder(folderId)).unwrap();
    } catch (error) {
      console.error('Error deleting folder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDetailModal = (folder) => {
    setSelectedFolder(folder);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedFolder(null);
    setIsDetailModalOpen(false);
  };

  const handleTogglePublicClick = (folder) => {
    setFolderToToggle(folder);
    setPublicDialogOpen(true);
  };

  const handleConfirmTogglePublic = async () => {
    if (!folderToToggle) return;

    try {
      setIsSubmitting(true);
      const response = await makeFolderPublicAPI(folderToToggle._id);
      if (response && response.folder) {
        dispatch(updateFolder(response.folder));
        toast.success(
          response.message || 'Đã cập nhật trạng thái thư mục thành công'
        );
      }
    } catch (error) {
      console.error('Error updating folder public status:', error);
      toast.error('Cập nhật trạng thái thư mục thất bại. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
      setPublicDialogOpen(false);
      setFolderToToggle(null);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          py: 4,
          px: { xs: 2, sm: 3 },
          borderRadius: 3,
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              color="primary.main"
              gutterBottom
            >
              Quản lý thư mục từ vựng
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tạo và quản lý các flashcard
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
            size="large"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              },
            }}
          >
            Tạo thư mục mới
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {Array.isArray(folders) &&
          folders.map((folder) => (
            <Grid item xs={12} sm={6} md={4} key={folder._id}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    borderColor: 'rgba(0,0,0,0.12)',
                  },
                }}
                onClick={() => handleOpenDetailModal(folder)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      flex: 1,
                    }}
                  >
                    {folder.title}
                  </Typography>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePublicClick(folder);
                    }}
                    variant="outlined"
                    disabled={isSubmitting}
                    startIcon={
                      folder.is_public ? (
                        <PublicIcon fontSize="small" />
                      ) : (
                        <PublicOffIcon fontSize="small" />
                      )
                    }
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      borderColor: folder.is_public
                        ? 'rgba(59, 130, 246, 0.5)'
                        : 'rgba(100, 116, 139, 0.5)',
                      color: folder.is_public ? 'rgb(59, 130, 246)' : '#64748b',
                      '&:hover': {
                        borderColor: folder.is_public
                          ? 'rgb(59, 130, 246)'
                          : 'rgba(0,0,0,0.24)',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {folder.is_public ? 'Công khai' : 'Riêng tư'}
                  </Button>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: '#64748b', fontSize: '0.875rem' }}
                >
                  {folder.flashcard_count || 0} từ vựng
                </Typography>
              </Box>
            </Grid>
          ))}
      </Grid>

      {/* Create Folder Modal */}
      <Modal
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isCreateDialogOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              p: 4,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              Tạo thư mục mới
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Tên thư mục"
              fullWidth
              value={newFolderTitle}
              onChange={(e) => setNewFolderTitle(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <Button
                onClick={() => setIsCreateDialogOpen(false)}
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
                onClick={handleCreateFolder}
                disabled={isSubmitting || !newFolderTitle.trim()}
                variant="contained"
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
                Tạo thư mục
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Folder Detail Modal */}
      {selectedFolder && (
        <AdminFolderDetailModal
          open={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          folder={selectedFolder}
          onEdit={handleEditFolder}
          onDelete={handleDeleteFolder}
        />
      )}

      {/* Add confirmation dialog */}
      <Dialog
        open={publicDialogOpen}
        onClose={() => !isSubmitting && setPublicDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 2,
            maxWidth: '400px',
            width: '100%',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: folderToToggle?.is_public
                ? 'rgba(100, 116, 139, 0.1)'
                : 'rgba(59, 130, 246, 0.1)',
              color: folderToToggle?.is_public
                ? '#64748b'
                : 'rgb(59, 130, 246)',
              width: 36,
              height: 36,
            }}
          >
            {folderToToggle?.is_public ? <PublicOffIcon /> : <PublicIcon />}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {folderToToggle?.is_public
              ? 'Chuyển thành riêng tư'
              : 'Chuyển thành công khai'}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          {folderToToggle?.is_public
            ? 'Bạn có chắc chắn muốn chuyển thư mục này thành riêng tư? Khi đó, người dùng khác sẽ không thể xem được nội dung của thư mục.'
            : 'Bạn có chắc chắn muốn chuyển thư mục này thành công khai? Khi đó, tất cả người dùng đều có thể xem được nội dung của thư mục.'}
        </Typography>

        <Stack direction="row" spacing={1.5}>
          <Button
            onClick={() => !isSubmitting && setPublicDialogOpen(false)}
            variant="outlined"
            color="inherit"
            fullWidth
            disabled={isSubmitting}
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
            onClick={handleConfirmTogglePublic}
            variant="contained"
            color={folderToToggle?.is_public ? 'inherit' : 'primary'}
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
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : folderToToggle?.is_public ? (
              'Chuyển thành riêng tư'
            ) : (
              'Chuyển thành công khai'
            )}
          </Button>
        </Stack>
      </Dialog>
    </Container>
  );
};

export default FlashcardManagement;
