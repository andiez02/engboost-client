export const API_ROOT = 'http://localhost:5050/api';

export const routes = {
  //Home
  DEFAULT: '/',
  //Home
  HOME: '/home',
  //Course
  COURSE: '/course',
  //Chatbot
  CHATBOT_INTRO: '/chatbot_intro',
  CHATBOT: '/chatbot',
  //About Us
  ABOUT_US: '/about_us',

  /* CLIENT */
  //Dashboard
  DASHBOARD: '/dashboard',
  //Flashcard
  FLASHCARD: '/flashcard',
  //Dashboard
  MY_COURSE: '/my_course',
  //Setting Account
  SETTINGS_ACCOUNT: '/settings/account',
  //Setting Security
  SETTINGS_SECURITY: '/settings/security',
  //Flashcard Discover
  FLASHCARD_DISCOVER: '/flashcard/discover',
  //Flashcard Folders
  FLASHCARD_FOLDERS: '/flashcard/folders',
  //Flashcard Snaplang
  FLASHCARD_SNAPLANG: '/flashcard/snaplang',

  // Courses
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:courseId',

  /* ADMIN */
  //Admin Dashboard
  ADMIN_DASHBOARD: '/admin/dashboard',
  //Admin Setting account
  ADMIN_SETTINGS_ACCOUNT: '/admin/settings/account',
  //Admin Setting Security
  ADMIN_SETTINGS_SECURITY: '/admin/settings/security',

  //Admin Course Management
  ADMIN_COURSE_MANAGEMENT: '/admin/course_management',
  //Admin Blog Management
  ADMIN_BLOG_MANAGEMENT: '/admin/blog_management',
  //Admin Flashcard Management
  ADMIN_FLASHCARD_MANAGEMENT: '/admin/flashcard_management',
  //Admin User Management
  ADMIN_USER_MANAGEMENT: '/admin/user_management',
};
