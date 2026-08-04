/**
 * @module Store
 *
 * Configures and exports the central Redux store for the application.
 * Combines reducers for the feed, jobs, and chat domains to manage global state.
 */
import { configureStore } from '@reduxjs/toolkit';
import feedReducer from './slices/feedSlice';
import jobReducer from './slices/jobSlice';
import chatReducer from './slices/chatSlice';

/**
 * The central Redux store instance for the application.
 * 
 * Aggregates state from all application slices and provides the 
 * dispatch method for triggering state updates.
 */
export const store = configureStore({
  reducer: {
    feed: feedReducer,
    jobs: jobReducer,
    chat: chatReducer,
  },
});

/**
 * Type representing the complete state tree of the Redux store.
 * Use this to strongly type the `useSelector` hook.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type representing the store's dispatch function.
 * Use this to strongly type the `useDispatch` hook.
 */
export type AppDispatch = typeof store.dispatch;
