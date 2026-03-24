import React, { useState, useEffect } from 'react';
import {
  Dialog,
  IconButton,
  Button,
  Typography,
  Paper,
  Box,
  Chip,
  Avatar,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  PlayArrow as PlayArrowIcon,
  FolderOutlined,
} from '@mui/icons-material';
import { getFlashcardsByFolderAPI } from '../../../../../apis';
import Cards from '../../../../../components/Card/Card';
import StudyFlashcardsModal from './StudyFlashcardsModal';

const PublicFolderDetailModal = ({ open, onClose, folder, onFolderUpdate }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);

  useEffect(() => {
    if (open && folder && folder._id) {
      fetchFlashcards();
    } else {
      setFlashcards([]);
    }
  }, [folder, open]);

  const fetchFlashcards = async () => {
    if (!folder?._id) return;

    setLoading(true);
    try {
      const response = await getFlashcardsByFolderAPI(folder._id);
      setFlashcards(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartStudy = () => {
    setIsStudyModalOpen(true);
  };

  if (!folder) return null;

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

            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {folder.title}
            </Typography>

            {folder.flashcard_count > 0 && (
              <Chip
                label={`${folder.flashcard_count} flashcards`}
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
                Không có flashcard nào
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
                Thư mục này chưa có flashcard nào để học
              </Typography>
            </Paper>
          ) : (
            <Box>
              {flashcards.map((card) => (
                <Cards
                  key={card._id}
                  card={{
                    ...card,
                    id: card._id,
                    imageUrl: card.image_url,
                  }}
                  isPublic={true}
                />
              ))}
            </Box>
          )}
        </Box>
      </Dialog>

      <StudyFlashcardsModal
        open={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
        folder={folder}
      />
    </>
  );
};

export default PublicFolderDetailModal;
