import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { SellerStats } from "@/services/seller-service";

const INITIAL_STATS: SellerStats = {
  totalProducts: 0,
  activeProducts: 0,
  totalOrders: 0,
  pendingOrders: 0,
  deliveredOrders: 0,
  revenue: 0,
};

export type SellerDashboardState = {
  stats: SellerStats;
  isLoading: boolean;
  error: string | null;
};

const initialState: SellerDashboardState = {
  stats: INITIAL_STATS,
  isLoading: false,
  error: null,
};

const sellerDashboardSlice = createSlice({
  name: "sellerDashboard",
  initialState,
  reducers: {
    sellerDashboardRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    sellerDashboardSucceeded: (state, action: PayloadAction<SellerStats>) => {
      state.isLoading = false;
      state.error = null;
      state.stats = action.payload;
    },
    sellerDashboardFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const sellerDashboardReducer = sellerDashboardSlice.reducer;
export const sellerDashboardActions = sellerDashboardSlice.actions;
