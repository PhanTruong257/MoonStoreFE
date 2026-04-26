import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { SellerOrderDetail } from "@/services/seller-service";

export type SellerOrderDetailState = {
  group: SellerOrderDetail | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
};

const initialState: SellerOrderDetailState = {
  group: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

const sellerOrderDetailSlice = createSlice({
  name: "sellerOrderDetail",
  initialState,
  reducers: {
    sellerOrderDetailRequested: (state, action: PayloadAction<number>) => {
      void action.payload;
      state.isLoading = true;
      state.error = null;
      state.group = null;
    },
    sellerOrderDetailSucceeded: (
      state,
      action: PayloadAction<SellerOrderDetail>,
    ) => {
      state.isLoading = false;
      state.error = null;
      state.group = action.payload;
    },
    sellerOrderDetailFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    sellerOrderStatusUpdateRequested: (
      state,
      action: PayloadAction<{
        groupId: number;
        status: string;
        note?: string;
      }>,
    ) => {
      void action.payload;
      state.isSubmitting = true;
    },
    sellerOrderStatusUpdateSucceeded: (state) => {
      state.isSubmitting = false;
    },
    sellerOrderStatusUpdateFailed: (state, action: PayloadAction<string>) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },
  },
});

export const sellerOrderDetailReducer = sellerOrderDetailSlice.reducer;
export const sellerOrderDetailActions = sellerOrderDetailSlice.actions;
