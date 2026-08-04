/**
 * @module FeedSlice
 *
 * Manages the global state for the activity feed, including posts,
 * media, comments, and likes. Handlers interface with the posts API.
 */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/axios';

/**
 * Represents a single piece of media attached to a post.
 */
export interface IMedia {
  url: string;
  type: 'image' | 'video' | 'document';
}

/**
 * Represents a user comment on a feed post.
 * 
 * Includes nested user details to display the commenter's profile
 * information inline without fetching additional data.
 */
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

/**
 * Represents a post in the activity feed.
 * 
 * Posts can be created by Users or Teams and can contain media, 
 * comments, and likes. Includes the nested profile details of the creator.
 */
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

/**
 * Fetches the global activity feed.
 *
 * Resolves to an array of posts populated with their creators' profiles,
 * comments, and like counts.
 *
 * @returns {Promise<IPost[]>}  The array of feed posts.
 * @throws  {string}  The error message if the fetch request fails.
 */
export const fetchFeed = createAsyncThunk('feed/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/posts');
    return response.data.posts as IPost[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch feed');
  }
});

/**
 * Submits a new post to the feed.
 *
 * Handles `multipart/form-data` payloads to support media uploads alongside text.
 * The new post is appended directly to the top of the feed state upon success.
 *
 * @param  {FormData}  formData  The form data containing text content and optional files.
 * @returns {Promise<IPost>}  The successfully created post object.
 * @throws  {string}  The error message if post creation fails.
 */
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

/**
 * Toggles the current user's like status on a specific post.
 *
 * Updates the post's like array locally in state based on the server response.
 *
 * @param  {string}  postId  The ID of the post to like or unlike.
 * @returns {Promise<{postId: string, likes: string[], likesCount: number, liked: boolean}>} The updated like status and count.
 * @throws  {string}  The error message if the request fails.
 */
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

/**
 * Permanently deletes a post by ID.
 *
 * Removes the post from the local feed state upon successful deletion on the server.
 *
 * @param  {string}  postId  The ID of the post to delete.
 * @returns {Promise<string>}  The ID of the successfully deleted post.
 * @throws  {string}  The error message if the deletion request fails.
 */
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

/**
 * Appends a new comment to a post.
 *
 * Returns the fully updated post from the server, which includes the populated
 * user details for the new comment, and replaces the local comments array.
 *
 * @param  {Object}  args  The comment payload arguments.
 * @param  {string}  args.postId  The ID of the post being commented on.
 * @param  {string}  args.text    The text content of the comment.
 * @returns {Promise<{postId: string, post: IPost}>}  The post ID and the updated post object.
 * @throws  {string}  The error message if the comment request fails.
 */
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
        state.posts[index].comments = post.comments; // Only update the comments array
      }
    });
  },
});

export default feedSlice.reducer;
