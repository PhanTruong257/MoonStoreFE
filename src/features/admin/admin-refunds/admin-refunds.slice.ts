import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { AdminRefundRequest } from "@/services/admin-service";

export type AdminRefundsState = {
  items: AdminRefundRequest[];
  isLoading: boolean;
  error: string | null;
  isProcessing: boolean;
};

const initialState: AdminRefundsState = {
  items: [],
  isLoading: false,
  error: null,
  isProcessing: false,
};

const adminRefundsSlice = createSlice({
  name: "adminRefunds",
  initialState,
  reducers: {
    refundsRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    refundsSucceeded: (state, action: PayloadAction<AdminRefundRequest[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    refundsFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    refundApproveRequested: (
      state,
      _action: PayloadAction<{ id: number; note?: string }>,
    ) => {
      state.isProcessing = true;
    },
    refundRejectRequested: (
      state,
      _action: PayloadAction<{ id: number; note?: string }>,
    ) => {
      state.isProcessing = true;
    },
    refundProcessSucceeded: (state, action: PayloadAction<{ id: number; status: string }>) => {
      state.isProcessing = false;
      const idx = state.items.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx].status = action.payload.status;
      }
    },
    refundProcessFailed: (state) => {
      state.isProcessing = false;
    },
  },
});

export const adminRefundsReducer = adminRefundsSlice.reducer;
export const adminRefundsActions = adminRefundsSlice.actions;
