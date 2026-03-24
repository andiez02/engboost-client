import { useState, useEffect } from 'react';
import { Container, Grid, Skeleton, Box, Paper } from '@mui/material';
import HeaderUser from '../../../components/Layout/HeaderUser';
import Sidebar from '../../../components/Layout/SideBar';
import CourseCardUser from '../../../components/Course/CourseCardUser';
import { getMyCoursesAPI } from '../../../apis';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import ExploreIcon from '@mui/icons-material/Explore';
import { routes } from '../../../utils/constants';

function MyCourse() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      fetchMyCourses();
    }
  }, [currentUser]);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await getMyCoursesAPI();
      setMyCourses(response?.courses || []);
    } catch (error) {
      console.error('Error fetching my courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const EmptyCoursesHero = () => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, md: 8 },
        borderRadius: '3rem',
        textAlign: 'center',
        background: 'white',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
        mb: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ maxWidth: 700, mx: 'auto', position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'inline-flex',
            p: 2.5,
            borderRadius: '1.5rem',
            bgcolor: '#f1f5f9',
            color: '#64748b',
            mb: 4,
          }}
        >
          <SchoolIcon sx={{ fontSize: 48 }} />
        </Box>

        <h2 className="text-[28px] font-black text-slate-900 mb-3 tracking-tight">
          Bắt đầu hành trình học tập
        </h2>

        <p className="text-[15px] text-slate-500 mb-6 leading-relaxed font-medium">
          Bạn chưa đăng ký khóa học nào. Khám phá các khóa học chất lượng cao và
          bắt đầu hành trình chinh phục tiếng Anh ngay hôm nay!
        </p>

        <button
          onClick={() => navigate(routes.COURSE)}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 text-white font-bold text-[14px] shadow-lg hover:bg-slate-800 transition-all hover:shadow-xl hover:-translate-y-1"
        >
          <ExploreIcon sx={{ fontSize: 18 }} />
          Khám phá khóa học
        </button>
      </Box>
    </Paper>
  );

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-500 ${
          isSidebarOpen ? 'ml-58' : 'ml-20'
        } p-8`}
      >
        <HeaderUser
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <Container sx={{ mt: 6, minHeight: 'calc(100vh - 160px)' }}>
          {/* Page Header */}
          <Box sx={{ mb: 6 }}>
            <h4 className="text-[26px] font-black text-slate-900 mb-1 tracking-tight">
              Khóa học của tôi
            </h4>
            <p className="text-[14px] text-slate-500 font-medium">
              Tiếp tục hành trình học tập và nâng cao kỹ năng của bạn
            </p>
          </Box>

          {loading ? (
            <Grid container spacing={4}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Skeleton 
                    variant="rectangular" 
                    height={200} 
                    sx={{ borderRadius: '2rem', mb: 2 }} 
                  />
                  <Skeleton variant="text" height={32} sx={{ width: '80%', mb: 1 }} />
                  <Skeleton variant="text" height={20} sx={{ width: '60%' }} />
                </Grid>
              ))}
            </Grid>
          ) : myCourses.length === 0 ? (
            <EmptyCoursesHero />
          ) : (
            <Grid container spacing={5}>
              {myCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <CourseCardUser course={course} isRegistered={true} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </div>
    </div>
  );
}

export default MyCourse;
