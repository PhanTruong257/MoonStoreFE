import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { AdminSellerStatusFilter as SellerStatusFilter } from "@/const/admin.const";
import { SELLER_APPLICATION_STATUS } from "@/const/seller-status.const";
import type { AdminSeller } from "@/services/admin-service";

export type { SellerStatusFilter };

export type AdminSellersState = {
  sellers: AdminSeller[];
  statusFilter: SellerStatusFilter;
  isLoading: boolean;
  isActing: boolean;
  actingId: number | null;
  error: string | null;
};

const initialState: AdminSellersState = {
  sellers: [],
  statusFilter: SELLER_APPLICATION_STATUS.PENDING,
  isLoading: false,
  isActing: false,
  actingId: null,
  error: null,
};

const slice = createSlice({
  name: "adminSellers",
  initialState,
  reducers: {
    requested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    succeeded: (state, action: PayloadAction<AdminSeller[]>) => {
      state.isLoading = false;
      state.sellers = action.payload;
    },
    failed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    statusFilterChanged: (
      state,
      action: PayloadAction<SellerStatusFilter>,
    ) => {
      state.statusFilter = action.payload;
    },
    approveRequested: (state, action: PayloadAction<number>) => {
      state.isActing = true;
      state.actingId = action.payload;
    },
    rejectRequested: (
      state,
      action: PayloadAction<{ sellerId: number; reason?: string }>,
    ) => {
      state.isActing = true;
      state.actingId = action.payload.sellerId;
    },
    disableRequested: (state, action: PayloadAction<number>) => {
      state.isActing = true;
      state.actingId = action.payload;
    },
    enableRequested: (state, action: PayloadAction<number>) => {
      state.isActing = true;
      state.actingId = action.payload;
    },
    actionSucceeded: (state) => {
      state.isActing = false;
      state.actingId = null;
    },
    actionFailed: (state, action: PayloadAction<string>) => {
      state.isActing = false;
      state.actingId = null;
      state.error = action.payload;
    },
  },
});

export const adminSellersReducer = slice.reducer;
export const adminSellersActions = slice.actions;
