import { X, Menu, ArrowLeft } from 'lucide-react';
import engboostLogo from '../../assets/home/engboost-logo.png';
import Profiles from '../AppBar/Profile';
import { useNavigate, useLocation } from 'react-router-dom';

function HeaderAdmin({ isSidebarOpen, setIsSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isSettingsPage = location.pathname.includes('/admin/settings');

  return (
    <header className="h-[var(--height-header)] fixed top-0 left-0 w-full flex items-center justify-between bg-blue-50 border-b border-blue-100 shadow-sm z-50 px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            isSettingsPage
              ? navigate('/admin/dashboard')
              : setIsSidebarOpen(!isSidebarOpen)
          }
          className="p-2 rounded-md bg-white/70 hover:bg-white transition-colors duration-200 text-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label={
            isSettingsPage
              ? 'Back to dashboard'
              : isSidebarOpen
              ? 'Close sidebar'
              : 'Open sidebar'
          }
        >
          {isSettingsPage ? (
            <ArrowLeft size={22} />
          ) : isSidebarOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

        <div
          className="flex items-center cursor-pointer ml-1"
          onClick={() => navigate('/admin/dashboard')}
        >
          <img
            src={engboostLogo}
            className="h-9 md:h-10 object-contain"
            alt="EngBoost Logo"
          />
        </div>
      </div>

      <div className="flex items-center">
        <Profiles />
      </div>
    </header>
  );
}

export default HeaderAdmin;
