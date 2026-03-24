import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatDuration } from '../../utils/formatter';
import { colors } from '../../theme';

const CourseCardUser = ({ course, isRegistered }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNavigateToVideo = () => {
    navigate(`/my_course/${course._id}/video`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '2rem',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.06)',
          borderColor: colors.sage,
          '& .play-overlay': {
            opacity: 1,
          },
          '& .thumbnail-img': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {/* Thumbnail Container */}
      <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
        <CardMedia
          component='img'
          image={course.thumbnail_url || '/placeholder.jpg'}
          alt={course.title}
          className='thumbnail-img'
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          loading='lazy'
        />

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Play Button Overlay */}
        <Box
          className="play-overlay"
          onClick={handleNavigateToVideo}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            cursor: 'pointer',
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              transform: 'scale(0.9)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                transform: 'scale(1)',
              },
            }}
          >
            <PlayArrowIcon
              sx={{ color: colors.sage, fontSize: 32 }}
            />
          </Box>
        </Box>

        {/* Duration Chip */}
        <Chip
          icon={<AccessTimeIcon fontSize='small' sx={{ color: 'white !important' }} />}
          label={formatDuration(course.video_duration)}
          size='small'
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            zIndex: 3,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            height: 24,
            fontWeight: 700,
            fontSize: '0.7rem',
            px: 0.5,
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant='h6'
          component='h2'
          sx={{
            fontWeight: 800,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1.5,
            height: 44,
            color: colors.dark,
          }}
        >
          {course.title}
        </Typography>

        <Typography
          variant='body2'
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 3,
            fontSize: '0.85rem',
            lineHeight: 1.6,
            height: 42,
            color: `${colors.dark}99`,
            fontWeight: 500,
          }}
        >
          {course.description}
        </Typography>

        <Button
          variant='contained'
          fullWidth
          onClick={handleNavigateToVideo}
          sx={{
            mt: 'auto',
            textTransform: 'none',
            borderRadius: '1rem',
            fontWeight: 800,
            py: 1.5,
            fontSize: '0.9rem',
            backgroundColor: colors.dark,
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: colors.sage,
              boxShadow: `0 10px 25px ${colors.sage}4D`,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
          startIcon={isRegistered ? <PlayArrowIcon /> : null}
        >
          {isRegistered ? 'Tiếp tục học' : 'Xem khóa học'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCardUser;
