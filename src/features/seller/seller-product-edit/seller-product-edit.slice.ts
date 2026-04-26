import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { CatalogCategory } from "@/services/catalog-service";
import type {
  CreateProductResponse,
  UpdateSellerProductPayload,
} from "@/services/seller-service";

export type SellerProductEditState = {
  detail: CreateProductResponse | null;
  categories: CatalogCategory[];
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  error: string | null;
};

const initialState: SellerProductEditState = {
  detail: null,
  categories: [],
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: null,
};

const sellerProductEditSlice = createSlice({
  name: "sellerProductEdit",
  initialState,
  reducers: {
    sellerProductEditLoadRequested: (
      state,
      action: PayloadAction<number>,
    ) => {
      void action.payload;
      state.isLoading = true;
      state.error = null;
      state.detail = null;
    },
    sellerProductEditLoadSucceeded: (
      state,
      action: PayloadAction<{
        detail: CreateProductResponse;
        categories: CatalogCategory[];
      }>,
    ) => {
      state.isLoading = false;
      state.error = null;
      state.detail = action.payload.detail;
      state.categories = action.payload.categories;
    },
    sellerProductEditLoadFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    sellerProductEditUpdateRequested: (
      state,
      action: PayloadAction<{
        productId: number;
        payload: UpdateSellerProductPayload;
      }>,
    ) => {
      void action.payload;
      state.isSubmitting = true;
    },
    sellerProductEditUpdateSucceeded: (state) => {
      state.isSubmitting = false;
    },
    sellerProductEditUpdateFailed: (state, action: PayloadAction<string>) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    sellerProductEditDeleteRequested: (
      state,
      action: PayloadAction<number>,
    ) => {
      void action.payload;
      state.isDeleting = true;
    },
    sellerProductEditDeleteSucceeded: (state) => {
      state.isDeleting = false;
    },
    sellerProductEditDeleteFailed: (state, action: PayloadAction<string>) => {
      state.isDeleting = false;
      state.error = action.payload;
    },
    sellerProductEditReset: () => initialState,
  },
});

export const sellerProductEditReducer = sellerProductEditSlice.reducer;
export const sellerProductEditActions = sellerProductEditSlice.actions;
