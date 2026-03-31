import { useEffect, useState } from 'react';
import engboostLogo from '../../assets/home/engboost-logo.png';
import { routes } from '../../utils/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/user/userSlice';
import Profiles from '../AppBar/Profile';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === routes.HOME;
  const currentUser = useSelector(selectCurrentUser);

  // Use throttling to prevent too many updates during scroll
  useEffect(() => {
    // For non-home pages, always use the scrolled style
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial scroll state
    setIsScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]); // Re-run effect when isHome changes

  const dashboardItems = [
    { path: routes.HOME, name: 'Trang chủ' },
    // { path: routes.COURSE, name: 'Khoá học' },
    // { path: routes.CHATBOT_INTRO, name: 'AI' },
  ];

  // Determine header background class - using vintage glassmorphism
  // Warm Sand: #fdfcf0
  const headerBgClass =
    !isScrolled && isHome
      ? 'bg-transparent border-b border-transparent'
      : 'bg-[#fdfcf0]/80 backdrop-blur-md border-b border-[#b4c3a2]/20 shadow-sm';

  // Determine text color class
  const textColorClass = !isScrolled && isHome ? 'text-white' : 'text-[#4a4a4a]';

  return (
    <header
      className={`h-[var(--height-header)] fixed top-0 left-0 right-0 flex justify-between items-center z-50 px-4 md:px-8 ${headerBgClass} ${textColorClass}`}
      style={{
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="flex items-center">
        {/* Fixed height and width container for logo */}
        <div className="h-[calc(var(--height-header)-20px)] w-auto flex items-center transition-transform duration-300 hover:scale-105">
          <img
            src={engboostLogo}
            className={`h-full w-auto object-contain transition-all duration-300 ${!isScrolled && isHome ? 'brightness-0 invert' : ''}`}
            alt="Logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>

      <div className="hidden md:block">
        <ul className="flex items-center gap-8 h-full">
          {dashboardItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.name}
                onClick={() => navigate(item.path)}
                className="relative cursor-pointer px-1 py-2 group"
              >
                <div
                  className={`text-center text-sm font-bold uppercase tracking-widest transition-colors duration-300
                  ${
                    isActive
                      ? (!isScrolled && isHome ? 'text-white' : 'text-[#b4c3a2]')
                      : (!isScrolled && isHome ? 'text-white/70 hover:text-white' : 'text-[#4a4a4a]/70 hover:text-[#b4c3a2]')
                  }`}
                >
                  {item.name}
                  {/* Vintage animated underline - using Dusty Rose (#dfbbb1) */}
                  <span 
                    className={`absolute bottom-0 left-1/2 h-[2px] rounded-full transition-all duration-300 ease-out -translate-x-1/2
                    ${isActive 
                      ? (!isScrolled && isHome ? 'bg-white w-full' : 'bg-[#dfbbb1] w-full shadow-[0_0_8px_rgba(223,187,177,0.4)]') 
                      : (!isScrolled && isHome ? 'bg-white w-0 group-hover:w-full opacity-50' : 'bg-[#dfbbb1] w-0 group-hover:w-full opacity-0 group-hover:opacity-100')
                    }`} 
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center">
        {currentUser ? (
          <Profiles />
        ) : (
          <div className="flex gap-4 items-center">
            <button
              className={`py-2 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                isScrolled || !isHome
                  ? 'bg-transparent text-[#4a4a4a] hover:bg-[#b4c3a2]/10 border border-transparent hover:border-[#b4c3a2]/20'
                  : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20'
              }`}
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </button>

            <button
              className={`py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                isScrolled || !isHome
                  ? 'bg-gradient-to-r from-[#b4c3a2] to-[#8fa37a] text-white hover:shadow-[#b4c3a2]/30'
                  : 'bg-[#fdfcf0] text-[#4a4a4a] hover:bg-white hover:shadow-black/10'
              }`}
              onClick={() => navigate('/register')}
            >
              Bắt đầu
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
