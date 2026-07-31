import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Placeholder reducer to prevent Redux initialization warnings
    _init: (state = {}) => state,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
