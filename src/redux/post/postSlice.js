import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '../../services/post/post.service';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ limit = 10, cursor } = {}, { rejectWithValue }) => {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      const response = await postService.getPosts(params);
      return response; // { success, data: [], nextCursor }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch posts');
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.likePost(postId);
      return { postId, ...response.data }; // { liked, likeCount }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to like post');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.unlikePost(postId);
      return { postId, ...response.data }; // { liked, likeCount }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to unlike post');
    }
  }
);

export const savePost = createAsyncThunk(
  'posts/savePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.savePost(postId);
      return { postId, ...response.data }; // { saved, saveCount, clonedFolderId }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to save post');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await postService.deletePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete post');
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    nextCursor: null,
    hasMore: true,
    loading: false,
    loadingMore: false,
    error: null,
    savingPostId: null,
  },
  reducers: {
    // Optimistic like toggle
    optimisticLike: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.isLiked = true;
        post.like_count = (post.like_count || 0) + 1;
      }
    },
    optimisticUnlike: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.isLiked = false;
        post.like_count = Math.max((post.like_count || 0) - 1, 0);
      }
    },
    resetFeed: (state) => {
      state.posts = [];
      state.nextCursor = null;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPosts (initial load)
      .addCase(fetchPosts.pending, (state, action) => {
        if (!action.meta.arg?.cursor) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        const { data, nextCursor } = action.payload;
        if (!action.meta.arg?.cursor) {
          state.posts = data;
        } else {
          state.posts = [...state.posts, ...data];
        }
        state.nextCursor = nextCursor;
        state.hasMore = !!nextCursor;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload;
      })

      // likePost — sync optimistic update already applied; reconcile on settle
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) {
          post.isLiked = action.payload.liked;
          post.like_count = action.payload.likeCount;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        // Rollback optimistic update
        const post = state.posts.find((p) => p.id === action.meta.arg);
        if (post) {
          post.isLiked = false;
          post.like_count = Math.max((post.like_count || 0) - 1, 0);
        }
      })

      // unlikePost
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) {
          post.isLiked = action.payload.liked;
          post.like_count = action.payload.likeCount;
        }
      })
      .addCase(unlikePost.rejected, (state, action) => {
        // Rollback optimistic update
        const post = state.posts.find((p) => p.id === action.meta.arg);
        if (post) {
          post.isLiked = true;
          post.like_count = (post.like_count || 0) + 1;
        }
      })

      // savePost
      .addCase(savePost.pending, (state, action) => {
        state.savingPostId = action.meta.arg;
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.savingPostId = null;
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) {
          post.isSaved = action.payload.saved;
          post.save_count = action.payload.saveCount;
        }
      })
      .addCase(savePost.rejected, (state) => {
        state.savingPostId = null;
      })

      // createPost — prepend to feed
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })

      // deletePost — remove from feed
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
      });
  },
});

export const { optimisticLike, optimisticUnlike, resetFeed } = postSlice.actions;
export default postSlice.reducer;
