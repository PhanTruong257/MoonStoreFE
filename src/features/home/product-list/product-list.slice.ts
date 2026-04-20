import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ProductListItem = {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  image: string;
  rating: number;
  sold: number;
};

export type ProductListCategory = {
  id: string;
  label: string;
  slug: string;
};

type ProductListRequestPayload = {
  categoryId?: string;
  page?: number;
  limit?: number;
};

type ProductListSuccessPayload = {
  items: ProductListItem[];
  categories: ProductListCategory[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductListState = {
  items: ProductListItem[];
  categories: ProductListCategory[];
  selectedCategoryId: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: ProductListState = {
  items: [],
  categories: [{ id: "all", label: "All", slug: "all" }],
  selectedCategoryId: "all",
  page: 1,
  limit: 8,
  total: 0,
  totalPages: 1,
  isLoading: false,
  error: null,
};

const productListSlice = createSlice({
  name: "productList",
  initialState,
  reducers: {
    productListRequested: (
      state,
      action: PayloadAction<ProductListRequestPayload | undefined>,
    ) => {
      if (action.payload?.categoryId !== undefined) {
        state.selectedCategoryId = action.payload.categoryId;
      }
      if (action.payload?.page !== undefined) {
        state.page = action.payload.page;
      }
      if (action.payload?.limit !== undefined) {
        state.limit = action.payload.limit;
      }
      state.isLoading = true;
      state.error = null;
    },
    productListSucceeded: (
      state,
      action: PayloadAction<ProductListSuccessPayload>,
    ) => {
      state.isLoading = false;
      state.error = null;
      state.items = action.payload.items;
      state.categories =
        action.payload.categories.length > 0
          ? action.payload.categories
          : state.categories;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.totalPages = action.payload.totalPages;
    },
    productListFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    productListSetCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategoryId = action.payload;
      state.page = 1;
    },
    productListSetPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const productListReducer = productListSlice.reducer;
export const productListActions = productListSlice.actions;
