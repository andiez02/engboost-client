import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../../../components/VideoPlayer/VideoPlayer';
import { getMyCourseVideoAPI } from '../../../apis';
import HeaderUser from '../../../components/Layout/HeaderUser';
import Sidebar from '../../../components/Layout/SideBar';
import { CircularProgress } from '@mui/material';
import { colors } from '../../../theme';
const UserVideoPlayer = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getMyCourseVideoAPI(courseId);
        setCourse(response);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [courseId]);
  return (
    <div className='flex'>
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-58' : 'ml-20'
        } p-5`}
        style={{
          backgroundColor: colors.sand,
          minHeight: '100vh',
        }}
      >
        <HeaderUser
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <Box
          sx={{
            mt: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          {course ? (
            <VideoPlayer course={course} isAdmin={false} />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ color: colors.sage, mb: 2 }} />
              <Typography sx={{ color: colors.dark, fontWeight: 600 }}>
                Đang tải bài học...
              </Typography>
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
};

export default UserVideoPlayer;
