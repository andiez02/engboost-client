# EngBoost - English Learning Platform

EngBoost is a modern web application designed to help users learn English vocabulary through image recognition technology.

## 📷 Features

- **Image Recognition**: Upload images and get instant English vocabulary with Vietnamese translations
- **Flashcard System**: Create, save, and organize flashcards to study vocabulary
- **Study Progress Tracking**: Monitor your learning progress over time
- **Course Management**: Access structured learning courses for different levels
- **Personalized Learning**: Study at your own pace with customized learning paths
- **AI Chatbot**: Interactive English learning assistant

## 🌐 Application Pages

### Public Pages

#### 🏠 Home (`/`)
- Landing page with platform introduction
- Feature highlights and benefits
- Call-to-action for registration
- Testimonials and success stories

#### 📚 Courses (`/course`)
- Browse available English learning courses
- Filter courses by level and category
- View course details and curriculum
- Enroll in courses

#### 🤖 Chatbot Introduction (`/chatbot-intro`)
- Introduction to AI-powered English learning assistant
- Feature showcase and use cases
- Demo and examples

#### 🔐 Authentication (`/auth`)
- **Login**: User authentication with email/password
- **Register**: New user registration with email verification
- **Account Verification**: Email verification process

### User Dashboard Pages

#### � Dashboard (`/dashboard`)
- Overview of learning progress
- Recent activity summary
- Course progress tracking
- Flashcard statistics
- Quick access to learning tools

#### 💬 Chatbot (`/chatbot`)
- Interactive AI English learning assistant
- Real-time conversation practice
- Grammar and vocabulary help
- Personalized learning suggestions

#### 📖 My Courses (`/my-course`)
- List of enrolled courses
- Course progress tracking
- Continue learning from where you left off
- Course completion certificates

#### 🎴 Flashcards (`/flashcard`)
Main flashcard management hub with three tabs:

##### Tab 1: Snaplang (Snap & Learn)
- **Image Upload**: Upload photos via file picker or camera
- **Drag & Drop**: Drag images directly into the upload area
- **Object Detection**: AI-powered image recognition
- **Instant Flashcards**: Auto-generate flashcards from detected objects
- **Preview**: Review generated flashcards before saving
- **Save to Folder**: Organize flashcards into existing or new folders
- **Real-time Results**: See detection results immediately

##### Tab 2: My Folders
- **Folder Management**: Create, view, and organize flashcard folders
- **Folder Statistics**: View flashcard count per folder
- **Public/Private**: Toggle folder visibility
- **Quick Access**: Navigate to folder contents
- **Bulk Operations**: Manage multiple folders at once

##### Tab 3: Discover
- **Public Flashcards**: Browse community-shared flashcards
- **Search & Filter**: Find flashcards by topic or keyword
- **Import**: Add public flashcards to your collection
- **Popular Content**: Discover trending flashcard sets

#### ⚙️ Settings (`/settings`)
- **Account Tab**: Update profile information, avatar, username
- **Security Tab**: Change password, manage sessions

### Admin Pages

#### 🎛️ Admin Dashboard (`/admin`)
- System overview and statistics
- User activity monitoring
- Content management overview
- Platform analytics

#### 👥 User Management (`/admin/users`)
- View all registered users
- User role management
- Account status control
- User activity logs

#### 📚 Course Management (`/admin/courses`)
- Create and edit courses
- Manage course content and curriculum
- Set course pricing and availability
- Monitor course enrollments

#### 🎴 Flashcard Management (`/admin/flashcards`)
- Review user-generated flashcards
- Moderate public flashcard content
- Manage flashcard categories
- Content quality control

#### 📝 Blog Management (`/admin/blogs`)
- Create and publish blog posts
- Edit existing content
- Manage blog categories and tags
- Content scheduling

#### ⚙️ Admin Settings (`/admin/settings`)
- **Account Tab**: Admin profile management
- **Security Tab**: Admin security settings

### Error Pages

#### 🚫 404 Not Found (`/404`)
- Custom 404 error page
- Navigation back to home
- Helpful suggestions

## 🚀 Core Functionality

### Snap & Learn (Snaplang)

Upload any image and EngBoost will automatically:

1. Identify objects in the image using AI
2. Generate relevant English vocabulary
3. Provide Vietnamese translations
4. Create flashcards for future study
5. Allow saving to organized folders

### Flashcard Management

- Organize flashcards into folders
- Create new folders or use existing ones
- Public/private folder visibility
- Review flashcards with interactive UI
- Track your vocabulary growth

### Course System

- Structured learning paths
- Progress tracking
- Interactive lessons
- Quizzes and assessments
- Completion certificates

### AI Chatbot

- Real-time English conversation practice
- Grammar and vocabulary assistance
- Personalized learning recommendations
- 24/7 availability

## 🔧 Technology Stack

- **Frontend**: React, Redux, Material UI, TailwindCSS
- **UI/UX**: Modern, responsive design optimized for all devices
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router
- **Forms**: React Hook Form
- **Notifications**: React Toastify
- **Animations**: Framer Motion, AOS (Animate On Scroll)
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React, Material Icons

## 🛠️ Development Setup

### Prerequisites

- Node.js (v18+ recommended)
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd engboost-frontend

# Install dependencies
yarn install

# Start the development server
yarn dev
```

The app will run at `http://localhost:5173` by default.

## 📦 Build for Production

```bash
# Build the app
yarn build

# Preview the production build
yarn preview
```

## 🌐 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Sidebar, Footer
│   ├── Course/         # Course-related components
│   ├── Flashcard/      # Flashcard components
│   └── SaveFlashcardModal/  # Modal for saving flashcards
├── pages/              # Application pages
│   ├── Auth/           # Authentication pages
│   ├── UserPage/       # User dashboard pages
│   ├── Admin/          # Admin panel pages
│   ├── GeneralPage/    # Public pages
│   └── Settings/       # Settings pages
├── redux/              # Redux store, slices, and reducers
│   ├── user/           # User authentication state
│   ├── folder/         # Flashcard folder state
│   └── store.js        # Redux store configuration
├── utils/              # Utility functions and constants
│   ├── authorizeAxios.js  # Axios interceptors
│   └── constants.js    # App constants
├── apis/               # API service integrations
├── assets/             # Static assets (images, icons)
└── modal/              # Modal system
```

## 🔐 Authentication & Authorization

- JWT-based authentication
- Access token (1 hour expiry) stored in httpOnly cookie
- Refresh token (15 days expiry) for automatic token renewal
- Automatic token refresh on 401/410 errors
- Role-based access control (CLIENT, ADMIN)

## 📝 Slogan

**"Fuel your Fluency - Nâng tầm tiếng Anh của bạn"**

---

© EngBoost. All rights reserved.
