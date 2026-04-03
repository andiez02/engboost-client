import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { routes } from './utils/constants.js';

import NotFound from './pages/404/NotFound.jsx';
import Auth from './pages/Auth/Auth.jsx';
import AccountVerification from './pages/Auth/AccountVerification.jsx';
import Home from './pages/GeneralPage/Home.jsx';
import Course from './pages/GeneralPage/Course.jsx';
import Dashboard from './pages/UserPage/Dashboard/Dashboard.jsx';
import Flashcard from './pages/UserPage/Flashcard/Flashcard.jsx';
import MyCourse from './pages/UserPage/MyCourse/MyCourse.jsx';
import Settings from './pages/Settings/Settings.jsx';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './redux/user/userSlice.js';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminSettings from './pages/AdminSettings/AdminSettings.jsx';
import UserManagement from './pages/Admin/UserManagement.jsx';
import CourseManagement from './pages/Admin/CourseManagement/CourseManagement.jsx';
import FlashcardManagement from './pages/Admin/FlashcardManagement.jsx';
import BlogManagement from './pages/Admin/BlogManagement.jsx';
import AdminVideoPlayer from './pages/Admin/CourseManagement/AdminVideoPlayer.jsx';
import UserVideoPlayer from './pages/UserPage/MyCourse/UserVideoPlayer.jsx';
import ChatbotIntro from './pages/GeneralPage/ChatbotIntro.jsx';
import Chatbot from './pages/UserPage/Chatbot/Chatbot.jsx';
import DiscoverPage from './pages/UserPage/Discover/DiscoverPage.jsx';
import AdminLayout from './components/Layout/AdminLayout.jsx';
import StudyPage from './pages/UserPage/Study/StudyPage.jsx';
import DailyMissionsPage from './pages/UserPage/Challenge/ChallengePage.jsx';
import AdminExploreFolders from './pages/Admin/AdminExploreFolders.jsx';

const ProtectedRoute = ({ user, allowedRoles }) => {
  if (!user) return <Navigate to="/login" replace={true} />;
  if (!allowedRoles.includes(user.role)) {
    return user.role === 'ADMIN' ? (
      <Navigate to="/admin/dashboard" replace={true} />
    ) : (
      <Navigate to="/home" replace={true} />
    );
  }
  return <Outlet />;
};

function App() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <Routes>
      {/* Redirect Route */}
      <Route
        path={routes.DEFAULT}
        element={
          currentUser?.user?.role === 'ADMIN' ? (
            <Navigate to="/admin/dashboard" replace={true} />
          ) : (
            <Navigate to="/home" replace={true} />
          )
        }
      />

      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />

      {/* Public Pages */}
      <Route path={routes.HOME} element={<Home />} />
      <Route path={routes.COURSE} element={<Course />} />
      <Route path={routes.CHATBOT_INTRO} element={<ChatbotIntro />} />

      {/* Protected Routes for CLIENT */}
      <Route
        element={
          <ProtectedRoute user={currentUser?.user} allowedRoles={['CLIENT']} />
        }
      >
        <Route path={routes.DASHBOARD} element={<Dashboard />} />
        <Route path={routes.FLASHCARD} element={<Flashcard />} />
        <Route path={routes.MY_COURSE} element={<MyCourse />} />
        <Route path={routes.SETTINGS_ACCOUNT} element={<Settings />} />
        <Route path={routes.SETTINGS_SECURITY} element={<Settings />} />
        <Route path={routes.FLASHCARD_DISCOVER} element={<Flashcard />} />
        <Route path={routes.FLASHCARD_FOLDERS} element={<Flashcard />} />
        <Route path={routes.FLASHCARD_SNAPLANG} element={<Flashcard />} />
        <Route path={routes.FLASHCARD_EXPLORE} element={<Flashcard />} />
        <Route path={routes.CHATBOT} element={<Chatbot />} />
        <Route path={routes.STUDY} element={<StudyPage />} />
        <Route path={routes.CHALLENGES} element={<DailyMissionsPage />} />
        <Route path={routes.DISCOVER} element={<DiscoverPage />} />
        <Route
          path="/my_course/:courseId/video"
          element={<UserVideoPlayer />}
        />
      </Route>

      {/* Protected Routes for ADMIN */}
      <Route
        element={
          <ProtectedRoute user={currentUser?.user} allowedRoles={['ADMIN']} />
        }
      >
        <Route element={<AdminLayout />}>
          {/* Admin Dashboard */}
          <Route path={routes.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          {/* Admin User Management */}
          <Route
            path={routes.ADMIN_USER_MANAGEMENT}
            element={<UserManagement />}
          />
          {/* Admin Course Management */}
          <Route
            path={routes.ADMIN_COURSE_MANAGEMENT}
            element={<CourseManagement />}
          />
          {/* Admin Flashcard Management */}
          <Route
            path={routes.ADMIN_FLASHCARD_MANAGEMENT}
            element={<FlashcardManagement />}
          />
          {/* Admin Blog Management */}
          <Route
            path={routes.ADMIN_BLOG_MANAGEMENT}
            element={<BlogManagement />}
          />
          <Route
            path={routes.ADMIN_EXPLORE_FOLDERS}
            element={<AdminExploreFolders />}
          />
          <Route
            path="/admin/courses/:courseId/video"
            element={<AdminVideoPlayer />}
          />
        </Route>

        {/* Admin Settings */}
        <Route
          path={routes.ADMIN_SETTINGS_ACCOUNT}
          element={<AdminSettings />}
        />
        <Route
          path={routes.ADMIN_SETTINGS_SECURITY}
          element={<AdminSettings />}
        />
      </Route>

      {/* Not Found Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
