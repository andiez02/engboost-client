import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Folders from './Folders/Folders';
import Snaplang from './Snaplang/Snaplang';
import Discover from './Discover/Discover';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FolderIcon from '@mui/icons-material/Folder';
import ExploreIcon from '@mui/icons-material/Explore';
import { cn } from '../../../../modal/ModalSystem/utils/cn';

const TABS = {
  SNAPLANG: 'snaplang',
  FOLDERS: 'folders',
  DISCOVER: 'discover',
};

const TAB_CONFIG = [
  { value: TABS.SNAPLANG, label: 'Snaplang', icon: CameraAltIcon, to: '/flashcard/snaplang' },
  { value: TABS.FOLDERS, label: 'Folders', icon: FolderIcon, to: '/flashcard/folders' },
  { value: TABS.DISCOVER, label: 'Discover', icon: ExploreIcon, to: '/flashcard/discover' },
];

function FlashcardTab({ headerSlot }) {
  const location = useLocation();

  const getDefaultTab = useCallback(() => {
    if (location.pathname.includes(TABS.FOLDERS)) return TABS.FOLDERS;
    if (location.pathname.includes(TABS.DISCOVER)) return TABS.DISCOVER;
    return TABS.SNAPLANG;
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState(getDefaultTab());

  useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [location.pathname, getDefaultTab]);

  return (
    <div>
      {/* Header row: title + tab bar side by side */}
      <div className="flex items-center mb-6 gap-10">
        {headerSlot}

        <div className="flex items-center gap-1 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm">
          {TAB_CONFIG.map(({ value, label, icon: Icon, to }) => {
            const isActive = activeTab === value;
            return (
              <Link
                key={value}
                to={to}
                onClick={() => setActiveTab(value)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 select-none"
                style={isActive
                  ? { backgroundColor: '#1e293b', color: '#ffffff' }
                  : { color: '#64748b' }
                }
              >
                <Icon sx={{ fontSize: 16 }} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === TABS.SNAPLANG && <Snaplang />}
        {activeTab === TABS.FOLDERS && <Folders />}
        {activeTab === TABS.DISCOVER && <Discover />}
      </div>
    </div>
  );
}

export default FlashcardTab;
