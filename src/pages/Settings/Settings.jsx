import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Person, Security } from '@mui/icons-material';
import { Typography } from '@mui/material';
import Sidebar from '../../components/Layout/SideBar';
import HeaderUser from '../../components/Layout/HeaderUser';
import AccountTab from './AccountTab';
import SecurityTab from './SecurityTab';
import { gamify } from '../../theme';

const TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security',
};

const TAB_CONFIG = [
  { key: TABS.ACCOUNT, label: 'Account', icon: Person, path: '/settings/account' },
  { key: TABS.SECURITY, label: 'Security', icon: Security, path: '/settings/security' },
];

export default function Settings() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });

  const handleSidebarToggle = (val) => {
    setIsSidebarOpen(val);
    localStorage.setItem('sidebarOpen', String(val));
  };

  const activeTab = location.pathname.includes(TABS.SECURITY)
    ? TABS.SECURITY
    : TABS.ACCOUNT;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarToggle} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-58' : 'ml-20'
        } p-6 lg:p-8`}
      >
        <HeaderUser
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={handleSidebarToggle}
        />

        <div className="min-h-screen mt-[60px] pb-10">
          {/* Page header */}
          <div className="mb-8">
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: '1.8rem',
                color: gamify.text,
                letterSpacing: '-0.02em',
              }}
            >
              Settings
            </Typography>
            <Typography sx={{ color: gamify.sub, fontWeight: 600, mt: 0.5 }}>
              Manage your account and preferences
            </Typography>
          </div>

          {/* Tab nav */}
          <div
            className="flex gap-2 mb-8 p-1.5 rounded-2xl w-fit"
            style={{ backgroundColor: gamify.surface, border: `2px solid ${gamify.gray}` }}
          >
            {TAB_CONFIG.map(({ key, label, icon: Icon, path }) => {
              const isActive = activeTab === key;
              return (
                <Link key={key} to={path} style={{ textDecoration: 'none' }}>
                  <div
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                      backgroundColor: isActive ? '#fff' : 'transparent',
                      border: isActive ? `2px solid ${gamify.blue}` : '2px solid transparent',
                      borderBottom: isActive ? `4px solid ${gamify.blue}` : '2px solid transparent',
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 20,
                        color: isActive ? gamify.blue : gamify.sub,
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        letterSpacing: '0.05em',
                        color: isActive ? gamify.blue : gamify.sub,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label.toUpperCase()}
                    </Typography>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Tab content */}
          <div
            className="rounded-3xl p-8"
            style={{
              backgroundColor: '#fff',
              border: `2px solid ${gamify.gray}`,
              borderBottom: `4px solid ${gamify.gray}`,
            }}
          >
            {activeTab === TABS.ACCOUNT ? <AccountTab /> : <SecurityTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
