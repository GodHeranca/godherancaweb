import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../state'; // Adjust the path as needed
import authReducer from '../state/authSlice'; // Import the authReducer
import { api } from '../state/api'; // Import your RTK Query API

export const store = configureStore({
  reducer: {
    global: rootReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer, // Add the API reducer
    // Other reducers can be added here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // Add the API middleware
});

// Export types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
