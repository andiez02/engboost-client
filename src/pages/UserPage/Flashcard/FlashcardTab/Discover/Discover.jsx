import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Avatar,
  Stack,
  alpha,
} from '@mui/material';
import { FolderOutlined, Language, School, People } from '@mui/icons-material';
import { getPublicFoldersAPI } from '../../../../../apis';
import PublicFolderDetailModal from './PublicFolderDetailModal';
import { colors } from '../../../../../theme';

function Discover() {
  const [publicFolders, setPublicFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchPublicFolders = async () => {
      try {
        setIsLoading(true);
        const response = await getPublicFoldersAPI();
        setPublicFolders(response.folders || []);
      } catch (error) {
        console.error('Error fetching public folders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicFolders();
  }, []);

  const handleViewFolder = (folder) => {
    setSelectedFolder(folder);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedFolder(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress sx={{ color: colors.sage }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant='h4'
          component='h1'
          sx={{
            fontWeight: 800,
            color: colors.dark,
            mb: 1.5,
          }}
        >
          Khám phá Flashcards
        </Typography>
        <Typography
          variant='body1'
          sx={{
            color: `${colors.dark}B3`,
            fontWeight: 500,
            maxWidth: '600px',
          }}
        >
          Khám phá và học tập từ các bộ flashcards được chia sẻ bởi cộng đồng
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {publicFolders.map((folder) => (
          <Grid item xs={12} sm={6} md={4} key={folder._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.06)',
                  borderColor: colors.sage,
                },
              }}
            >
              <CardMedia
                component='div'
                sx={{
                  height: 180,
                  background: `linear-gradient(135deg, ${colors.sand} 0%, ${colors.sage}20 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: 'white',
                    color: colors.sage,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                    zIndex: 1,
                  }}
                >
                  <FolderOutlined sx={{ fontSize: 36 }} />
                </Avatar>
              </CardMedia>

              <CardContent sx={{ flexGrow: 1, p: 4 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography
                      variant='h6'
                      component='h2'
                      sx={{
                        fontWeight: 700,
                        color: colors.dark,
                        mb: 2,
                        lineHeight: 1.4,
                      }}
                    >
                      {folder.title}
                    </Typography>
                    <Stack direction='row' spacing={1.5} alignItems='center'>
                      <Chip
                        icon={<Language sx={{ fontSize: '14px !important' }} />}
                        label='Công khai'
                        size='small'
                        sx={{
                          bgcolor: `${colors.blue}15`,
                          color: colors.blue,
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      />
                      <Chip
                        icon={<School sx={{ fontSize: '14px !important' }} />}
                        label={`${folder.flashcard_count || 0} từ vựng`}
                        size='small'
                        sx={{
                          bgcolor: `${colors.sage}15`,
                          color: colors.sage,
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      />
                    </Stack>
                  </Box>

                  <Button
                    variant='contained'
                    fullWidth
                    onClick={() => handleViewFolder(folder)}
                    sx={{
                      borderRadius: '1rem',
                      textTransform: 'none',
                      py: 1.5,
                      fontWeight: 700,
                      bgcolor: colors.dark,
                      boxShadow: 'none',
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: colors.sage,
                        boxShadow: `0 8px 20px ${colors.sage}33`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Xem Flashcards
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {!isLoading && publicFolders.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
          }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: `${colors.blue}10`,
              color: colors.blue,
              mx: 'auto',
              mb: 3,
            }}
          >
            <People sx={{ fontSize: 36 }} />
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              mb: 1,
            }}
          >
            Chưa có folder công khai nào
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              maxWidth: '400px',
              mx: 'auto',
            }}
          >
            Hãy quay lại sau để xem các bộ flashcards được chia sẻ bởi cộng đồng
          </Typography>
        </Box>
      )}

      {/* Detail Modal */}
      <PublicFolderDetailModal
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        folder={selectedFolder}
      />
    </Container>
  );
}

export default Discover;
