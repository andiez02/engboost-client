import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/user/user.service';

/**
 * Thunk to fetch achievements from the backend for the current user.
 */
export const fetchAchievements = createAsyncThunk(
  'achievement/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAchievements();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  achievements: [],
  isLoading: false,
  error: null,
};

const achievementSlice = createSlice({
  name: 'achievement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        // Safely extract from data or metadata, falling back to an array
        const payloadData = action.payload;
        if (Array.isArray(payloadData)) {
          state.achievements = payloadData;
        } else if (payloadData && Array.isArray(payloadData.data)) {
          state.achievements = payloadData.data;
        } else if (payloadData && Array.isArray(payloadData.metadata)) {
          state.achievements = payloadData.metadata;
        } else {
          state.achievements = [];
        }
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default achievementSlice.reducer;
