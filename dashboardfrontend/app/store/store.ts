'use client';
import { configureStore } from '@reduxjs/toolkit';
import globalReducer from '../state/globalSlice'; // Ensure this path is correct based on your project structure

export const store = configureStore({
  reducer: {
    global: globalReducer,
    // Other reducers can be added here
  },
});

// Export types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
