import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
  Stack,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Restore as RestoreIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

// Storage key format: video-progress-{courseId}
const getProgressStorageKey = (courseId) => `video-progress-${courseId}`;

const VideoPlayer = ({ course, isAdmin = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const [playedPercent, setPlayedPercent] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [savedPosition, setSavedPosition] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [saveProgressInterval, setSaveProgressInterval] = useState(null);

  // Load saved progress when component mounts
  useEffect(() => {
    if (course?._id) {
      const savedProgress = localStorage.getItem(
        getProgressStorageKey(course._id)
      );

      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setSavedPosition(progress);

        // Only show resume modal if there's significant progress (more than 10 seconds)
        if (progress.seconds > 10) {
          setShowResumeModal(true);
        }
      }

      // Set up interval to save progress every 5 seconds
      const intervalId = setInterval(() => {
        saveCurrentProgress();
      }, 5000);

      setSaveProgressInterval(intervalId);

      // Clean up interval on unmount
      return () => {
        clearInterval(intervalId);
        // Save progress one final time when leaving
        saveCurrentProgress();
      };
    }
  }, [course?._id]);

  // Save current progress to localStorage
  const saveCurrentProgress = () => {
    if (course?._id && playedSeconds > 0) {
      const progress = {
        percent: playedPercent,
        seconds: playedSeconds,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(
        getProgressStorageKey(course._id),
        JSON.stringify(progress)
      );
    }
  };

  // Handle progress updates from ReactPlayer
  const handleProgress = (state) => {
    setPlayedPercent(state.played);
    setPlayedSeconds(state.playedSeconds);
  };

  // Resume from saved position
  const handleResume = () => {
    if (playerRef.current && savedPosition) {
      playerRef.current.seekTo(savedPosition.seconds);
      setShowResumeModal(false);
    }
  };

  // Start from beginning
  const handleStartFromBeginning = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      setShowResumeModal(false);
    }
  };

  // Handle component unmount or navigation away
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentProgress();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (saveProgressInterval) {
        clearInterval(saveProgressInterval);
      }
      saveCurrentProgress();
    };
  }, [playedSeconds, playedPercent, course?._id]);

  if (!course) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <Typography variant="h6" color="text.secondary">
          Không tìm thấy khóa học
        </Typography>
      </Box>
    );
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleBack = () => {
    saveCurrentProgress(); // Save progress before navigating away
    navigate(-1);
  };

  // Calculate how long ago the video was watched
  const getTimeAgo = () => {
    if (!savedPosition?.timestamp) return '';

    const lastWatched = new Date(savedPosition.timestamp);
    const now = new Date();
    const diffMs = now - lastWatched;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ borderRadius: 2 }}
        >
          Quay lại danh sách khóa học
        </Button>
      </Box>

      {/* Video Player Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          mb: 3,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%', // 16:9 aspect ratio
          }}
        >
          <ReactPlayer
            ref={playerRef}
            url={course.video_url}
            controls
            width="100%"
            height="100%"
            onProgress={handleProgress}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </Box>
        <Box px={2} pt={1} pb={2}>
          <Box
            sx={{
              mt: 0.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Đã xem: {Math.round(playedPercent * 100)}%
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Course Information Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: 'background.paper',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <SchoolIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h5" fontWeight={600}>
              {course.title}
            </Typography>
          </Box>
          {isAdmin && (
            <Tooltip title="Chỉnh sửa khóa học">
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
          <Chip
            icon={course.is_public ? <PublicIcon /> : <LockIcon />}
            label={course.is_public ? 'Công khai' : 'Riêng tư'}
            color={course.is_public ? 'success' : 'default'}
            size="small"
            sx={{ borderRadius: 1 }}
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={formatDuration(course.video_duration)}
            size="small"
            sx={{ borderRadius: 1 }}
          />
          <Chip
            icon={<CalendarIcon />}
            label={formatDate(course.created_at)}
            size="small"
            sx={{ borderRadius: 1 }}
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
          Mô tả khóa học
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: 'pre-line',
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          {course.description}
        </Typography>
      </Paper>

      {isAdmin === false && (
        <Dialog
          open={showResumeModal}
          onClose={() => setShowResumeModal(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              maxWidth: '450px',
              width: '100%',
              position: 'absolute', // Position the modal absolutely
              top: '50%', // Center vertically
              left: '50%', // Center horizontally
              transform: 'translate(-50%, -50%)', // Adjust for centering
            },
          }}
        >
          <DialogTitle
            sx={{
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 600,
            }}
          >
            <RestoreIcon color="primary" />
            Tiếp tục xem video
          </DialogTitle>

          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Bạn đã xem video này trước đó. Bạn muốn tiếp tục từ vị trí đã lưu?
            </Typography>

            <Box
              sx={{
                mt: 3,
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {/* Circular progress indicator */}
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={savedPosition ? savedPosition.percent * 100 : 0}
                  size={80}
                  thickness={4}
                  sx={{
                    color: theme.palette.primary.main,
                    circle: {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                    fontWeight="bold"
                    fontSize="1rem"
                  >
                    {Math.round(savedPosition?.percent * 100 || 0)}%
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" fontWeight={500}>
                {formatDuration(savedPosition?.seconds || 0)} /{' '}
                {formatDuration(course.video_duration)}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Lần cuối xem: {getTimeAgo()}
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              variant="outlined"
              onClick={handleStartFromBeginning}
              startIcon={<RefreshIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Xem từ đầu
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleResume}
              startIcon={<PlayArrowIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 2,
              }}
            >
              Tiếp tục xem
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default VideoPlayer;
