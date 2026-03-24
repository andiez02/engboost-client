import { useState } from 'react';
import Sidebar from '../../../components/Layout/SideBar';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/user/userSlice';
import { Avatar } from '@mui/material';
import UserCourseOverview from '../../../components/UserCourse/UserCourseOverview';
import UserFlashcardOverview from '../../../components/UserFlashcard/UserFlashcardOverview';
import LearningProgress from '../../../components/LearningProgress/LearningProgress';
import HeaderUser from '../../../components/Layout/HeaderUser';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-58' : 'ml-20'
        } p-8`}
      >
        <HeaderUser
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="min-h-screen mt-[60px]">
          <div className="flex items-center mb-10">
            <Avatar
              sx={{ width: 64, height: 64, mr: 3, cursor: 'pointer', border: '3px solid #fff', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}
              src={currentUser?.user?.avatar}
            />
            <div>
              <h4 className="text-[26px] font-black text-slate-900 leading-tight">
                Xin chào, <span className="text-[#8fa17d]">{currentUser?.user?.username}</span>
              </h4>
              <p className="text-[14px] text-slate-500 font-medium mt-0.5">
                Cùng Engboost tiến bộ mỗi ngày!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-5 pt-8 border-t border-slate-200">
            <div className="lg:col-span-8 space-y-10">
              <UserCourseOverview />
              <UserFlashcardOverview />
            </div>
            <div className="lg:col-span-4">
              <LearningProgress />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
