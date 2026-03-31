import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { studyService } from '../../services/study/study.service';
import { buildMixedQueue, buildPriorityQueue } from './sessionQueue';

const MAX_REINSERT = 2;

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchDueCards = createAsyncThunk(
  'study/fetchDueCards',
  async (folderId, { rejectWithValue }) => {
    try {
      const res = await studyService.getDueCards(folderId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch cards');
    }
  }
);

export const submitReview = createAsyncThunk(
  'study/submitReview',
  async ({ cardId, rating }, { dispatch, rejectWithValue }) => {
    try {
      const res = await studyService.reviewCard({ cardId, rating });
      // Advance the card after 300ms so the UI can animate the transition
      setTimeout(() => dispatch(advanceCard()), 300);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to submit review');
    }
  }
);

export const fetchStats = createAsyncThunk(
  'study/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await studyService.getStats();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch stats');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState = {
  queue: [],              // replaces cards[] — immutable after session start
  currentIndex: 0,
  isFlipped: false,
  isLoading: false,
  isSubmitting: false,
  isTransitioning: false, // true during the 300ms delay window
  error: null,
  stats: null,
  sessionDone: false,
  reviewedCount: 0,
  correctCount: 0,        // rating >= 2 (Good / Easy)
  sessionStartTime: null, // UTC ISO string, set when queue is built
  reinsertCount: {},      // { [cardId]: number } — tracks reinsertions per card per session
  nextReviewAt: null,     // ISO timestamp of next upcoming card (when queue is empty)
  
  unlockedAchievements: [], // Achievements earned during this session
  xpGained: 0,             // XP earned in this session
  leveledUp: false,        // Whether user leveled up this session
  newLevel: null,          // New level after level-up
  completedChallenges: [], // Challenges completed this session
};

const studySlice = createSlice({
  name: 'study',
  initialState,
  reducers: {
    flipCard: (state) => {
      state.isFlipped = !state.isFlipped;
    },
    resetFlip: (state) => {
      state.isFlipped = false;
    },
    /** Build the mixed queue from a raw cards array and start the session timer. */
    buildQueue: (state, action) => {
      const cards = action.payload ?? [];
      state.queue = buildMixedQueue(cards);
      state.currentIndex = 0;
      state.sessionStartTime = cards.length > 0 ? new Date().toISOString() : null;
    },
    /**
     * Advance to the next card after the 300ms transition delay.
     * Called by submitReview thunk via setTimeout.
     */
    advanceCard: (state) => {
      state.isTransitioning = false;
      const next = state.currentIndex + 1;
      if (next >= state.queue.length) {
        state.sessionDone = true;
      } else {
        state.currentIndex = next;
      }
    },
    resetSession: (state) => {
      state.queue = [];
      state.currentIndex = 0;
      state.isFlipped = false;
      state.isTransitioning = false;
      state.sessionDone = false;
      state.error = null;
      state.reviewedCount = 0;
      state.correctCount = 0;
      state.sessionStartTime = null;
      state.reinsertCount = {};
      state.nextReviewAt = null;
      state.unlockedAchievements = [];
      state.xpGained = 0;
      state.leveledUp = false;
      state.newLevel = null;
      state.completedChallenges = [];
    },
    /**
     * Reinsert a failed card back into the queue 2–4 positions ahead.
     * Guards: max 2 reinsertions per card, no duplicate if already in tail.
     */
    reinsertCard: (state, action) => {
      const { cardId, card } = action.payload;

      // Guard 1: max reinsertion limit
      if ((state.reinsertCount[cardId] ?? 0) >= MAX_REINSERT) return;

      // Guard 2: card already exists later in the queue
      const tail = state.queue.slice(state.currentIndex + 1);
      if (tail.some((c) => c.id === cardId)) return;

      // Random offset in [2, 4]
      const offset = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
      const insertAt = Math.min(state.currentIndex + offset, state.queue.length);

      state.queue.splice(insertAt, 0, card);
      state.reinsertCount[cardId] = (state.reinsertCount[cardId] ?? 0) + 1;
    },
    /**
     * Clear a specific achievement from the queue after it has been displayed.
     */
    clearUnlockedAchievement: (state, action) => {
      const achievementId = action.payload;
      state.unlockedAchievements = state.unlockedAchievements.filter(
        (ach) => ach.id !== achievementId
      );
    },
    clearLevelUp: (state) => {
      state.leveledUp = false;
      state.newLevel = null;
    },
    clearCompletedChallenge: (state, action) => {
      const challengeId = action.payload;
      state.completedChallenges = state.completedChallenges.filter(
        (c) => c.id !== challengeId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDueCards
      .addCase(fetchDueCards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.sessionDone = false;
      })
      .addCase(fetchDueCards.fulfilled, (state, action) => {
        state.isLoading = false;
        const { learning, overdue, due, newCards, stats, nextReviewAt } = action.payload;
        const queue = buildPriorityQueue({ learning, overdue, due, newCards });
        state.queue = queue;
        state.stats = stats;
        state.nextReviewAt = nextReviewAt;
        state.currentIndex = 0;
        state.isFlipped = false;
        state.sessionDone = queue.length === 0;
        state.sessionStartTime = queue.length > 0 ? new Date().toISOString() : null;
      })
      .addCase(fetchDueCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // submitReview
      .addCase(submitReview.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isFlipped = false;
        state.isTransitioning = true; // advanceCard() will clear this after 300ms
        state.reviewedCount += 1;
        if (action.meta.arg.rating >= 2) state.correctCount += 1;
        
        // Handle achievements
        if (action.payload.unlockedAchievements?.length > 0) {
          state.unlockedAchievements.push(...action.payload.unlockedAchievements);
        }
        
        // Handle XP & Level
        if (action.payload.xpGained) {
          state.xpGained += action.payload.xpGained;
        }
        if (action.payload.leveledUp) {
          state.leveledUp = true;
          state.newLevel = action.payload.newLevel;
        }
        
        // Handle completed challenges
        if (action.payload.completedChallenges?.length > 0) {
          state.completedChallenges.push(...action.payload.completedChallenges);
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.isTransitioning = false;
        state.error = action.payload;
      })
      // fetchStats
      .addCase(fetchStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.nextReviewAt = action.payload.nextReviewAt ?? state.nextReviewAt;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { flipCard, resetFlip, resetSession, buildQueue, advanceCard, reinsertCard, clearUnlockedAchievement, clearLevelUp, clearCompletedChallenge } = studySlice.actions;

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectCurrentCard = (state) =>
  state.study.queue[state.study.currentIndex] ?? null;

export const selectStudyProgress = createSelector(
  (state) => state.study.currentIndex,
  (state) => state.study.queue.length,
  (currentIndex, total) => ({
    current: currentIndex + 1,
    total,
    remaining: total - currentIndex,
    progress: total > 0 ? currentIndex / total : 0,
  })
);

export const selectSessionStartTime = (state) => state.study.sessionStartTime;
export const selectIsTransitioning = (state) => state.study.isTransitioning;

export default studySlice.reducer;
