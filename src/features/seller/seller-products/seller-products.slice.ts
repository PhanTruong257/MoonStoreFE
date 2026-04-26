import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { SellerProductListItem } from "@/services/seller-service";

export type SellerProductsState = {
  products: SellerProductListItem[];
  statusFilter: string;
  isLoading: boolean;
  isDeleting: boolean;
  error: string | null;
};

const initialState: SellerProductsState = {
  products: [],
  statusFilter: "ALL",
  isLoading: false,
  isDeleting: false,
  error: null,
};

const sellerProductsSlice = createSlice({
  name: "sellerProducts",
  initialState,
  reducers: {
    sellerProductsRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    sellerProductsSucceeded: (
      state,
      action: PayloadAction<SellerProductListItem[]>,
    ) => {
      state.isLoading = false;
      state.error = null;
      state.products = action.payload;
    },
    sellerProductsFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    sellerProductsStatusFilterChanged: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.statusFilter = action.payload;
    },
    sellerProductDeleteRequested: (state, action: PayloadAction<number>) => {
      void action.payload;
      state.isDeleting = true;
    },
    sellerProductDeleteSucceeded: (state, action: PayloadAction<number>) => {
      state.isDeleting = false;
      state.products = state.products.filter(
        (item) => item.id !== action.payload,
      );
    },
    sellerProductDeleteFailed: (state, action: PayloadAction<string>) => {
      state.isDeleting = false;
      state.error = action.payload;
    },
  },
});

export const sellerProductsReducer = sellerProductsSlice.reducer;
export const sellerProductsActions = sellerProductsSlice.actions;
