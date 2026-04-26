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
      _action: PayloadAction<CreateAdminCategoryPayload>,
    ) => {
      state.isSubmitting = true;
    },
    updateRequested: (
      state,
      _action: PayloadAction<{
        id: number;
        payload: UpdateAdminCategoryPayload;
      }>,
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

export const adminCategoriesReducer = slice.reducer;
export const adminCategoriesActions = slice.actions;
