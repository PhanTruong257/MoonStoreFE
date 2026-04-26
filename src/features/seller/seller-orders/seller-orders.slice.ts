import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { SellerOrderGroup } from "@/services/seller-service";

export type SellerOrdersState = {
  groups: SellerOrderGroup[];
  statusFilter: string;
  isLoading: boolean;
  error: string | null;
};

const initialState: SellerOrdersState = {
  groups: [],
  statusFilter: "ALL",
  isLoading: false,
  error: null,
};

const sellerOrdersSlice = createSlice({
  name: "sellerOrders",
  initialState,
  reducers: {
    sellerOrdersRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    sellerOrdersSucceeded: (
      state,
      action: PayloadAction<SellerOrderGroup[]>,
    ) => {
      state.isLoading = false;
      state.error = null;
      state.groups = action.payload;
    },
    sellerOrdersFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    sellerOrdersStatusFilterChanged: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.statusFilter = action.payload;
    },
  },
});

export const sellerOrdersReducer = sellerOrdersSlice.reducer;
export const sellerOrdersActions = sellerOrdersSlice.actions;
