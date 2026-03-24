import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  Chip,
  Box,
  IconButton,
  useTheme,
  alpha,
  Divider,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Public as PublicIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  Close as CloseIcon,
  CalendarToday as CalendarTodayIcon,
  School as SchoolIcon,
  CheckCircle as MuiCheckCircleIcon,
} from '@mui/icons-material';
import {
  getMyCoursesAPI,
  getPublicCoursesAPI,
  registerCourseAPI,
} from '../../apis';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../../utils/constants';
import { RefreshCwIcon } from 'lucide-react';
import { colors } from '../../theme';

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Course = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [courses, setCourses] = useState([]);
  const [myCoursesIds, setMyCoursesIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    fetchCourses();
  }, [currentUser]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getPublicCoursesAPI();
      const publicCourses = response?.courses || [];

      if (currentUser) {
        try {
          const myCoursesResponse = await getMyCoursesAPI();
          const myCourses = myCoursesResponse?.courses || [];

          // Lưu danh sách ID khóa học đã đăng ký
          const registeredIds = myCourses.map((course) => course._id);
          setMyCoursesIds(registeredIds);

          // Đánh dấu các khóa học đã đăng ký trong danh sách công khai
          const enhancedCourses = publicCourses.map((course) => ({
            ...course,
            isRegistered: registeredIds.includes(course._id),
          }));

          setCourses(enhancedCourses);
        } catch (error) {
          console.error('Error fetching registered courses:', error);
          // Nếu có lỗi khi lấy khóa học đã đăng ký, vẫn hiển thị khóa học công khai
          setCourses(publicCourses);
        }
      } else {
        setCourses(publicCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegisterCourse = async (courseId) => {
    // Kiểm tra đăng nhập trước khi đăng ký
    if (!currentUser) {
      // Lưu URL hiện tại vào localStorage để sau khi đăng nhập có thể quay lại
      localStorage.setItem('redirectAfterLogin', location.pathname);

      // Đóng modal nếu đang mở
      handleCloseModal();

      // Hiển thị thông báo
      toast.info('Vui lòng đăng nhập để đăng ký khóa học');

      // Chuyển hướng đến trang đăng nhập
      navigate('/login');
      return;
    }

    try {
      const response = await registerCourseAPI(courseId);
      toast.success(response?.message || 'Đăng ký khóa học thành công');

      // Cập nhật trạng thái đăng ký trong state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId ? { ...course, isRegistered: true } : course
        )
      );

      // Thêm ID khóa học vào danh sách đã đăng ký
      setMyCoursesIds((prev) => [...prev, courseId]);

      // Nếu đang mở modal, cập nhật selectedCourse
      if (selectedCourse && selectedCourse._id === courseId) {
        setSelectedCourse({
          ...selectedCourse,
          isRegistered: true,
        });
      }
    } catch (error) {
      console.error('Error registering course:', error);
    }
  };


  return (
    <div style={{ backgroundColor: colors.sand, minHeight: '100vh' }}>
      <Header />

      <Container sx={{ mb: 8, mt: 8, minHeight: 'calc(100vh - 100px)' }}>
        {/* Course Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 8,
            textAlign: 'center',
          }}
          data-aos='fade-down'
        >
          <Typography
            variant='h3'
            component='h1'
            sx={{
              fontWeight: 800,
              color: colors.dark,
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Khám Phá <span style={{ color: colors.sage }}>Khóa Học</span>
          </Typography>
          <Box
            sx={{
              width: 80,
              height: 4,
              bgcolor: colors.rose,
              borderRadius: 2,
              mb: 3,
            }}
          />
          <Typography
            variant='body1'
            sx={{
              color: `${colors.dark}CC`,
              maxWidth: 600,
              fontSize: '1.1rem',
              fontWeight: 500,
            }}
          >
            Bắt đầu hành trình chinh phục tiếng Anh của bạn với những lộ trình học tập được cá nhân hóa và hiện đại nhất.
          </Typography>
        </Box>

        {/* Courses Grid */}
        {loading ? (
          <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '2rem',
                    overflow: 'hidden',
                    bgcolor: 'white',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  }}
                >
                  <Skeleton variant='rectangular' height={200} />
                  <CardContent sx={{ p: 4 }}>
                    <Skeleton variant='text' height={32} sx={{ mb: 2 }} />
                    <Skeleton variant='text' />
                    <Skeleton variant='text' width='60%' />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredCourses.length === 0 ? (
          <Box
            sx={{
              py: 12,
              px: 4,
              textAlign: 'center',
              borderRadius: '3rem',
              backgroundColor: alpha(colors.white, 0.4),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(colors.white, 0.6)}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
              my: 4,
            }}
          >
            <Box
              sx={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(colors.sage, 0.1)} 0%, ${alpha(colors.blue, 0.1)} 100%)`,
                mb: 4,
                position: 'relative',
              }}
            >
              <SchoolIcon
                sx={{
                  fontSize: 70,
                  color: colors.sage,
                  opacity: 0.8,
                }}
              />
            </Box>

            <Typography
              variant='h4'
              sx={{
                fontWeight: 700,
                color: colors.dark,
                mb: 2,
              }}
            >
              Không tìm thấy khóa học nào
            </Typography>

            <Typography
              variant='body1'
              sx={{
                color: `${colors.dark}B3`,
                maxWidth: '500px',
                mb: 4,
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}
            >
              Chúng tôi không tìm thấy khóa học nào phù hợp với tìm kiếm của bạn. Hãy thử điều chỉnh từ khóa hoặc quay lại sau.
            </Typography>

            <Button
              variant='contained'
              startIcon={<RefreshCwIcon size={20} />}
              onClick={() => setSearchTerm && setSearchTerm('')}
              sx={{
                borderRadius: '50rem',
                px: 5,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                bgcolor: colors.sage,
                boxShadow: `0 10px 20px ${alpha(colors.sage, 0.2)}`,
                '&:hover': {
                  bgcolor: alpha(colors.sage, 0.9),
                  boxShadow: `0 15px 25px ${alpha(colors.sage, 0.3)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s',
              }}
            >
              Tất cả khóa học
            </Button>
          </Box>
        ) : (
          <Grid container spacing={5}>
            {filteredCourses.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card
                  data-aos='fade-up'
                  data-aos-delay={index * 100}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '2.5rem',
                    overflow: 'hidden',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    bgcolor: alpha(colors.white, 0.6),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(colors.white, 0.8)}`,
                    boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
                      bgcolor: alpha(colors.white, 0.8),
                      '& .course-thumbnail-overlay': {
                        opacity: 1,
                      },
                      '& .play-button': {
                        opacity: 1,
                        transform: 'translate(-50%, -50%) scale(1)',
                      },
                      '& .course-image': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                >
                  {/* Category Accent */}
                  <Box
                    sx={{
                      height: 6,
                      width: '100%',
                      background: `linear-gradient(90deg, ${colors.sage}, ${colors.blue})`,
                    }}
                  />

                  {/* Registered badge */}
                  {course.isRegistered && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        bgcolor: colors.sage,
                        color: 'white',
                        py: 0.8,
                        px: 2,
                        borderRadius: '50rem',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: `0 4px 15px ${alpha(colors.sage, 0.4)}`,
                        zIndex: 10,
                      }}
                    >
                      <MuiCheckCircleIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      Đã sở hữu
                    </Box>
                  )}

                  {/* Thumbnail */}
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: '65%',
                      overflow: 'hidden',
                    }}
                  >
                    <CardMedia
                      className='course-image'
                      component='img'
                      image={course.thumbnail_url || '/placeholder.jpg'}
                      alt={course.title}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />

                    {/* Hover Overlay */}
                    <Box
                      className='course-thumbnail-overlay'
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(74, 74, 74, 0.3)',
                        opacity: 0,
                        transition: 'opacity 0.5s ease',
                        zIndex: 1,
                      }}
                    />

                    {/* Play button */}
                    <Box
                      className='play-button'
                      onClick={() => handleOpenModal(course)}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) scale(0.8)',
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: colors.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        opacity: 0,
                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      }}
                    >
                      <PlayCircleOutlineIcon
                        sx={{
                          fontSize: 40,
                          color: colors.sage,
                        }}
                      />
                    </Box>

                    {/* Duration badge */}
                    <Chip
                      icon={<AccessTimeIcon fontSize='small' sx={{ color: 'white !important' }} />}
                      label={formatDuration(Math.floor(course.video_duration))}
                      size='small'
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        zIndex: 2,
                        backgroundColor: 'rgba(74, 74, 74, 0.6)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        fontWeight: 600,
                        borderRadius: '0.5rem',
                        '& .MuiChip-label': { px: 1.5 },
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: colors.dark,
                        mb: 2,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '3.5rem',
                      }}
                    >
                      {course.title}
                    </Typography>

                    <Typography
                      variant='body2'
                      sx={{
                        color: `${colors.dark}B3`,
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        fontWeight: 500,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 4,
                        height: '4.5rem',
                      }}
                    >
                      {course.description}
                    </Typography>

                    <Box sx={{ mt: 'auto' }}>
                      {course.isRegistered ? (
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={() => navigate(routes.MY_COURSE)}
                          sx={{
                            borderRadius: '1rem',
                            textTransform: 'none',
                            py: 1.8,
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            bgcolor: colors.blue,
                            boxShadow: `0 8px 20px ${alpha(colors.blue, 0.25)}`,
                            '&:hover': {
                              bgcolor: alpha(colors.blue, 0.9),
                              boxShadow: `0 12px 25px ${alpha(colors.blue, 0.35)}`,
                            },
                          }}
                          startIcon={<SchoolIcon />}
                        >
                          Vào học tiếp
                        </Button>
                      ) : (
                        <Button
                          variant='outlined'
                          fullWidth
                          onClick={() => handleOpenModal(course)}
                          sx={{
                            borderRadius: '1rem',
                            textTransform: 'none',
                            py: 1.8,
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            borderColor: colors.sage,
                            color: colors.sage,
                            borderWidth: 2,
                            '&:hover': {
                              borderWidth: 2,
                              borderColor: colors.sage,
                              bgcolor: alpha(colors.sage, 0.05),
                            },
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Course Details Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '3rem',
            overflow: 'hidden',
            bgcolor: alpha(colors.white, 0.9),
            backdropFilter: 'blur(30px)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.1)',
          },
        }}
        TransitionProps={{
          timeout: 500,
        }}
      >
        {selectedCourse && (
          <>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component='img'
                image={selectedCourse.thumbnail_url || '/placeholder.jpg'}
                alt={selectedCourse.title}
                sx={{ height: { xs: 250, md: 400 }, objectFit: 'cover' }}
              />
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  top: 24,
                  right: 24,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'linear-gradient(transparent, rgba(74,74,74,0.8))',
                  p: 6,
                  color: 'white',
                }}
              >
                <Typography variant='h4' component='h2' sx={{ fontWeight: 800, mb: 1 }}>
                  {selectedCourse.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, opacity: 0.9 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ fontSize: 18, mr: 1 }} />
                    <Typography variant='body2' fontWeight={600}>
                      {formatDuration(selectedCourse.video_duration)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon sx={{ fontSize: 18, mr: 1 }} />
                    <Typography variant='body2' fontWeight={600}>
                      Tiếng Anh Thực Tế
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <DialogContent sx={{ p: { xs: 4, md: 8 } }}>
              <Grid container spacing={8}>
                <Grid item xs={12} md={7}>
                  <Typography
                    variant='h5'
                    sx={{
                      fontWeight: 700,
                      color: colors.dark,
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 24,
                        bgcolor: colors.rose,
                        borderRadius: 2,
                        mr: 2,
                      }}
                    />
                    Về khóa học này
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      color: `${colors.dark}CC`,
                      lineHeight: 2,
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      mb: 6,
                    }}
                  >
                    {selectedCourse.description}
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    {!selectedCourse?.isRegistered ? (
                      <Button
                        variant='contained'
                        size='large'
                        onClick={() => handleRegisterCourse(selectedCourse._id)}
                        sx={{
                          borderRadius: '1.5rem',
                          textTransform: 'none',
                          px: 6,
                          py: 2.5,
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          bgcolor: colors.sage,
                          boxShadow: `0 15px 30px ${alpha(colors.sage, 0.3)}`,
                          '&:hover': {
                            bgcolor: alpha(colors.sage, 0.9),
                            boxShadow: `0 20px 40px ${alpha(colors.sage, 0.4)}`,
                            transform: 'translateY(-4px)',
                          },
                          transition: 'all 0.4s',
                        }}
                      >
                        Đăng ký ngay
                      </Button>
                    ) : (
                      <Button
                        variant='contained'
                        size='large'
                        onClick={() => {
                          handleCloseModal();
                          navigate(`${routes.MY_COURSE}`);
                        }}
                        sx={{
                          borderRadius: '1.5rem',
                          textTransform: 'none',
                          px: 6,
                          py: 2.5,
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          bgcolor: colors.blue,
                          boxShadow: `0 15px 30px ${alpha(colors.blue, 0.3)}`,
                          '&:hover': {
                            bgcolor: alpha(colors.blue, 0.9),
                            boxShadow: `0 20px 40px ${alpha(colors.blue, 0.4)}`,
                            transform: 'translateY(-4px)',
                          },
                          transition: 'all 0.4s',
                        }}
                      >
                        Tiếp tục học
                      </Button>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 5,
                      borderRadius: '2rem',
                      backgroundColor: alpha(colors.sandDark, 0.5),
                      border: `1px solid ${alpha(colors.dark, 0.05)}`,
                    }}
                  >
                    <Typography variant='h6' sx={{ fontWeight: 700, color: colors.dark, mb: 4 }}>
                      Thông tin chi tiết
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '0.8rem',
                          bgcolor: alpha(colors.sage, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <AccessTimeIcon sx={{ color: colors.sage, fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant='caption' sx={{ display: 'block', color: `${colors.dark}80`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Thời lượng
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 700, color: colors.dark }}>
                          {formatDuration(selectedCourse.video_duration)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '0.8rem',
                          bgcolor: alpha(colors.rose, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <CalendarTodayIcon sx={{ color: colors.rose, fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant='caption' sx={{ display: 'block', color: `${colors.dark}80`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Ngày ra mắt
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 700, color: colors.dark }}>
                          {selectedCourse.created_at
                            ? format(new Date(selectedCourse.created_at), 'dd LMMM yyyy', { locale: vi })
                            : 'Mới ra mắt'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '0.8rem',
                          bgcolor: alpha(colors.blue, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <PublicIcon sx={{ color: colors.blue, fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant='caption' sx={{ display: 'block', color: `${colors.dark}80`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Trạng thái
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 700, color: colors.dark }}>
                          {selectedCourse.is_public ? 'Truy cập công khai' : 'Khóa học giới hạn'}
                        </Typography>
                      </Box>
                    </Box>

                    {selectedCourse.isRegistered && (
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: '1rem',
                          bgcolor: alpha(colors.sage, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          border: `1px dashed ${colors.sage}`,
                        }}
                      >
                        <MuiCheckCircleIcon
                          sx={{
                            color: colors.sage,
                            mr: 2,
                            fontSize: 24,
                          }}
                        />
                        <Typography variant='body2' sx={{ fontWeight: 700, color: colors.sage }}>
                          Bạn đã sở hữu khóa học này
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      <Footer />
    </div>
  );
};


export default Course;
