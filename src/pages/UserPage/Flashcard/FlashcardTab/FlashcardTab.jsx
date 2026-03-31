import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Folders from './Folders/Folders';
import Snaplang from './Snaplang/Snaplang';
import Discover from './Discover/Discover';
import Explore from './Explore/Explore';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FolderIcon from '@mui/icons-material/Folder';
import ExploreIcon from '@mui/icons-material/Explore';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { cn } from '../../../../modal/ModalSystem/utils/cn';

const TABS = {
  SNAPLANG: 'snaplang',
  FOLDERS: 'folders',
  DISCOVER: 'discover',
  EXPLORE: 'explore',
};

const TAB_CONFIG = [
  { value: TABS.SNAPLANG, label: 'TẠO THẺ MỚI', icon: CameraAltIcon, to: '/flashcard/snaplang' },
  { value: TABS.FOLDERS, label: 'BỘ SƯU TẬP', icon: FolderIcon, to: '/flashcard/folders' },
  { value: TABS.DISCOVER, label: 'KHÁM PHÁ', icon: ExploreIcon, to: '/flashcard/discover' },
  { value: TABS.EXPLORE, label: 'EXPLORE', icon: LockOpenIcon, to: '/flashcard/explore' },
];

function FlashcardTab({ headerSlot }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getDefaultTab = useCallback(() => {
    if (location.pathname.includes(TABS.FOLDERS)) return TABS.FOLDERS;
    if (location.pathname.includes(TABS.DISCOVER)) return TABS.DISCOVER;
    if (location.pathname.includes(TABS.EXPLORE)) return TABS.EXPLORE;
    return TABS.SNAPLANG;
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState(getDefaultTab());

  useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [location.pathname, getDefaultTab]);

  return (
    <div>
      {/* Header row: title + tab bar side by side */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-6">
        {headerSlot}

        <div className="flex flex-wrap items-center gap-3">
          {TAB_CONFIG.map(({ value, label, icon: Icon, to }) => {
            const isActive = activeTab === value;
            return (
              <Link
                key={value}
                to={to}
                onClick={() => setActiveTab(value)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] font-black transition-all duration-100 select-none border-2',
                  isActive
                    ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#1CB0F6]'
                    : 'border-[#E5E5E5] bg-white text-[#AFAFAF] hover:bg-[#F7F7F7]'
                )}
                style={{
                  borderBottomWidth: isActive ? '2px' : '4px',
                  transform: isActive ? 'translateY(2px)' : 'translateY(0)',
                  marginBottom: isActive ? '2px' : '0'
                }}
              >
                <Icon sx={{ fontSize: 20 }} />
                {label}
              </Link>
            );
          })}

          <div className="w-[2px] h-10 bg-[#E5E5E5] mx-2 hidden sm:block"></div>

          {/* Study tab — navigates to /study directly
          <button
            onClick={() => navigate('/study')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[14px] font-black transition-all duration-100 select-none border-2 border-[#E5E5E5] bg-white text-[#58CC02] border-b-[4px] hover:bg-[#F7F7F7] hover:border-[#58CC02] active:border-b-[0px] active:translate-y-[4px] active:mb-[4px]"
          >
            <SchoolIcon sx={{ fontSize: 20 }} />
            BẮT ĐẦU HỌC
          </button> */}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === TABS.SNAPLANG && <Snaplang />}
        {activeTab === TABS.FOLDERS && <Folders />}
        {activeTab === TABS.DISCOVER && <Discover />}
        {activeTab === TABS.EXPLORE && <Explore />}
      </div>
    </div>
  );
}

export default FlashcardTab;
