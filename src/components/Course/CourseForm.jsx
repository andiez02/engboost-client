import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Grid,
  FormControlLabel,
  Switch,
  CircularProgress,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { createCourseAPI, updateCourseAPI } from '../../apis';

const CourseForm = ({ open, onClose, course, onSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_public: false,
    videoFile: null,
    thumbnailFile: null,
  });
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        is_public: course.is_public,
        videoFile: null,
        thumbnailFile: null,
      });
      setVideoPreview(course.video_url || '');
      setThumbnailPreview(course.thumbnail_url || '');
    } else {
      setFormData({
        title: '',
        description: '',
        is_public: false,
        videoFile: null,
        thumbnailFile: null,
      });
      setVideoPreview('');
      setThumbnailPreview('');
    }
    setErrors({});
  }, [course]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'is_public' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/avi',
      'video/x-matroska',
      'video/x-ms-wmv',
      'video/ogg',
    ];

    if (!validTypes.includes(file.type)) {
      toast.error(
        'Định dạng video không được hỗ trợ. Vui lòng tải lên file MP4, MOV, WEBM, AVI, MKV, WMV hoặc OGG.'
      );
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      toast.error('Kích thước video không được vượt quá 500MB');
      return;
    }

    setFormData((prev) => ({ ...prev, videoFile: file }));
    setErrors((prev) => ({ ...prev, video: '' }));

    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng tải lên file hình ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước hình ảnh không được vượt quá 5MB');
      return;
    }

    setFormData((prev) => ({ ...prev, thumbnailFile: file }));
    setErrors((prev) => ({ ...prev, thumbnail: '' }));

    const url = URL.createObjectURL(file);
    setThumbnailPreview(url);
  };

  // const clearVideoFile = () => {
  //   setFormData((prev) => ({ ...prev, videoFile: null }));
  //   setVideoPreview('');
  //   if (videoInputRef.current) {
  //     videoInputRef.current.value = '';
  //   }
  // };

  // const clearThumbnailFile = () => {
  //   setFormData((prev) => ({ ...prev, thumbnailFile: null }));
  //   setThumbnailPreview('');
  //   if (thumbnailInputRef.current) {
  //     thumbnailInputRef.current.value = '';
  //   }
  // };

  const validate = () => {
    const newErrors = {};
    const isEditing = !!course;

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề khóa học';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả khóa học';
    }

    if (!isEditing && !formData.videoFile) {
      newErrors.video = 'Vui lòng tải lên video bài giảng';
    }

    if (!isEditing && !formData.thumbnailFile) {
      newErrors.thumbnail = 'Vui lòng tải lên hình ảnh thu nhỏ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = () => {
    if (!course) return true; // New course always has changes
    return (
      formData.title !== course.title ||
      formData.description !== course.description ||
      formData.is_public !== course.is_public ||
      formData.videoFile !== null ||
      formData.thumbnailFile !== null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('is_public', formData.is_public);
      if (formData.videoFile) {
        formDataToSend.append('video', formData.videoFile);
      }
      if (formData.thumbnailFile) {
        formDataToSend.append('thumbnail', formData.thumbnailFile);
      }

      if (course) {
        await updateCourseAPI(course._id, formDataToSend);
        toast.success('Cập nhật khóa học thành công!');
      } else {
        await createCourseAPI(formDataToSend);
        toast.success('Tạo khóa học thành công!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting course:', error);
      toast.error(
        course
          ? 'Không thể cập nhật khóa học. Vui lòng thử lại sau.'
          : 'Không thể tạo khóa học. Vui lòng thử lại sau.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [videoPreview, thumbnailPreview]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          m: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <SchoolIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              {course ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề khóa học"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả khóa học"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_public}
                    onChange={handleChange}
                    name="is_public"
                  />
                }
                label="Công khai khóa học"
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Video bài giảng
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: errors.video ? 'error.main' : 'grey.300',
                    borderRadius: 1,
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    style={{ display: 'none' }}
                    ref={videoInputRef}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    onClick={() => videoInputRef.current?.click()}
                  >
                    Tải lên video
                  </Button>
                  {videoPreview && (
                    <Box sx={{ mt: 2 }}>
                      <video
                        controls
                        src={videoPreview}
                        style={{ maxWidth: '100%', maxHeight: '400px' }}
                      />
                    </Box>
                  )}
                  {errors.video && (
                    <Typography color="error" sx={{ mt: 1 }}>
                      {errors.video}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Hình ảnh thu nhỏ
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: errors.thumbnail ? 'error.main' : 'grey.300',
                    borderRadius: 1,
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    style={{ display: 'none' }}
                    ref={thumbnailInputRef}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    Tải lên hình ảnh
                  </Button>
                  {thumbnailPreview && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                      />
                    </Box>
                  )}
                  {errors.thumbnail && (
                    <Typography color="error" sx={{ mt: 1 }}>
                      {errors.thumbnail}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>

          {isSubmitting && (
            <Box sx={{ width: '100%', mt: 3 }}>
              <LinearProgress
                variant="indeterminate"
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
          )}

          <DialogActions sx={{ pt: 2 }}>
            <Button onClick={onClose} color="inherit">
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || !hasChanges()}
              sx={{ borderRadius: 2 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : course ? (
                'Cập nhật'
              ) : (
                'Tạo khóa học'
              )}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CourseForm;
