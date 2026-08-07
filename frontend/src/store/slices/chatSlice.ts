/**
 * @module ChatSlice
 *
 * Manages the state for direct messaging and conversations between users.
 * Handles fetching chat history, active conversations, and real-time message appends.
 */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/axios';

/**
 * Represents an active chat conversation with another user.
 * 
 * Includes the partner's profile information and a preview of the most
 * recently exchanged message in the conversation thread.
 */
export interface IConversation {
  userId: string;
  username?: string;
  email?: string;
  role: 'player' | 'team' | 'staff';
  displayName: string;
  subtext?: string;
  avatar: string;
  lastMessage?: {
    _id: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt: string;
  };
}

/**
 * Represents a single direct message exchanged between two users.
 */
export interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
}

interface ChatState {
  conversations: IConversation[];
  activeMessages: IMessage[];
  activePartnerId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  activeMessages: [],
  activePartnerId: null,
  loading: false,
  error: null,
};

/**
 * Fetches the list of all active conversations for the authenticated user.
 *
 * Resolves to an array of conversation summaries containing partner details
 * and the last message sent or received.
 *
 * @returns {Promise<IConversation[]>}  The user's conversation list.
 * @throws  {string}  The error message if the request fails.
 */
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chats');
      return response.data.conversations as IConversation[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

/**
 * Fetches the complete message history between the current user and a specific partner.
 *
 * This will also set the target user as the currently active chat partner in the state.
 *
 * @param  {string}  userId  The ID of the conversation partner.
 * @returns {Promise<{userId: string, messages: IMessage[]}>}  The partner ID and the message history.
 * @throws  {string}  The error message if the request fails.
 */
export const fetchMessageHistory = createAsyncThunk(
  'chat/fetchMessageHistory',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chats/${userId}`);
      return { userId, messages: response.data.messages as IMessage[] };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch message history');
    }
  }
);

/**
 * Sends a new direct message to a specific user.
 *
 * Waits for the server response before appending the finalized message 
 * to the active chat and updating the conversation list's last message.
 *
 * @param  {Object}  args  The message payload arguments.
 * @param  {string}  args.receiverId  The ID of the user receiving the message.
 * @param  {string}  args.content     The text content of the message.
 * @returns {Promise<IMessage>}  The successfully saved message from the server.
 * @throws  {string}  The error message if the request fails.
 */
export const sendDirectMessage = createAsyncThunk(
  'chat/sendDirectMessage',
  async ({ receiverId, content }: { receiverId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/chats', { receiverId, content });
      return response.data.chat as IMessage;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /**
     * Sets the currently active conversation partner.
     * 
     * If set to null, the active message history is cleared from the state.
     * 
     * @param {PayloadAction<string | null>} action  The ID of the partner, or null to close the chat.
     */
    setActivePartner: (state, action: PayloadAction<string | null>) => {
      state.activePartnerId = action.payload;
      if (!action.payload) {
        state.activeMessages = [];
      }
    },
    /**
     * Appends a newly received or sent message to the active chat view.
     * 
     * Validates that the message belongs to the currently active conversation
     * before appending it, preventing messages from other chats from bleeding in.
     * 
     * @param {PayloadAction<IMessage>} action  The message object to append.
     */
    appendNewMessage: (state, action: PayloadAction<IMessage>) => {
      // Used for real-time polling updates if we want to append manually
      const msg = action.payload;
      if (
        (msg.sender === state.activePartnerId && msg.receiver === localStorage.getItem('userId')) ||
        (msg.receiver === state.activePartnerId && msg.sender === localStorage.getItem('userId'))
      ) {
        state.activeMessages.push(msg);
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch Conversations
    builder.addCase(fetchConversations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchConversations.fulfilled, (state, action: PayloadAction<IConversation[]>) => {
      state.loading = false;
      state.conversations = action.payload;
    });
    builder.addCase(fetchConversations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Message History
    builder.addCase(fetchMessageHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMessageHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.activePartnerId = action.payload.userId;
      state.activeMessages = action.payload.messages;
    });
    builder.addCase(fetchMessageHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Send Direct Message
    builder.addCase(sendDirectMessage.fulfilled, (state, action: PayloadAction<IMessage>) => {
      state.activeMessages.push(action.payload);
      
      // Update last message in the conversations list for this user
      const partnerId = action.payload.receiver;
      const conv = state.conversations.find((c) => c.userId === partnerId);
      if (conv) {
        conv.lastMessage = {
          _id: action.payload._id,
          sender: action.payload.sender,
          receiver: action.payload.receiver,
          content: action.payload.content,
          createdAt: action.payload.createdAt,
        };
      }
    });
  },
});

export const { setActivePartner, appendNewMessage } = chatSlice.actions;
export default chatSlice.reducer;
