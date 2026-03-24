import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Public as PublicIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatDuration } from '../../utils/formatter';

const CourseCardAdmin = ({ course, onEdit, onDelete, onNavigate }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.25s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
          '& .course-thumbnail img': {
            transform: 'scale(1.05)',
          },
          '& .play-button-wrapper': {
            opacity: 1,
          },
        },
      }}
    >
      <Box
        className="course-thumbnail"
        sx={{
          position: 'relative',
          height: 160,
          overflow: 'hidden',
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <CardMedia
          component="img"
          image={course.thumbnail_url || '/placeholder.jpg'}
          alt={course.title}
          sx={{
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s ease',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)',
            zIndex: 1,
          }}
        />

        <Box
          className="play-button-wrapper"
          onClick={onNavigate}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            background: 'rgba(0,0,0,0.2)',
            cursor: 'pointer',
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
              },
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderLeft: `16px solid ${theme.palette.primary.main}`,
                marginLeft: '4px',
              }}
            />
          </Box>
        </Box>

        <Chip
          icon={<AccessTimeIcon fontSize="small" />}
          label={formatDuration(course.video_duration)}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            zIndex: 2,
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            backdropFilter: 'blur(4px)',
            '& .MuiChip-icon': {
              color: 'white',
            },
            fontSize: '0.75rem',
            height: 24,
          }}
        />

        <Chip
          icon={
            course.is_public ? (
              <PublicIcon fontSize="small" />
            ) : (
              <LockIcon fontSize="small" />
            )
          }
          label={course.is_public ? 'Công khai' : 'Riêng tư'}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 2,
            backgroundColor: course.is_public
              ? alpha(theme.palette.success.main, 0.9)
              : alpha(theme.palette.grey[700], 0.9),
            color: 'white',
            fontSize: '0.75rem',
            height: 24,
            '& .MuiChip-icon': {
              color: 'white',
              fontSize: '0.875rem',
            },
          }}
        />
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          p: 2.5,
          pb: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.4,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 44,
          }}
        >
          {course.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 'auto',
            fontSize: '0.875rem',
            opacity: 0.8,
          }}
        >
          {course.description}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.5),
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {course.created_at
              ? format(new Date(course.created_at), 'dd/MM/yyyy', {
                  locale: vi,
                })
              : 'Mới tạo'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Chỉnh sửa" arrow>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(course);
                }}
                color="primary"
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa" arrow>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(course);
                }}
                color="error"
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseCardAdmin;
