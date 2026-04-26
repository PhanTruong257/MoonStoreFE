import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { AdminStats } from "@/services/admin-service";

export type AdminDashboardState = {
  stats: AdminStats | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AdminDashboardState = {
  stats: null,
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    requested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    succeeded: (state, action: PayloadAction<AdminStats>) => {
      state.isLoading = false;
      state.stats = action.payload;
    },
    failed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const adminDashboardReducer = slice.reducer;
export const adminDashboardActions = slice.actions;
