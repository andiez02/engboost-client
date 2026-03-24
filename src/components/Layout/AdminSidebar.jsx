import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import { routes } from '../../utils/constants.js';
import { Users, BookOpen, BookmarkIcon, FileText, Home } from 'lucide-react';

const AdminSidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Home size={20} />,
      path: routes.ADMIN_DASHBOARD,
    },
    {
      title: 'Quản lý người dùng',
      icon: <Users size={20} />,
      path: routes.ADMIN_USER_MANAGEMENT,
    },
    {
      title: 'Quản lý khóa học',
      icon: <BookOpen size={20} />,
      path: routes.ADMIN_COURSE_MANAGEMENT,
    },
    {
      title: 'Quản lý Flashcard',
      icon: <BookmarkIcon size={20} />,
      path: routes.ADMIN_FLASHCARD_MANAGEMENT,
    },
    {
      title: 'Quản lý blog',
      icon: <FileText size={20} />,
      path: routes.ADMIN_BLOG_MANAGEMENT,
    },
  ];

  return (
    <aside
      className={`fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-white shadow-lg transition-all duration-300 ease-in-out z-10 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <nav className="h-full overflow-y-auto">
        <div className="p-4 flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'hover:bg-gray-50 text-gray-600 hover:text-indigo-600'
              }`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <div
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  isOpen ? 'w-auto' : 'w-0'
                }`}
              >
                <Typography variant="body2" className="font-medium">
                  {item.title}
                </Typography>
              </div>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
