import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { AdminWithdrawal } from "@/services/admin-service";

export type AdminWithdrawalsState = {
  items: AdminWithdrawal[];
  isLoading: boolean;
  error: string | null;
  isProcessing: boolean;
};

const initialState: AdminWithdrawalsState = {
  items: [],
  isLoading: false,
  error: null,
  isProcessing: false,
};

const adminWithdrawalsSlice = createSlice({
  name: "adminWithdrawals",
  initialState,
  reducers: {
    withdrawalsRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    withdrawalsSucceeded: (state, action: PayloadAction<AdminWithdrawal[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    withdrawalsFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    withdrawalApproveRequested: (
      state,
      _action: PayloadAction<{ id: number; note?: string }>,
    ) => {
      state.isProcessing = true;
    },
    withdrawalRejectRequested: (
      state,
      _action: PayloadAction<{ id: number; note?: string }>,
    ) => {
      state.isProcessing = true;
    },
    withdrawalProcessSucceeded: (state, action: PayloadAction<{ id: number; status: string }>) => {
      state.isProcessing = false;
      const idx = state.items.findIndex((w) => w.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx].status = action.payload.status;
      }
    },
    withdrawalProcessFailed: (state) => {
      state.isProcessing = false;
    },
  },
});

export const adminWithdrawalsReducer = adminWithdrawalsSlice.reducer;
export const adminWithdrawalsActions = adminWithdrawalsSlice.actions;
