import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { AdminRevenueReport } from "@/services/admin-service";

export type AdminRevenueState = {
  data: AdminRevenueReport | null;
  isLoading: boolean;
  error: string | null;
  commissionRate: number | null;
  isUpdatingRate: boolean;
};

const initialState: AdminRevenueState = {
  data: null,
  isLoading: false,
  error: null,
  commissionRate: null,
  isUpdatingRate: false,
};

const adminRevenueSlice = createSlice({
  name: "adminRevenue",
  initialState,
  reducers: {
    revenueRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    revenueSucceeded: (
      state,
      action: PayloadAction<{ report: AdminRevenueReport; commissionRate: number }>,
    ) => {
      state.isLoading = false;
      state.data = action.payload.report;
      state.commissionRate = action.payload.commissionRate;
    },
    revenueFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    commissionRateUpdateRequested: (state, _action: PayloadAction<number>) => {
      state.isUpdatingRate = true;
    },
    commissionRateUpdateSucceeded: (state, action: PayloadAction<number>) => {
      state.isUpdatingRate = false;
      state.commissionRate = action.payload;
    },
    commissionRateUpdateFailed: (state) => {
      state.isUpdatingRate = false;
    },
  },
});

export const adminRevenueReducer = adminRevenueSlice.reducer;
export const adminRevenueActions = adminRevenueSlice.actions;
