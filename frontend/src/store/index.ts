import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import scoreReducer from './slices/scoreSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    score: scoreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
