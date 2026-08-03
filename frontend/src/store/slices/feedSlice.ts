import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/axios';

export interface IMedia {
  url: string;
  type: 'image' | 'video' | 'document';
}

export interface IComment {
  _id: string;
  user: {
    _id: string;
    username: string;
    email?: string;
    role: string;
    profileImage?: string;
  };
  text: string;
  createdAt: string;
}

export interface IPost {
  _id: string;
  profileId: {
    _id: string;
    name?: string;
    city?: string;
    position?: string;
    profileImage?: string;
    roleDescription?: string;
    userID: {
      _id: string;
      username: string;
      email?: string;
      role: 'player' | 'team' | 'staff';
    };
  };
  profileModel: 'User' | 'Team';
  content: string;
  media?: IMedia[];
  targetRole?: string;
  location?: string;
  likes: string[];
  comments: IComment[];
  createdAt: string;
  updatedAt: string;
}

interface FeedState {
  posts: IPost[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  posts: [],
  loading: false,
  error: null,
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/posts');
    return response.data.posts as IPost[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch feed');
  }
});

export const createPost = createAsyncThunk(
  'feed/createPost',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.post as IPost;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create post');
    }
  }
);

export const toggleLike = createAsyncThunk(
  'feed/toggleLike',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return { postId, likes: response.data.likes, likesCount: response.data.likesCount, liked: response.data.liked };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle like');
    }
  }
);

export const deletePost = createAsyncThunk(
  'feed/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${postId}`);
      return postId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete post');
    }
  }
);

export const addComment = createAsyncThunk(
  'feed/addComment',
  async ({ postId, text }: { postId: string; text: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/${postId}/comment`, { text });
      return { postId, post: response.data.post as IPost };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add comment');
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Feed
    builder.addCase(fetchFeed.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFeed.fulfilled, (state, action: PayloadAction<IPost[]>) => {
      state.loading = false;
      state.posts = action.payload;
    });
    builder.addCase(fetchFeed.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Post
    builder.addCase(createPost.fulfilled, (state, action: PayloadAction<IPost>) => {
      state.posts.unshift(action.payload);
    });

    // Toggle Like
    builder.addCase(toggleLike.fulfilled, (state, action) => {
      const { postId, likes } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.likes = likes;
      }
    });

    // Delete Post
    builder.addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((p) => p._id !== action.payload);
    });

    // Add Comment
    builder.addCase(addComment.fulfilled, (state, action) => {
      const { postId, post } = action.payload;
      const index = state.posts.findIndex((p) => p._id === postId);
      if (index !== -1) {
        state.posts[index] = post; // Replace with updated post that includes the new comment
      }
    });
  },
});

export default feedSlice.reducer;
