# Phase 1.5: Visual Changes Guide

## 🎴 Flashcard Front (BEFORE vs AFTER)

### BEFORE (Phase 1)
```
┌─────────────────────────────────────┐
│         [Image of a trip]           │
│                                     │
│           ENGLISH                   │
│            trip                     │
│           (noun)                    │
│                                     │
│  "We're planning a short trip      │ ← ⚠️ LEAKS ANSWER
│   to the beach next month."        │
│                                     │
│        👆 Tap to reveal             │
└─────────────────────────────────────┘
```

### AFTER (Phase 1.5)
```
┌─────────────────────────────────────┐
│         [Image of a trip]           │
│                                     │
│           ENGLISH                   │
│            trip                     │
│           (noun)                    │
│                                     │
│  "We're planning a short ____      │ ← ✅ MASKED
│   to the beach next month."        │
│                                     │
│        👆 Tap to reveal             │
└─────────────────────────────────────┘
```

---

## 🎴 Flashcard Back (BEFORE vs AFTER)

### BEFORE (Phase 1)
```
┌─────────────────────────────────────┐
│          MEANING                    │
│                                     │
│         chuyến đi                   │
│                                     │
│  a journey to a place and back...  │
│                                     │
│  ─────────────                      │
│                                     │
│  "We're planning a short trip      │
│   to the beach next month."        │
│                                     │
│   Rate your recall below            │
└─────────────────────────────────────┘
```

### AFTER (Phase 1.5)
```
┌─────────────────────────────────────┐
│  ⚡ 2.3s                    ← NEW   │
│          MEANING                    │
│                                     │
│         chuyến đi                   │
│                                     │
│  a journey to a place and back...  │
│                                     │
│  ─────────────                      │
│                                     │
│  "We're planning a short trip      │ ← ENHANCED
│   to the beach next month."        │   (white, bold, underline)
│                                     │
│   Rate your recall below            │
└─────────────────────────────────────┘
```

---

## 🎮 Rating Feedback Animations

### Again (0) — Shake + Red Flash
```
[Card] → [Shake left] → [Shake right] → [Red flash] → [Normal]
Duration: 250ms
```

### Hard (1) — Orange Pulse
```
[Card] → [Scale 1.02] → [Orange tint] → [Normal]
Duration: 200ms
```

### Good (2) — Green Flash
```
[Card] → [Green flash] → [Normal]
Duration: 200ms
```

### Easy (3) — Blue Glow + Scale
```
[Card] → [Scale 1.03] → [Blue glow] → [Normal]
Duration: 250ms
```

---

## ⚡ Response Time Badge

### Fast (< 1.5s)
```
┌──────────┐
│ ⚡ 1.2s  │ ← Green tint
└──────────┘
```

### Good (1.5–4s)
```
┌──────────┐
│ 👍 2.8s  │ ← Gray
└──────────┘
```

### Slow (> 4s)
```
┌──────────┐
│ 🐢 5.1s  │ ← Light gray
└──────────┘
```

---

## 🎯 Highlighting Comparison

### FRONT (Masked)
```
"I used a ____ to find the museum."
         ^^^^
       (masked)
```

### BACK (Enhanced)
```
"I used a map to find the museum."
          ^^^
    (white, bold, underline)
```

---

## ⌨️ Keyboard Shortcuts (Visual Indicator)

### Bottom of Study Page
```
Click the card or press [Space] to flip
                         ^^^^^^^
                      (kbd styling)
```

### Rating Buttons
```
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│   ❌    │  │   😬    │  │   🙂    │  │   😎    │
│  Again  │  │  Hard   │  │  Good   │  │  Easy   │
│   [1]   │  │   [2]   │  │   [3]   │  │   [4]   │
└─────────┘  └─────────┘  └─────────┘  └─────────┘
```

---

## 🚀 Preload Behavior

### Without Preload (BEFORE)
```
Card 1 → [Transition] → Card 2 [Loading...] → [Image appears]
                                 ^^^^^^^^^^^
                              (visible flicker)
```

### With Preload (AFTER)
```
Card 1 → [Preload Card 2 image] → [Transition] → Card 2 [Instant]
         ^^^^^^^^^^^^^^^^^^^^^^                          ^^^^^^^^
         (background, invisible)                      (no flicker)
```

---

## 🎨 Color Palette

### Response Time
- Fast: `#16A34A` (green-600)
- Good: `#6B7280` (gray-500)
- Slow: `#9CA3AF` (gray-400)

### Rating Animations
- Again: `#FEE2E2` (red-100)
- Hard: `#FEF3C7` (yellow-100)
- Good: `#D1FAE5` (green-100)
- Easy: `#DBEAFE` (blue-100)

### Highlighting
- Front: `#4F46E5` (indigo-600) — default
- Back: `#FFFFFF` (white) — enhanced

---

## 📐 Layout Stability

### Key Principle: No Layout Shift

All animations use:
- `transform` (GPU-accelerated)
- `opacity` (GPU-accelerated)
- `backgroundColor` (smooth transition)

**Never use:**
- `width` / `height` changes
- `margin` / `padding` changes
- `display` changes

This ensures:
- No content jump
- Smooth 60fps animations
- No reflow/repaint

---

## 🧪 Animation Timing

```
Flip: 280ms
Rating feedback: 200–250ms
Transition: 200ms
Preload: Instant (background)
Response time badge: 200ms fade-in
```

**Total perceived latency:** < 300ms (feels instant)

---

**Phase 1.5 Visual Guide Complete** ✅
