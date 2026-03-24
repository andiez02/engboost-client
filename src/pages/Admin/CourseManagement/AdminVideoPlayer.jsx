import React, { useEffect, useState } from 'react';
import { getCourseByIdAPI } from '../../../apis';
import VideoPlayer from '../../../components/VideoPlayer/VideoPlayer';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminVideoPlayer = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  console.log('🚀 ~ AdminVideoPlayer ~ course:', course);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        console.log('Fetching course with ID:', courseId);
        const response = await getCourseByIdAPI(courseId);
        console.log('API Response:', response);

        if (response) {
          setCourse(response);
        } else {
          console.error('Invalid API response structure:', response);
          toast.error('Không thể tải thông tin khóa học');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Có lỗi xảy ra khi tải khóa học');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

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

  if (!course) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
        flexDirection="column"
        gap={2}
      >
        <Typography variant="h6" color="text.secondary">
          Không tìm thấy khóa học
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Vui lòng kiểm tra lại ID khóa học
        </Typography>
      </Box>
    );
  }

  console.log('Rendering VideoPlayer with course:', course);
  return <VideoPlayer course={course} isAdmin={true} />;
};

export default AdminVideoPlayer;
