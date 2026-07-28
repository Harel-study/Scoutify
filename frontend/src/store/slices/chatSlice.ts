import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/axios';

export interface IConversation {
  userId: string;
  username?: string;
  email?: string;
  role: 'player' | 'team' | 'staff';
  displayName: string;
  avatar: string;
  lastMessage?: {
    _id: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt: string;
  };
}

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
    setActivePartner: (state, action: PayloadAction<string | null>) => {
      state.activePartnerId = action.payload;
      if (!action.payload) {
        state.activeMessages = [];
      }
    },
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
