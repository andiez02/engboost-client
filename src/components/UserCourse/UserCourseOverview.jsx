import { Button, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { routes } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMyCoursesAPI } from '../../apis';
import { colors } from '../../theme';

function UserCourseOverview() {
  const navigate = useNavigate();
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        setLoading(true);
        const data = await getMyCoursesAPI();
        setUserCourses(data.courses || []);
      } catch (error) {
        console.error('Failed to fetch user courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, []);

  const handleCourseClick = () => {
    navigate(`${routes.MY_COURSE}`);
  };

  const handleViewAll = () => {
    navigate(routes.COURSE);
  };

  const displayedCourses = userCourses.slice(0, 3);

  return (
    <div>
      <Typography variant='h6' sx={{ fontWeight: 700, color: colors.dark, mb: 3 }}>
        Khoá học của tôi
      </Typography>
      <div
        className='w-full h-auto min-h-[160px] mt-4 rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-500'
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          border: `1px solid rgba(255, 255, 255, 0.8)`,
          boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
        }}
      >
        {loading ? (
          <Typography variant='body1' sx={{ color: `${colors.dark}80` }}>
            Đang tải dữ liệu...
          </Typography>
        ) : (
          <div>
            <Typography
              variant='body1'
              sx={{ color: `${colors.dark}B3`, fontWeight: 500, mb: 4, lineHeight: 1.6 }}
            >
              {userCourses.length === 0
                ? 'Bạn chưa sở hữu khoá học nào cho chương trình này. Hãy để EngBoost giúp bạn lựa chọn khoá học phù hợp với trình độ và mục tiêu của bạn nhé!'
                : `Bạn đã đăng ký ${userCourses.length} khoá học. Tiếp tục học tập để đạt được mục tiêu của bạn!`}
            </Typography>
            {userCourses.length > 0 && (
              <div className='mt-2'>
                <div className='flex items-center justify-between mb-4'>
                  <Typography variant='caption' sx={{ fontWeight: 700, color: `${colors.dark}80`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Danh sách khoá học
                  </Typography>
                  <Typography variant='caption' sx={{ fontWeight: 600, color: `${colors.dark}80` }}>
                    {userCourses.length} khoá học
                  </Typography>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {displayedCourses.map((course) => (
                    <div
                      key={`${course.id}-${course.title}`}
                      onClick={() => handleCourseClick(course.id)}
                      className='bg-white/40 group px-5 py-4 rounded-2xl text-sm transition-all duration-300 flex items-center gap-4 border border-white/60 hover:border-sage hover:bg-white/80 cursor-pointer shadow-sm hover:shadow-lg'
                    >
                      <div className='w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center group-hover:bg-sage/20 transition-colors'>
                        <MenuBookIcon sx={{ color: colors.sage, fontSize: 20 }} />
                      </div>
                      <div className='flex-1 overflow-hidden'>
                        <Typography
                          variant='body1'
                          sx={{ fontWeight: 700, color: colors.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {course.title}
                        </Typography>
                      </div>
                    </div>
                  ))}
                  {userCourses.length > 3 && (
                    <div
                      onClick={handleViewAll}
                      className='bg-white/40 group px-5 py-4 rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-3 border border-white/60 hover:border-blue hover:bg-white/80 cursor-pointer shadow-sm hover:shadow-lg'
                    >
                      <div className='w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center group-hover:bg-blue/20 transition-colors'>
                        <MoreHorizIcon sx={{ color: colors.blue, fontSize: 20 }} />
                      </div>
                      <Typography variant='body1' sx={{ fontWeight: 700, color: colors.dark }}>
                        Xem tất cả
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {!loading && userCourses.length === 0 && (
          <Button
            variant='contained'
            endIcon={<ArrowForwardIcon />}
            sx={{
              alignSelf: 'start',
              borderRadius: '50rem',
              px: 4,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: colors.sage,
              boxShadow: `0 8px 20px ${colors.sage}33`,
              mt: 2,
              '&:hover': {
                bgcolor: colors.sage,
                boxShadow: `0 12px 25px ${colors.sage}4D`,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s',
            }}
            onClick={() => navigate(routes.COURSE)}
          >
            Khám phá ngay
          </Button>
        )}
      </div>
    </div>
  );
}

export default UserCourseOverview;
