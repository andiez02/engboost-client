import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizedAxiosInstance from '../../utils/authorizedAxios';
import { API_ROOT } from '../../utils/constants';

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/leaderboard/weekly`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch leaderboard');
    }
  }
);

export const fetchLevelLeaderboard = createAsyncThunk(
  'leaderboard/fetchLevelLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/leaderboard/level`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch level leaderboard');
    }
  }
);

export const fetchStreakLeaderboard = createAsyncThunk(
  'leaderboard/fetchStreakLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/leaderboard/streak`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch streak leaderboard');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState = {
  top50: [],
  neighbors: null,
  currentUser: null,
  weekStartedAt: null,
  isLoading: false,
  error: null,
  levelTop50: [],
  levelNeighbors: null,
  levelCurrentUser: null,
  isLoadingLevel: false,
  errorLevel: null,
  streakTop50: [],
  streakNeighbors: null,
  streakCurrentUser: null,
  isLoadingStreak: false,
  errorStreak: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload.data ?? action.payload;
        state.top50 = data.top50 ?? [];
        state.neighbors = data.neighbors ?? null;
        state.currentUser = data.currentUser ?? null;
        state.weekStartedAt = data.weekStartedAt ?? null;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchLevelLeaderboard.pending, (state) => {
        state.isLoadingLevel = true;
        state.errorLevel = null;
      })
      .addCase(fetchLevelLeaderboard.fulfilled, (state, action) => {
        state.isLoadingLevel = false;
        const data = action.payload.data ?? action.payload;
        state.levelTop50 = data.top50 ?? [];
        state.levelNeighbors = data.neighbors ?? null;
        state.levelCurrentUser = data.currentUser ?? null;
      })
      .addCase(fetchLevelLeaderboard.rejected, (state, action) => {
        state.isLoadingLevel = false;
        state.errorLevel = action.payload;
      })
      .addCase(fetchStreakLeaderboard.pending, (state) => {
        state.isLoadingStreak = true;
        state.errorStreak = null;
      })
      .addCase(fetchStreakLeaderboard.fulfilled, (state, action) => {
        state.isLoadingStreak = false;
        const data = action.payload.data ?? action.payload;
        state.streakTop50 = data.top50 ?? [];
        state.streakNeighbors = data.neighbors ?? null;
        state.streakCurrentUser = data.currentUser ?? null;
      })
      .addCase(fetchStreakLeaderboard.rejected, (state, action) => {
        state.isLoadingStreak = false;
        state.errorStreak = action.payload;
      });
  },
});

export default leaderboardSlice.reducer;
