import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Home,
  BotMessageSquare,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors, glassmorphism, transitions } from '../../theme';
import { Typography } from '@mui/material';

const dashboardItems = [
  { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Flashcard', icon: BookOpen, path: '/flashcard' },
  { name: 'My Course', icon: GraduationCap, path: '/my_course' },
  { name: 'AI', icon: BotMessageSquare, path: '/chatbot' },
];

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={`fixed top-[var(--height-header)] left-0 h-[calc(100vh-var(--height-header))] transition-all duration-500 ${
        isOpen ? 'w-58' : 'w-20'
      } flex flex-col py-6 overflow-hidden z-40`}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '4px 0 25px rgba(0,0,0,0.02)',
      }}
    >
      <ul className='space-y-2 flex-1 w-full px-3'>
        {dashboardItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <li key={index} className='group'>
              <div
                className={`flex items-center rounded-2xl cursor-pointer relative py-3.5 transition-all duration-500 ${
                  isOpen ? 'px-4' : 'px-2 justify-center'
                }`}
                style={{
                  backgroundColor: isActive ? `${colors.sage}25` : 'transparent',
                }}
                onClick={() => navigate(item.path)}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div
                    className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full'
                    style={{ backgroundColor: colors.sage }}
                  ></div>
                )}

                {/* Icon container */}
                <div
                  className={`flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    isOpen ? 'mr-4' : 'mr-0'
                  }`}
                  style={{
                    color: isActive ? colors.sage : colors.dark,
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {/* Text container */}
                <div
                  className={`flex items-center overflow-hidden transition-all duration-500 ${
                    isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
                  }`}
                >
                  <Typography
                    sx={{
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '0.95rem',
                      color: colors.dark,
                      opacity: isActive ? 1 : 0.8,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s',
                    }}
                  >
                    {item.name}
                  </Typography>
                </div>

                {/* Hover effect background */}
                {!isActive && (
                  <div className='absolute inset-0 rounded-2xl bg-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10'></div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className='mt-auto px-3'>
        <div
          className={`group flex items-center rounded-2xl cursor-pointer relative py-3.5 transition-all duration-500 ${
            isOpen ? 'px-4' : 'px-2 justify-center'
          }`}
          style={{
            backgroundColor: `${colors.dark}08`,
          }}
          onClick={() => navigate('/')}
        >
          {/* Icon container */}
          <div
            className={`flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
              isOpen ? 'mr-4' : 'mr-0'
            }`}
            style={{ color: colors.dark, opacity: 0.6 }}
          >
            <Home size={22} />
          </div>

          {/* Text container */}
          <div
            className={`flex items-center overflow-hidden transition-all duration-500 ${
              isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
            }`}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: colors.dark,
                opacity: 0.8,
                whiteSpace: 'nowrap',
              }}
            >
              Về trang chủ
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
