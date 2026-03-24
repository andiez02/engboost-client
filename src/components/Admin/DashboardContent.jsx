import React from 'react';
import {
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Users,
  BookOpen,
  BookmarkIcon,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
} from 'lucide-react';

// StatCard component
const StatCard = ({ title, value, trend, icon, color }) => (
  <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} shadow-lg`}>{icon}</div>
        <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-full">
          {trend > 0 ? (
            <ArrowUpRight size={16} className="text-green-500" />
          ) : (
            <ArrowDownRight size={16} className="text-red-500" />
          )}
          <Typography
            variant="body2"
            className={`font-medium ${
              trend > 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {Math.abs(trend)}%
          </Typography>
        </div>
      </div>
      <Typography variant="h4" className="font-bold mb-1 text-gray-800">
        {value}
      </Typography>
      <Typography variant="body2" className="text-gray-500 font-medium">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

// ActivityCard component
const ActivityCard = ({ title, time, icon, color }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group">
    <div className="flex items-center space-x-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>{icon}</div>
      <div>
        <Typography
          variant="body2"
          className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors"
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          className="text-gray-500 flex items-center"
        >
          <Clock size={14} className="mr-1" />
          {time}
        </Typography>
      </div>
    </div>
    <IconButton
      size="small"
      className="text-gray-400 group-hover:text-indigo-600 transition-colors"
    >
      <ArrowUpRight size={16} />
    </IconButton>
  </div>
);

const DashboardContent = () => {
  // Mock data
  const stats = [
    {
      title: 'Tổng số người dùng',
      value: '1,234',
      trend: 12.5,
      icon: <Users size={24} className="text-white" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Khóa học đang hoạt động',
      value: '45',
      trend: 8.2,
      icon: <BookOpen size={24} className="text-white" />,
      color: 'bg-green-500',
    },
    {
      title: 'Flashcard đã tạo',
      value: '2,567',
      trend: -3.1,
      icon: <BookmarkIcon size={24} className="text-white" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Bài viết blog',
      value: '89',
      trend: 5.7,
      icon: <FileText size={24} className="text-white" />,
      color: 'bg-orange-500',
    },
  ];

  const recentActivities = [
    {
      title: 'Người dùng mới đăng ký',
      time: '5 phút trước',
      icon: <Users size={20} className="text-blue-500" />,
      color: 'text-blue-500',
    },
    {
      title: 'Khóa học mới được thêm',
      time: '15 phút trước',
      icon: <BookOpen size={20} className="text-green-500" />,
      color: 'text-green-500',
    },
    {
      title: 'Flashcard mới được tạo',
      time: '30 phút trước',
      icon: <BookmarkIcon size={20} className="text-purple-500" />,
      color: 'text-purple-500',
    },
    {
      title: 'Bài viết mới được đăng',
      time: '1 giờ trước',
      icon: <FileText size={20} className="text-orange-500" />,
      color: 'text-orange-500',
    },
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Chào mừng trở lại, Admin!
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Đây là tổng quan về hoạt động của hệ thống
        </Typography>
      </div>

      {/* Stats Grid */}
      <Grid container spacing={3} className="mb-8">
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Activities */}
      <Paper className="p-6 shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Activity size={20} className="text-indigo-600" />
            <Typography variant="h6" className="font-semibold text-gray-800">
              Hoạt động gần đây
            </Typography>
          </div>
          <Button
            variant="text"
            color="primary"
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg"
          >
            Xem tất cả
          </Button>
        </div>

        <div className="space-y-2">
          {recentActivities.map((activity) => (
            <ActivityCard key={activity.title} {...activity} />
          ))}
        </div>
      </Paper>
    </>
  );
};

export default DashboardContent;
