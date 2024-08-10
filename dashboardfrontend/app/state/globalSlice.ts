'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalState {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
}

const initialState: GlobalState = {
  isSidebarCollapsed: false,
  isDarkMode: false,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

// Export actions for dispatching in components
export const { setIsSidebarCollapsed, setIsDarkMode } = globalSlice.actions;

// Export the reducer for the store
export default globalSlice.reducer;
