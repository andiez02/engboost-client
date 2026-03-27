import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../../components/Layout/SideBar';
import { selectCurrentUser } from '../../../redux/user/userSlice';
import { fetchStats } from '../../../redux/study/studySlice';
import { fetchFolders } from '../../../redux/folder/folderSlice';
import HeaderUser from '../../../components/Layout/HeaderUser';
import DashboardHero from './DashboardHero';
import ProgressInline from './ProgressInline';
import LearningFlow from './LearningFlow';
import SuggestionCard from './SuggestionCard';
import FolderGrid from './FolderGrid';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const stats = useSelector((state) => state.study.stats);
  const nextReviewAt = useSelector((state) => state.study.nextReviewAt);
  const isLoading = useSelector((state) => state.study.isLoading);
  const error = useSelector((state) => state.study.error);
  const folders = useSelector((state) => state.folders.folders);
  const foldersLoading = useSelector((state) => state.folders.isLoading);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchFolders());
  }, [dispatch]);

  // 60s auto-refresh
  useEffect(() => {
    const id = setInterval(() => dispatch(fetchStats()), 60_000);
    return () => clearInterval(id);
  }, [dispatch]);

  const handleRetry = () => dispatch(fetchStats());
  const due = stats?.due ?? 0;
  const reviewedToday = stats?.reviewedToday ?? 0;
  const userName = currentUser?.user?.username;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-58' : 'ml-20'
        } p-6 lg:p-8`}
      >
        <HeaderUser
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="min-h-screen mt-[60px] pb-10">
          <div className="flex flex-col xl:flex-row gap-8 items-start">
            
            {/* ── LEFT COLUMN: MAIN PATH ── */}
            <div className="flex-1 w-full space-y-8">
              <DashboardHero
                userName={userName}
                due={due}
                nextReviewAt={nextReviewAt}
                isLoading={isLoading}
                error={error}
                onRetry={handleRetry}
              />

              <LearningFlow due={due} reviewedToday={reviewedToday} />

              <FolderGrid folders={folders} isLoading={foldersLoading} />
            </div>

            {/* ── RIGHT COLUMN: SIDEBAR ── */}
            <div className="w-full xl:w-[350px] shrink-0 space-y-6 xl:sticky xl:top-[90px]">
              <ProgressInline
                reviewedToday={reviewedToday}
                nextReviewAt={nextReviewAt}
                due={due}
                isLoading={isLoading}
              />

              <SuggestionCard
                due={due}
                reviewedToday={reviewedToday}
                nextReviewAt={nextReviewAt}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
