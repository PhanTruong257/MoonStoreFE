import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  AdminCategory,
  CreateAdminCategoryPayload,
  UpdateAdminCategoryPayload,
} from "@/services/admin-service";

export type AdminCategoriesState = {
  items: AdminCategory[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
};

const initialState: AdminCategoriesState = {
  items: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
};

const slice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {
    requested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    succeeded: (state, action: PayloadAction<AdminCategory[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    failed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createRequested: (
      state,
      action: PayloadAction<CreateAdminCategoryPayload>,
    ) => {
      void action.payload;
      state.isSubmitting = true;
    },
    updateRequested: (
      state,
      action: PayloadAction<{
        id: number;
        payload: UpdateAdminCategoryPayload;
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

export const adminCategoriesReducer = slice.reducer;
export const adminCategoriesActions = slice.actions;
