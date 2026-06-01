import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Folders from './Folders/Folders';
import Snaplang from './Snaplang/Snaplang';
import Discover from './Discover/Discover';
import Explore from './Explore/Explore';
import CommunityFolders from './Community/CommunityFolders';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FolderIcon from '@mui/icons-material/Folder';
import ExploreIcon from '@mui/icons-material/Explore';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PeopleIcon from '@mui/icons-material/People';

const TABS = {
  SNAPLANG: 'snaplang',
  FOLDERS: 'folders',
  DISCOVER: 'discover',
  EXPLORE: 'explore',
  COMMUNITY: 'community',
};

const TAB_CONFIG = [
  { value: TABS.SNAPLANG,   label: 'Tạo thẻ mới',  icon: CameraAltIcon, to: '/flashcard/snaplang'   },
  { value: TABS.FOLDERS,    label: 'Bộ sưu tập',   icon: FolderIcon,    to: '/flashcard/folders'    },
  { value: TABS.COMMUNITY,  label: 'Khám phá',      icon: PeopleIcon,    to: '/flashcard/discover'   },
  { value: TABS.EXPLORE,    label: 'Explore',       icon: LockOpenIcon,  to: '/flashcard/explore'    },
];

export default function FlashcardTab({ headerSlot }) {
  const location = useLocation();

  const getDefaultTab = useCallback(() => {
    if (location.pathname.includes(TABS.FOLDERS))   return TABS.FOLDERS;
    if (location.pathname.includes(TABS.DISCOVER))  return TABS.COMMUNITY;
    if (location.pathname.includes(TABS.EXPLORE))   return TABS.EXPLORE;
    return TABS.SNAPLANG;
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState(getDefaultTab());

  useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [location.pathname, getDefaultTab]);

  return (
    <div>
      {/* Header + tabs */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: 16, marginBottom: 28,
      }}>
        {headerSlot}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TAB_CONFIG.map(({ value, label, icon: Icon, to }) => {
            const isActive = activeTab === value;
            return (
              <Link
                key={value}
                to={to}
                onClick={() => setActiveTab(value)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 14,
                  fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.04em',
                  textDecoration: 'none', userSelect: 'none',
                  transition: 'all 0.12s cubic-bezier(.4,0,.2,1)',
                  border: `2px solid ${isActive ? '#1CB0F6' : '#E5E5E5'}`,
                  borderBottom: isActive ? '2px solid #1899D6' : '4px solid #E0E0E0',
                  background: isActive ? '#DDF4FF' : '#fff',
                  color: isActive ? '#1CB0F6' : '#AFAFAF',
                  transform: isActive ? 'translateY(2px)' : 'none',
                }}
              >
                <Icon sx={{ fontSize: 17 }} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === TABS.SNAPLANG  && <Snaplang />}
        {activeTab === TABS.FOLDERS   && <Folders />}
        {activeTab === TABS.COMMUNITY && <CommunityFolders />}
        {activeTab === TABS.EXPLORE   && <Explore />}
      </div>
    </div>
  );
}
