import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { AdminBrand } from "@/services/admin-service";

export type AdminBrandsState = {
  items: AdminBrand[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
};

const initialState: AdminBrandsState = {
  items: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
};

const slice = createSlice({
  name: "adminBrands",
  initialState,
  reducers: {
    requested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    succeeded: (state, action: PayloadAction<AdminBrand[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    failed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createRequested: (state, _action: PayloadAction<{ name: string }>) => {
      state.isSubmitting = true;
    },
    updateRequested: (
      state,
      _action: PayloadAction<{ id: number; name: string }>,
    ) => {
      state.isSubmitting = true;
    },
    deleteRequested: (state, _action: PayloadAction<number>) => {
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

export const adminBrandsReducer = slice.reducer;
export const adminBrandsActions = slice.actions;
