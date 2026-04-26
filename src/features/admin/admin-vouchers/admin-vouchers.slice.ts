import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  AdminVoucher,
  CreateAdminVoucherPayload,
  UpdateAdminVoucherPayload,
} from "@/services/admin-service";

export type AdminVouchersState = {
  items: AdminVoucher[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
};

const initialState: AdminVouchersState = {
  items: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
};

const slice = createSlice({
  name: "adminVouchers",
  initialState,
  reducers: {
    requested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    succeeded: (state, action: PayloadAction<AdminVoucher[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    failed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createRequested: (
      state,
      action: PayloadAction<CreateAdminVoucherPayload>,
    ) => {
      void action.payload;
      state.isSubmitting = true;
    },
    updateRequested: (
      state,
      action: PayloadAction<{
        id: number;
        payload: UpdateAdminVoucherPayload;
      }>,
    ) => {
      void action.payload;
      state.isSubmitting = true;
    },
    deleteRequested: (state, action: PayloadAction<number>) => {
      void action.payload;
      state.isSubmitting = true;
    },
    actionSucceeded: (state) => {
      state.isSubmitting = false;
    },
    actionFailed: (state, action: PayloadAction<string>) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },
  },
});

export const adminVouchersReducer = slice.reducer;
export const adminVouchersActions = slice.actions;
