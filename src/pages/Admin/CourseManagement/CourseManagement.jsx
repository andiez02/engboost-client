import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Tooltip,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { deleteCourseAPI, getAllCoursesAPI } from '../../../apis';
import CourseForm from '../../../components/Course/CourseForm';
import CourseCardAdmin from '../../../components/Course/CourseCardAdmin';

const CourseManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getAllCoursesAPI();
      const coursesData = response?.courses || [];
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (course = null) => {
    setSelectedCourse(course);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedCourse(null);
  };

  const handleOpenDeleteDialog = (course) => {
    setSelectedCourse(course);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCourse(null);
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      await deleteCourseAPI(selectedCourse._id);
      toast.success('Xóa khóa học thành công!');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Không thể xóa khóa học. Vui lòng thử lại sau.');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Đang tải khóa học...
        </Typography>
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
              Quản lý khóa học
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tạo và quản lý các khóa học video cho người học
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
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
            Thêm khóa học
          </Button>
        </Box>
      </Box>

      {courses.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: `1px dashed ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <SchoolIcon
              sx={{ fontSize: 60, color: 'text.disabled', opacity: 0.5 }}
            />
            <Typography variant="h6" color="text.secondary">
              Chưa có khóa học nào
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
              Hãy tạo khóa học đầu tiên để bắt đầu!
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm()}
            >
              Thêm khóa học mới
            </Button>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
              <CourseCardAdmin
                course={course}
                onEdit={handleOpenForm}
                onDelete={handleOpenDeleteDialog}
                onNavigate={() =>
                  navigate(`/admin/courses/${course._id}/video`)
                }
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CourseForm
        open={openForm}
        onClose={handleCloseForm}
        course={selectedCourse}
        onSuccess={fetchCourses}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center">
            <DeleteIcon color="error" sx={{ mr: 1 }} />
            Xác nhận xóa
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa khóa học "
            <strong>{selectedCourse?.title}</strong>"? Hành động này không thể
            hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleDeleteCourse}
            color="error"
            variant="contained"
            autoFocus
            sx={{ borderRadius: 2 }}
            className="interceptor-loading"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseManagement;
