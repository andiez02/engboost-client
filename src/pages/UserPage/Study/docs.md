# Study Feature Documentation

## Tổng quan

Tính năng Study là core của EngBoost — một hệ thống ôn tập flashcard dựa trên thuật toán **Spaced Repetition System (SRS)** với SM-2 algorithm. Người dùng học theo batch 20 thẻ/lần, tự đánh giá mức độ nhớ (Again/Hard/Good/Easy), và hệ thống tự động tính lịch ôn tiếp theo.

---

## Luồng hoạt động

```
1. User vào /study (hoặc /study?folderId=<id>)
   ↓
2. Frontend dispatch fetchDueCards(folderId)
   → GET /api/study?folderId=<id>
   → Backend trả về tối đa 20 thẻ có next_review_at <= now
   ↓
3. User flip card (Space hoặc click)
   → Hiện mặt sau (Vietnamese meaning)
   ↓
4. User rate (1/2/3/4 hoặc click Again/Hard/Good/Easy)
   → Frontend dispatch submitReview({ cardId, rating })
   → POST /api/study/review
   → Backend tính SM-2, update next_review_at
   ↓
5. Lặp lại bước 3-4 cho đến hết 20 thẻ
   ↓
6. Session Complete
   → Hiện stats (reviewed, correct, accuracy)
   → CTA: "Continue Review (N due)" nếu còn thẻ
   → CTA: "All done for today! 🎉" nếu hết thẻ
```

---

## Cấu trúc file

```
src/pages/UserPage/Study/
├── StudyPage.jsx              # Main container — state machine
├── StudyHeader.jsx            # Header với progress bar + close button
├── FlashcardView.jsx          # 3D flip card (front: English, back: Vietnamese)
├── RatingButtons.jsx          # 4 nút Again/Hard/Good/Easy
├── StudyComplete.jsx          # Màn kết thúc session
├── EmptyStudy.jsx             # Empty states (no-cards / caught-up / folder-empty)
├── LeaveSessionDialog.jsx     # Confirm dialog khi thoát giữa chừng
└── docs.md                    # File này
```

---

## Component chi tiết

### 1. StudyPage.jsx

**Trách nhiệm:** State machine chính, điều phối toàn bộ study flow.

**Redux state:**
- `cards` — mảng 20 thẻ due từ backend
- `currentIndex` — thẻ đang hiện (0-19)
- `isFlipped` — card đã flip chưa
- `isLoading` — đang fetch cards
- `isSubmitting` — đang submit review
- `sessionDone` — hết 20 thẻ
- `reviewedCount` — số thẻ đã rate
- `correctCount` — số thẻ rate Good/Easy (≥2)
- `stats.due` — tổng số thẻ due (dùng cho Session Complete)

**Keyboard shortcuts:**
- `Space` — flip card
- `1` — Again (rating 0)
- `2` — Hard (rating 1)
- `3` — Good (rating 2)
- `4` — Easy (rating 3)

**Render logic:**
```js
if (isLoading) → CircularProgress
if (error) → Error message
if (sessionDone && cards.length === 0) → EmptyStudy variant="no-cards"
if (sessionDone) → StudyComplete
if (!card && !sessionDone) → EmptyStudy variant="caught-up" hoặc "folder-empty"
else → Study UI (header + card + rating buttons)
```

---

### 2. FlashcardView.jsx

**Trách nhiệm:** Hiển thị flashcard 3D flip.

**Props:**
- `card` — object `{ id, english, vietnamese, object? }`

**Behavior:**
- Click anywhere trên card → dispatch `flipCard()`
- Front face: English word + part of speech (nếu có)
- Back face: Vietnamese meaning + gradient purple background

**Style:**
- `minHeight: 300px`
- `perspective: 1400px` — 3D depth
- `transition: 0.45s cubic-bezier` — smooth flip
- Gradient purple back face: `linear-gradient(135deg, #4F46E5, #7C3AED)`

---

### 3. RatingButtons.jsx

**Trách nhiệm:** 4 nút đánh giá.

**Props:**
- `onRate: (rating: 0|1|2|3) => void`
- `disabled: boolean` — khi đang submit

**Button map:**
| Label | Key | Rating | Color |
|---|---|---|---|
| Again | 1 | 0 | Red (#DC2626) |
| Hard | 2 | 1 | Amber (#D97706) |
| Good | 3 | 2 | Green (#16A34A) |
| Easy | 4 | 3 | Blue (#2563EB) |

**Style:**
- `ButtonBase` với custom colored backgrounds
- Hover: `translateY(-1px)` + shadow
- Disabled: `opacity: 0.5`

---

### 4. StudyHeader.jsx

**Trách nhiệm:** Header với progress bar + counter.

**Props:**
- `folderName?: string` — hiện tên folder nếu study theo folder
- `onLeave: () => void` — callback khi bấm close

**Layout:**
```
[×]  Study Session (hoặc folder name)  [N / Total]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Progress bar:**
- `pct = (current - 1) / total × 100`
- Gradient indigo: `linear-gradient(90deg, #4F46E5, #7C3AED)`

---

### 5. StudyComplete.jsx

**Trách nhiệm:** Màn kết thúc session.

**Props:**
- `reviewed` — số thẻ đã rate
- `correct` — số thẻ rate Good/Easy
- `dueCount` — số thẻ còn lại (từ stats API)
- `folderId?` — nếu study theo folder
- `onReview: () => void` — callback "Continue Review"

**Stats chips:**
- Reviewed (indigo)
- Correct (green)
- Accuracy % (amber)

**Encouragement message:**
| Accuracy | Message |
|---|---|
| ≥90% | Outstanding! 🔥 |
| ≥70% | Great job! 💪 |
| ≥50% | Good effort! 📚 |
| <50% | Keep going! 🌱 |

**CTA logic:**
```js
if (dueCount > 0) {
  primary: "Continue Review (N due)" → onReview()
  secondary: "Learn New Topic" → /flashcard/folders
} else {
  primary: "All done for today! 🎉" → /dashboard
  secondary: "Learn New Topic" → /flashcard/folders
}
tertiary: "Scan Image" → /flashcard/snaplang
```

---

### 6. EmptyStudy.jsx

**Trách nhiệm:** Empty states.

**Props:**
- `variant: 'no-cards' | 'caught-up' | 'folder-empty'`
- `folderName?: string`

**Variants:**

| Variant | Emoji | Title | CTA | Path |
|---|---|---|---|---|
| `no-cards` | 📭 | No cards to review yet | Create your first deck | /flashcard/folders |
| `caught-up` | ✅ | You're all caught up! | Add more cards | /flashcard/folders |
| `folder-empty` | 📂 | No due cards in this folder | Study all due cards | /study |

---

### 7. LeaveSessionDialog.jsx

**Trách nhiệm:** Confirm dialog khi user bấm close giữa session.

**Props:**
- `open: boolean`
- `onConfirm: () => void` — dispatch resetSession + navigate /dashboard
- `onCancel: () => void` — đóng dialog

**Content:**
```
Leave session?
Your progress will be lost.

[Stay]  [Leave]
```

---

## Backend API

### `GET /api/study?folderId=<id>`

**Query params:**
- `folderId` (optional) — scope theo folder

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "english": "hello",
      "vietnamese": "xin chào",
      "object": "interjection",
      "repetition": 2,
      "interval": 6,
      "ease_factor": 2.5,
      "next_review_at": "2024-01-15T10:00:00Z",
      "last_reviewed_at": "2024-01-09T10:00:00Z"
    }
    // ... tối đa 20 thẻ
  ]
}
```

**Logic:**
- WHERE `user_id = current_user` AND `next_review_at <= now`
- ORDER BY `next_review_at ASC` (thẻ quá hạn lâu nhất lên trước)
- LIMIT 20

---

### `POST /api/study/review`

**Body:**
```json
{
  "cardId": "uuid",
  "rating": 0 | 1 | 2 | 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "repetition": 3,
    "interval": 15,
    "ease_factor": 2.5,
    "next_review_at": "2024-01-30T10:00:00Z",
    "last_reviewed_at": "2024-01-15T10:00:00Z"
  }
}
```

**Logic:**
1. Validate ownership (403 nếu không phải thẻ của user)
2. Gọi `updateSpacedRepetition(card, rating)` — SM-2 algorithm
3. Update `repetition`, `interval`, `ease_factor`, `next_review_at`, `last_reviewed_at`
4. Save vào DB

---

### `GET /api/study/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "due": 33,
    "reviewedToday": 12
  }
}
```

**Logic:**
- `due` — COUNT thẻ có `next_review_at <= now` (không limit)
- `reviewedToday` — COUNT thẻ có `last_reviewed_at >= start of UTC day`

---

## SM-2 Algorithm

### Các trường SRS

| Field | Ý nghĩa | Default |
|---|---|---|
| `repetition` | Số lần ôn thành công liên tiếp | 0 |
| `interval` | Số ngày đến lần ôn tiếp theo | 1 |
| `ease_factor` | Hệ số dễ/khó (1.3 - 3.0) | 2.5 |

### Rating map

| Button | Key | Rating | Ý nghĩa |
|---|---|---|---|
| Again | 1 | 0 | Quên hoàn toàn |
| Hard | 2 | 1 | Nhớ nhưng khó |
| Good | 3 | 2 | Nhớ bình thường |
| Easy | 4 | 3 | Nhớ rất dễ |

### Logic tính interval mới

```
rating = 0 (Again):
  → interval = 1 ngày
  → repetition = 0  ← reset về đầu

rating = 1 (Hard):
  → interval = max(1, round(interval × 1.2))  ← tăng nhẹ 20%
  → repetition += 1

rating = 2 (Good):
  → repetition = 0: interval = 1
  → repetition = 1: interval = 6
  → repetition ≥ 2: interval = round(interval × ease_factor)
  → repetition += 1

rating = 3 (Easy):
  → repetition = 0: interval = 4  ← skip ngày đầu
  → repetition ≥ 1: interval = round(interval × ease_factor × 1.3)  ← bonus 30%
  → repetition += 1
```

### Logic tính ease_factor mới

```
new_ef = max(1.3, ef + 0.1 - (3 - rating) × (0.08 + (3 - rating) × 0.02))

rating = 3: ef += 0.10   → thẻ dễ hơn
rating = 2: ef += 0.00   → giữ nguyên
rating = 1: ef -= 0.14   → thẻ khó hơn
rating = 0: ef -= 0.32   → thẻ rất khó
```

### Ví dụ thực tế

Thẻ mới: `repetition=0, interval=1, ease_factor=2.5`

| Lần | Rating | interval mới | Lần ôn tiếp |
|---|---|---|---|
| 1 | Good (2) | 1 ngày | Ngày mai |
| 2 | Good (2) | 6 ngày | +6 ngày |
| 3 | Good (2) | 15 ngày | +15 ngày (6 × 2.5) |
| 4 | Easy (3) | 49 ngày | +49 ngày (15 × 2.5 × 1.3) |
| 4 | Again (0) | 1 ngày | Reset về ngày mai |

---

## Redux flow

### studySlice.js

**State:**
```js
{
  cards: [],
  currentIndex: 0,
  isFlipped: false,
  isLoading: false,
  isSubmitting: false,
  error: null,
  stats: { due: 0, reviewedToday: 0 },
  sessionDone: false,
  reviewedCount: 0,
  correctCount: 0,
}
```

**Actions:**
- `flipCard()` — toggle `isFlipped`
- `resetSession()` — reset tất cả về initial state

**Async thunks:**
- `fetchDueCards(folderId?)` — GET /api/study
- `submitReview({ cardId, rating })` — POST /api/study/review
- `fetchStats()` — GET /api/study/stats

**Selectors:**
- `selectCurrentCard(state)` — `cards[currentIndex] ?? null`
- `selectStudyProgress(state)` — `{ current, total, remaining }` (memoized)

**submitReview.fulfilled logic:**
```js
state.reviewedCount += 1
if (rating >= 2) state.correctCount += 1
state.currentIndex += 1
state.isFlipped = false

if (currentIndex >= cards.length) {
  state.sessionDone = true
}
```

---

## UX Details

### Progress bar behavior

- Hiện ở `StudyHeader`
- `pct = (currentIndex / total) × 100`
- Update ngay sau mỗi lần rate (trước khi card tiếp theo xuất hiện)

### Card transitions

- Flip: `0.45s cubic-bezier(0.4, 0, 0.2, 1)`
- Card advance: không có animation (instant switch)

### Button states

- Disabled khi `isSubmitting = true`
- Hover: `translateY(-1px)` + shadow
- Active: `translateY(0)`

### Empty states

| Condition | Variant |
|---|---|
| `sessionDone && cards.length === 0` | `no-cards` |
| `!card && !sessionDone && !folderId` | `caught-up` |
| `!card && !sessionDone && folderId` | `folder-empty` |

### Leave confirmation

- Chỉ hiện khi user bấm close button ở header
- Không hiện khi session complete tự nhiên
- Confirm → `resetSession()` + `navigate('/dashboard')`

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Space` | Flip card |
| `1` | Rate Again (0) |
| `2` | Rate Hard (1) |
| `3` | Rate Good (2) |
| `4` | Rate Easy (3) |

**Implementation:**
```js
useEffect(() => {
  const onKey = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      dispatch(flipCard());
      return;
    }
    if (!isFlipped) return;
    const map = { '1': 0, '2': 1, '3': 2, '4': 3 };
    if (map[e.key] !== undefined) handleRate(map[e.key]);
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [isFlipped, handleRate, dispatch]);
```

---

## Styling

### Color palette

- Primary: `#4F46E5` (indigo-600)
- Primary dark: `#3730A3` (indigo-800)
- Gradient: `linear-gradient(135deg, #4F46E5, #7C3AED)`
- Background: `linear-gradient(160deg, #f0f0ff, #f8f8ff, #f0f7ff)`

### Rating button colors

- Again: `#DC2626` (red-600) on `#FEE2E2` (red-100)
- Hard: `#D97706` (amber-600) on `#FEF3C7` (amber-100)
- Good: `#16A34A` (green-600) on `#DCFCE7` (green-100)
- Easy: `#2563EB` (blue-600) on `#DBEAFE` (blue-100)

### Card shadows

- Front: `0 8px 40px rgba(79,70,229,0.10)`
- Back: `0 8px 40px rgba(79,70,229,0.30)`
- Complete card: `0 8px 48px rgba(79,70,229,0.12)`

---

## Performance notes

### Memoization

`selectStudyProgress` dùng `createSelector` để tránh re-render không cần thiết:
```js
export const selectStudyProgress = createSelector(
  (state) => state.study.currentIndex,
  (state) => state.study.cards.length,
  (currentIndex, total) => ({
    current: currentIndex + 1,
    total,
    remaining: total - currentIndex,
  })
);
```

### Layout shift prevention

Bottom area có `height: 100px` cố định — rating buttons và hint text đều render trong cùng một container, tránh card bị nhảy khi flip.

---

## Known issues / limitations

### 1. Limit 20 cards per batch

Backend hardcode `LIMIT 20` trong query. Nếu user có 50 thẻ due, họ phải học 3 batch (20 + 20 + 10). Đây là thiết kế có chủ đích (giống Anki) để tránh session quá dài.

### 2. reviewedToday dùng UTC

`startOfDay` tính theo UTC, không theo timezone của user. User ở UTC+7 học lúc 6h sáng sẽ bị tính vào "hôm qua" theo UTC.

**Fix:** Backend nên nhận `timezone` từ client hoặc dùng `user.timezone` từ profile.

### 3. Thẻ mới không tự động due

Khi tạo thẻ mới, nếu `next_review_at` không được set, thẻ sẽ không xuất hiện trong session. Cần đảm bảo khi tạo thẻ, `next_review_at = now`.

### 4. Không có undo

Nếu user bấm nhầm rating, không có cách nào undo. Thẻ đã được tính SM-2 và lưu vào DB.

**Potential fix:** Thêm nút "Undo last review" trong vài giây đầu sau khi rate.

---

## Testing

### Property-based tests (fast-check)

File: `src/redux/study/__tests__/studySlice.test.js`

- Property 5: Flip toggles isFlipped
- Property 7: submitReview advances state correctly
- Property 8: submitReview failure does not advance card
- Property 9: selectStudyProgress returns correct derived values
- Property 10: Last card completion sets sessionDone
- Property 13: resetSession restores initial state
- Property 14: selectCurrentCard returns correct card or null

File: `src/pages/UserPage/Study/__tests__/StudyPage.test.jsx`

- Property 3: Folder-scoped fetch includes folderId
- Property 4: First card shown immediately after load
- Property 6: Keyboard rating maps to correct value

### Unit tests (optional)

- EmptyStudy variants render correctly
- StudyComplete encouragement message varies by accuracy
- StudyHeader progress bar updates
- LeaveSessionDialog callbacks

---

## Future improvements

### 1. Streak tracking

Thêm field `last_session_date` vào User model, tính streak dựa trên consecutive days có session complete.

### 2. Daily goal

Cho phép user set "N cards/day" goal, hiện progress bar trên dashboard.

### 3. Study heatmap

Calendar view hiển thị số thẻ đã học mỗi ngày (giống GitHub contribution graph).

### 4. Card preview

Khi hover vào progress counter, hiện preview 3 thẻ tiếp theo.

### 5. Audio pronunciation

Thêm nút speaker để phát âm English word (dùng Web Speech API hoặc Google TTS).

### 6. Undo last review

Thêm nút "Undo" trong 5s sau khi rate, gọi `DELETE /api/study/review/:cardId/last`.

### 7. Custom study

Cho phép user chọn "Study all cards in folder" (bỏ qua due date), hoặc "Cram mode" (học lại tất cả thẻ đã học).

---

## Changelog

### 2024-01-15 — Learning-driven UX redesign
- Thêm `DailyGoalSection` vào Dashboard
- Redesign `FlashcardView` với gradient purple back face
- Redesign `RatingButtons` với custom colored backgrounds
- Thêm `StudyHeader` với progress bar
- Thêm `LeaveSessionDialog`
- Refactor `EmptyStudy` với 3 variants
- Fix `StudyComplete` navigation targets
- Memoize `selectStudyProgress` selector
- Fix layout shift khi flip card

---

## References

- [SM-2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [Anki Manual](https://docs.ankiweb.net/studying.html)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [MUI Components](https://mui.com/material-ui/)
