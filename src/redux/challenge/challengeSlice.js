import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { fetchStats, submitReview } from '../study/studySlice';

const initialState = {
  challenges: [],
  isLoading: false,
  error: null,
};

const challengeSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    resetDailyChallenges: (state) => {
      // Optional: Logic to clear completion status when new day starts.
      // E.g., if we kept a lastResetAt timestamp
      state.challenges.forEach(c => {
        c.progress = 0;
        c.completed = false;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      // Sync challenges when app fetches user stats
      .addCase(fetchStats.fulfilled, (state, action) => {
        if (action.payload?.challenges) {
          state.challenges = action.payload.challenges;
        }
      })
      // Reactively update progress when study review is submitted
      .addCase(submitReview.fulfilled, (state, action) => {
        const { updatedChallenges } = action.payload;
        if (updatedChallenges && Array.isArray(updatedChallenges)) {
          updatedChallenges.forEach((update) => {
            const index = state.challenges.findIndex(c => c.id === update.id);
            if (index !== -1) {
              state.challenges[index].progress = update.progress;
              state.challenges[index].completed = update.completed;
            }
          });
        }
      });
  },
});

export default challengeSlice.reducer;
