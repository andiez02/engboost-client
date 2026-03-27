# EngBoost - English Learning Platform

EngBoost is a modern full-stack web application for learning English vocabulary through image recognition, AI-generated content, and spaced repetition.

## 📷 Features

- **Snaplang (Snap & Learn)**: Upload images → AI detects objects → auto-generate flashcards with English/Vietnamese
- **Spaced Repetition (SRS)**: SM-2 algorithm schedules reviews at optimal intervals
- **AI Deck Generation**: Generate vocabulary decks by topic using Gemini 2.5 Flash
- **Flashcard Management**: Create, organize, and study flashcards in folders
- **Study Mode**: Full-screen study session with flip cards, keyboard shortcuts, and 4-level rating
- **Course System**: Structured video-based learning courses
- **AI Chatbot**: Interactive English learning assistant
- **Dashboard**: Overview of due cards, folders, and learning progress

---

## 🏗️ Architecture

```
engboost-frontend/   React + Vite + MUI + Redux Toolkit
engboot-express/     Node.js + Express + TypeScript + Sequelize + PostgreSQL
```

### Backend (`engboot-express`)

- **Runtime**: Node.js with TypeScript (`tsx watch`)
- **Framework**: Express.js
- **ORM**: Sequelize v6 with PostgreSQL
- **Auth**: JWT (access token in httpOnly cookie, refresh token 15 days)
- **AI**: Google Gemini 2.5 Flash API (`gemini-2.5-flash`)
- **Image Recognition**: Snaplang detection API
- **Port**: `5050`

#### API Modules

| Module | Routes | Description |
|--------|--------|-------------|
| `auth` | `POST /api/auth/*` | Login, register, verify, refresh |
| `user` | `GET/PATCH /api/users/*` | Profile, avatar |
| `folder` | `CRUD /api/folders` | Flashcard folder management |
| `flashcard` | `CRUD /api/flashcards` | Flashcard CRUD + SRS review |
| `study` | `GET/POST /api/study/*` | Due cards, review submission, stats |
| `deck` | `POST /api/decks/generate` | AI-generated vocabulary decks |
| `course` | `/api/courses/*` | Course management |
| `snaplang` | `POST /api/snaplang/detect` | Image → vocabulary detection |

#### Database Schema (PostgreSQL)

```
users           id, email, password, username, avatar, role, is_active
folders         id, title, user_id, flashcard_count, is_public
flashcards      id, english, vietnamese, object, image_url, folder_id, user_id,
                is_public, repetition, interval, ease_factor,
                next_review_at, last_reviewed_at
courses         id, title, description, video_url, user_id, is_public
user_courses    id, user_id, course_id, registered_at
```

#### SRS Engine (`src/utils/srsEngine.ts`)

Implements the SM-2 spaced repetition algorithm:
- Rating 0 (Again) → reset, review tomorrow
- Rating 1 (Hard) → short interval, lower ease
- Rating 2 (Good) → normal progression
- Rating 3 (Easy) → longer interval, higher ease
- `next_review_at` updated after each review

### Frontend (`engboost-frontend`)

- **Framework**: React 18 + Vite
- **UI**: Material UI (MUI) v5 — primary component library
- **Styling**: TailwindCSS for layout utilities
- **State**: Redux Toolkit + Redux Persist
- **Routing**: React Router v6
- **HTTP**: Axios with JWT interceptors (auto-refresh on 401)
- **Port**: `5173`

#### Redux Slices

| Slice | State |
|-------|-------|
| `user` | Auth, current user |
| `folders` | Folder list, CRUD |
| `study` | Due cards, session progress, flip state |

---

## 🌐 Application Pages

### Public

| Route | Page |
|-------|------|
| `/home` | Landing page |
| `/course` | Browse courses |
| `/chatbot_intro` | Chatbot introduction |
| `/login`, `/register` | Authentication |
| `/account/verification` | Email verification |

### User (Protected — role: CLIENT)

| Route | Page |
|-------|------|
| `/dashboard` | Overview: folders, due cards, course progress |
| `/flashcard/snaplang` | Snap & Learn — image → flashcards |
| `/flashcard/folders` | My Folders — manage flashcard folders |
| `/flashcard/discover` | Discover — public folders + AI deck generator |
| `/study?folderId=<id>` | Study Mode — SRS session for a folder |
| `/study` | Study Mode — all due cards across folders |
| `/my_course` | My enrolled courses |
| `/chatbot` | AI English assistant |
| `/settings/account` | Profile settings |
| `/settings/security` | Password & security |

### Admin (Protected — role: ADMIN)

| Route | Page |
|-------|------|
| `/admin/dashboard` | System overview |
| `/admin/user_management` | User management |
| `/admin/course_management` | Course management |
| `/admin/flashcard_management` | Flashcard moderation |
| `/admin/blog_management` | Blog management |

---

## 🎴 Flashcard Tab Details

### Tab 1 — Snaplang
- Upload image (file picker, drag & drop, or camera)
- AI detects objects → generates `english`, `vietnamese`, `object` (example sentence)
- Save to existing or new folder
- After save: "Study now" action button appears → navigates to `/study?folderId=<id>`

### Tab 2 — My Folders
- Grid of folder cards with flashcard count
- Each folder has a "Study" button → `/study?folderId=<id>`
- Click folder → `FolderDetailModal` with full flashcard list
- "Học ngay" button in modal → SRS study session
- Create / rename / delete folders (updates Redux state immediately, no reload needed)

### Tab 3 — Discover
- Browse public folders
- **Generate Vocabulary by Topic** section at top:
  - Topics: Food, Travel, Work, Daily Life, Technology, Health
  - Calls `POST /api/decks/generate` → Gemini generates 10 vocab items
  - Creates folder + inserts flashcards → redirects to `/study?folderId=<id>`

### Study Tab (nav button)
- Navigates directly to `/study` (all due cards, no folder filter)

---

## 🧠 Study Mode (`/study`)

Full-screen SRS study session:

- Loads due cards via `GET /api/study?folderId=<id>`
- 3D flip card animation (click or press `Space`)
- After flip: rate recall with 4 buttons or keyboard `1`–`4`
  - `1` Again · `2` Hard · `3` Good · `4` Easy
- Progress bar + card counter
- On session complete: "Refresh" or "Back to Flashcards"

---

## 🤖 AI Deck Generation

`POST /api/decks/generate`

```json
{ "topic": "Work", "level": "beginner", "count": 10 }
```

- Calls Gemini 2.5 Flash with structured prompt
- Returns JSON array of `{ word, meaning_vi, example }`
- Deduplicates, validates count
- Creates folder with timestamped title (avoids unique constraint)
- Bulk inserts flashcards with `next_review_at = now`
- Returns `{ folderId }`

---

## � Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, MUI v5, TailwindCSS |
| State | Redux Toolkit, Redux Persist |
| Backend | Node.js, Express, TypeScript |
| ORM | Sequelize v6 |
| Database | PostgreSQL |
| Auth | JWT (httpOnly cookie) |
| AI | Google Gemini 2.5 Flash |
| SRS | SM-2 algorithm |

---

## 🛠️ Development Setup

### Prerequisites
- Node.js v18+
- PostgreSQL
- Yarn (frontend), npm (backend)

### Backend

```bash
cd engboot-express
cp .env.example .env   # fill in DB_* and GEMINI_API_KEY
npm install
npm run db:migrate     # run Sequelize migrations
npm run dev            # tsx watch src/server.ts → port 5050
```

### Frontend

```bash
cd engboost-frontend
yarn install
yarn dev               # Vite → port 5173
```

---

## 📝 Slogan

**"Fuel your Fluency — Nâng tầm tiếng Anh của bạn"**

---

© EngBoost. All rights reserved.
