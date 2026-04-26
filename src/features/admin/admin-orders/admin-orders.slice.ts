import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  AdminOrderDetail,
  AdminOrderListFilters,
  AdminOrderListItem,
} from "@/services/admin-service";

export type AdminOrdersState = {
  list: AdminOrderListItem[];
  filters: AdminOrderListFilters;
  detail: AdminOrderDetail | null;
  isListLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
};

const initialState: AdminOrdersState = {
  list: [],
  filters: {},
  detail: null,
  isListLoading: false,
  isDetailLoading: false,
  error: null,
};

const slice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    listRequested: (
      state,
      action: PayloadAction<AdminOrderListFilters | undefined>,
    ) => {
      state.filters = action.payload ?? {};
      state.isListLoading = true;
      state.error = null;
    },
    listSucceeded: (state, action: PayloadAction<AdminOrderListItem[]>) => {
      state.isListLoading = false;
      state.list = action.payload;
    },
    listFailed: (state, action: PayloadAction<string>) => {
      state.isListLoading = false;
      state.error = action.payload;
    },
    detailRequested: (state, action: PayloadAction<number>) => {
      void action.payload;
      state.isDetailLoading = true;
      state.detail = null;
      state.error = null;
    },
    detailSucceeded: (state, action: PayloadAction<AdminOrderDetail>) => {
      state.isDetailLoading = false;
      state.detail = action.payload;
    },
    detailFailed: (state, action: PayloadAction<string>) => {
      state.isDetailLoading = false;
      state.error = action.payload;
    },
    detailReset: (state) => {
      state.detail = null;
      state.isDetailLoading = false;
      state.error = null;
    },
  },
});

export const adminOrdersReducer = slice.reducer;
export const adminOrdersActions = slice.actions;
