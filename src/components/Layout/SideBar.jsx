import {
  LayoutDashboard,
  BookOpen,
  Home,
  Trophy,
  Compass,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { gamify } from '../../theme';
import { Typography } from '@mui/material';
import { routes } from '../../utils/constants';

const dashboardItems = [
  { name: 'Overview', icon: LayoutDashboard, path: routes.DASHBOARD },
  { name: 'Flashcard', icon: BookOpen, path: routes.FLASHCARD },
  { name: 'Discover', icon: Compass, path: routes.DISCOVER },
  { name: 'Challenges', icon: Trophy, path: routes.CHALLENGES },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    // Skip the initial mount — only auto-close when user explicitly toggles open
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (!isOpen || isHovered) return;
    const timer = setTimeout(() => {
      if (setIsOpen) setIsOpen(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const effectiveIsOpen = isOpen || isHovered;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-[var(--height-header)] left-0 h-[calc(100vh-var(--height-header))] transition-all duration-500 ${
        effectiveIsOpen ? 'w-58' : 'w-20'
      } flex flex-col py-6 overflow-hidden z-40`}
      style={{
        backgroundColor: '#fff',
        borderRight: `2px solid ${gamify.gray}`,
        boxShadow: effectiveIsOpen && !isOpen ? '10px 0 25px rgba(0,0,0,0.06)' : '4px 0 25px rgba(0,0,0,0.02)',
      }}
    >
      <ul className='space-y-2 flex-1 w-full px-3'>
        {dashboardItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <li key={index} className='group'>
              <div
                className={`flex items-center rounded-2xl cursor-pointer relative py-3 transition-all duration-200 ${
                  effectiveIsOpen ? 'px-4' : 'px-2 justify-center'
                }`}
                style={{
                  backgroundColor: isActive ? gamify.blueBg : 'transparent',
                  border: isActive ? `2px solid ${gamify.blue}` : '2px solid transparent',
                  borderBottom: isActive ? `4px solid ${gamify.blue}` : '2px solid transparent',
                }}
                onClick={() => navigate(item.path)}
              >


                {/* Icon container */}
                <div
                  className={`flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    effectiveIsOpen ? 'mr-4' : 'mr-0'
                  }`}
                  style={{
                    color: isActive ? gamify.blue : gamify.sub,
                    opacity: 1,
                  }}
                >
                  <Icon size={24} strokeWidth={isActive ? 3 : 2.5} />
                </div>

                {/* Text container */}
                <div
                  className={`flex items-center overflow-hidden transition-all duration-500 ${
                    effectiveIsOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
                  }`}
                >
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      letterSpacing: '0.05em',
                      color: isActive ? gamify.blue : gamify.sub,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                  >
                    {item.name.toUpperCase()}
                  </Typography>
                </div>

                {/* Hover effect background */}
                {!isActive && (
                  <div className='absolute inset-0 rounded-2xl bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10'></div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className='mt-auto px-3'>
        <div
          className={`group flex items-center rounded-2xl cursor-pointer relative py-3 transition-all duration-200 ${
            effectiveIsOpen ? 'px-4' : 'px-2 justify-center'
          }`}
          style={{
            border: '2px solid transparent',
          }}
          onClick={() => navigate('/')}
        >
          {/* Hover effect background */}
          <div className='absolute inset-0 rounded-2xl bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10'></div>
          {/* Icon container */}
          <div
            className={`flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
              effectiveIsOpen ? 'mr-4' : 'mr-0'
            }`}
            style={{ color: gamify.text }}
          >
            <Home size={24} strokeWidth={2.5} />
          </div>

          {/* Text container */}
          <div
            className={`flex items-center overflow-hidden transition-all duration-500 ${
              effectiveIsOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
            }`}
          >
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                color: gamify.text,
                whiteSpace: 'nowrap',
              }}
            >
              VỀ TRANG CHỦ
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
