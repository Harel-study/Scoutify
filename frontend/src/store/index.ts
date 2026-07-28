import { configureStore } from '@reduxjs/toolkit';
import feedReducer from './slices/feedSlice';
import jobReducer from './slices/jobSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    jobs: jobReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
