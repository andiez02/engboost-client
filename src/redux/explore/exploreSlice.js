import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { exploreService } from '../../services/explore/explore.service';

export const fetchExploreFolders = createAsyncThunk(
  'explore/fetchFolders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await exploreService.getExploreFolders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch explore folders');
    }
  }
);

export const cloneExploreFolder = createAsyncThunk(
  'explore/cloneFolder',
  async (folderId, { rejectWithValue }) => {
    try {
      const response = await exploreService.cloneFolder(folderId);
      return { folderId, cloned: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to clone folder');
    }
  }
);

const exploreSlice = createSlice({
  name: 'explore',
  initialState: {
    folders: [],
    loading: false,
    error: null,
    cloningId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExploreFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExploreFolders.fulfilled, (state, action) => {
        state.loading = false;
        state.folders = action.payload;
      })
      .addCase(fetchExploreFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cloneExploreFolder.pending, (state, action) => {
        state.cloningId = action.meta.arg;
      })
      .addCase(cloneExploreFolder.fulfilled, (state) => {
        state.cloningId = null;
      })
      .addCase(cloneExploreFolder.rejected, (state) => {
        state.cloningId = null;
      });
  },
});

export default exploreSlice.reducer;
