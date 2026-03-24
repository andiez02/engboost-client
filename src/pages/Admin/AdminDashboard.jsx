import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Paper,
  Divider,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  ArrowForward as ArrowForwardIcon,
  Article as ArticleIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { getListUsersAPI, getFoldersAPI, getAllCoursesAPI } from '../../apis';
import { routes } from '../../utils/constants';

function AdminDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFolders: 0,
    totalCourses: 0,
  });

  // Enhanced gradient backgrounds with better color harmony
  const cardGradients = [
    `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)}, ${
      theme.palette.primary.dark
    })`,
    `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.8)}, ${
      theme.palette.secondary.dark
    })`,
    `linear-gradient(135deg, #42a5f5, #1976d2)`,
    `linear-gradient(135deg, #ff9800, #ed6c02)`,
  ];

  // Card icons with matching colors
  const cardIcons = [
    {
      icon: <PeopleIcon fontSize="large" />,
      color: theme.palette.primary.dark,
    },
    {
      icon: <SchoolIcon fontSize="large" />,
      color: theme.palette.secondary.dark,
    },
    { icon: <DescriptionIcon fontSize="large" />, color: '#1976d2' },
    { icon: <ArticleIcon fontSize="large" />, color: '#ed6c02' },
  ];

  useEffect(() => {
    fetchBasicStats();
  }, []);

  const fetchBasicStats = async () => {
    try {
      setLoading(true);
      const [usersResponse, foldersResponse, coursesResponse] =
        await Promise.all([
          getListUsersAPI(1, 1),
          getFoldersAPI(),
          getAllCoursesAPI(),
        ]);

      setStats({
        totalUsers: usersResponse.pagination?.total || 0,
        totalFolders: foldersResponse.folders?.length || 0,
        totalCourses: coursesResponse.courses?.length || 0,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const StatCard = ({ title, subtitle, value, index, route }) => (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
        },
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={() => navigate(route)}
    >
      <Box
        sx={{
          background: cardGradients[index % cardGradients.length],
          p: 3.5,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          position="relative"
          zIndex={1}
        >
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
              {loading ? <CircularProgress size={30} color="inherit" /> : value}
            </Typography>
            <Typography variant="h6" fontWeight="medium">
              {title}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              width: 60,
              height: 60,
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
            }}
          >
            {cardIcons[index % cardIcons.length].icon}
          </Avatar>
        </Stack>
      </Box>
      <Box sx={{ p: 2.5, bgcolor: 'background.paper' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="medium"
          >
            {subtitle}
          </Typography>
          <Button
            endIcon={<ArrowForwardIcon />}
            size="small"
            sx={{
              fontWeight: 'medium',
              color: cardIcons[index % cardIcons.length].color,
              '&:hover': {
                backgroundColor: alpha(
                  cardIcons[index % cardIcons.length].color,
                  0.08
                ),
              },
            }}
          >
            Chi tiết
          </Button>
        </Stack>
      </Box>
    </Card>
  );

  const QuickActionButton = ({ icon, title, route, index }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
          borderColor: cardIcons[index % cardIcons.length].color,
          transform: 'translateY(-4px)',
          '& .action-icon': {
            backgroundColor: alpha(
              cardIcons[index % cardIcons.length].color,
              0.1
            ),
            color: cardIcons[index % cardIcons.length].color,
          },
        },
        cursor: 'pointer',
      }}
      onClick={() => navigate(route)}
    >
      <Stack direction="row" spacing={2.5} alignItems="center">
        <Avatar
          className="action-icon"
          sx={{
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.secondary,
            width: 52,
            height: 52,
            transition: 'all 0.3s',
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="medium">
          {title}
        </Typography>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Enhanced Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        <Grid container spacing={3} alignItems="center" position="relative">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              <DashboardIcon
                sx={{ mr: 1.5, verticalAlign: 'middle', fontSize: 32 }}
              />
              EngBoost Admin Dashboard
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, pl: 0.5 }}>
              Quản lý hệ thống học tập ngôn ngữ hiệu quả và toàn diện
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={fetchBasicStats}
              sx={{
                borderRadius: 3,
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                px: 3,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Làm mới dữ liệu
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            <Box sx={{ textAlign: 'right' }}>
              <TrendingUpIcon sx={{ fontSize: 120, opacity: 0.2 }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Error message if any */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.1)',
          }}
        >
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              display: 'inline-block',
              width: 4,
              height: 24,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 4,
              mr: 2,
            },
          }}
        >
          Tổng quan hệ thống
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Người dùng"
              subtitle="Quản lý tài khoản người dùng"
              value={stats.totalUsers}
              index={0}
              route={routes.ADMIN_USER_MANAGEMENT}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Khóa học"
              subtitle="Quản lý khóa học trực tuyến"
              value={stats.totalCourses}
              index={1}
              route={routes.ADMIN_COURSE_MANAGEMENT}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Flashcards"
              subtitle="Quản lý thẻ ghi nhớ"
              value={stats.totalFolders}
              index={2}
              route={routes.ADMIN_FLASHCARD_MANAGEMENT}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Bài viết"
              subtitle="Quản lý nội dung blog"
              value="--"
              index={3}
              route={routes.ADMIN_BLOG_MANAGEMENT}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Quick Actions */}
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              display: 'inline-block',
              width: 4,
              height: 24,
              backgroundColor: theme.palette.secondary.main,
              borderRadius: 4,
              mr: 2,
            },
          }}
        >
          Truy cập nhanh
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionButton
              icon={<PeopleIcon />}
              title="Quản lý người dùng"
              route={routes.ADMIN_USER_MANAGEMENT}
              index={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionButton
              icon={<SchoolIcon />}
              title="Quản lý khóa học"
              route={routes.ADMIN_COURSE_MANAGEMENT}
              index={1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionButton
              icon={<DescriptionIcon />}
              title="Quản lý flashcards"
              route={routes.ADMIN_FLASHCARD_MANAGEMENT}
              index={2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionButton
              icon={<ArticleIcon />}
              title="Quản lý blog"
              route={routes.ADMIN_BLOG_MANAGEMENT}
              index={3}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
