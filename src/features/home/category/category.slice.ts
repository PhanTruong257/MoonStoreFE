import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { homeCategories } from "@/pages/home/mock-data";

export type CategoryItem = {
  id: string;
  label: string;
};

type HomeCategoryState = {
  items: CategoryItem[];
  start: number;
  activeCategoryId: string;
  isLoading: boolean;
  error: string | null;
};

const initialState: HomeCategoryState = {
  items: homeCategories,
  start: 0,
  activeCategoryId: "all",
  isLoading: false,
  error: null,
};

const homeCategorySlice = createSlice({
  name: "homeCategory",
  initialState,
  reducers: {
    categoryInitRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    categoryInitSucceeded: (state, action: PayloadAction<CategoryItem[]>) => {
      state.isLoading = false;
      state.error = null;
      state.items = action.payload.length > 0 ? action.payload : state.items;
      if (!state.items.some((item) => item.id === state.activeCategoryId)) {
        state.activeCategoryId = "all";
      }
      state.start = 0;
    },
    categoryInitFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    categorySetActive: (state, action: PayloadAction<string>) => {
      state.activeCategoryId = action.payload;
    },
    categoryNext: (state) => {
      if (state.items.length === 0) {
        return;
      }
      state.start = (state.start + 1) % state.items.length;
    },
    categoryPrevious: (state) => {
      if (state.items.length === 0) {
        return;
      }
      state.start =
        state.start === 0 ? state.items.length - 1 : state.start - 1;
    },
  },
});

export const homeCategoryReducer = homeCategorySlice.reducer;
export const homeCategoryActions = homeCategorySlice.actions;
