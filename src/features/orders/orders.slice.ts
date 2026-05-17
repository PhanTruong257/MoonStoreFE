import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { OrderSummary } from "@/services/orders-service";

export type OrdersState = {
  list: OrderSummary[];
  detail: OrderSummary | null;
  isListLoading: boolean;
  isDetailLoading: boolean;
  isCancelling: boolean;
  isRefundRequesting: boolean;
  refundError: string | null;
  error: string | null;
};

const initialState: OrdersState = {
  list: [],
  detail: null,
  isListLoading: false,
  isDetailLoading: false,
  isCancelling: false,
  isRefundRequesting: false,
  refundError: null,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    ordersListRequested: (state) => {
      state.isListLoading = true;
      state.error = null;
    },
    ordersListSucceeded: (state, action: PayloadAction<OrderSummary[]>) => {
      state.isListLoading = false;
      state.list = action.payload;
    },
    ordersListFailed: (state, action: PayloadAction<string>) => {
      state.isListLoading = false;
      state.error = action.payload;
    },
    orderDetailRequested: (state, action: PayloadAction<number>) => {
      void action.payload;
      state.isDetailLoading = true;
      state.detail = null;
      state.error = null;
    },
    orderDetailSucceeded: (state, action: PayloadAction<OrderSummary>) => {
      state.isDetailLoading = false;
      state.detail = action.payload;
    },
    orderDetailFailed: (state, action: PayloadAction<string>) => {
      state.isDetailLoading = false;
      state.error = action.payload;
    },
    orderGroupCancelRequested: (
      state,
      action: PayloadAction<{ orderId: number; groupId: number }>,
    ) => {
      void action.payload;
      state.isCancelling = true;
      state.error = null;
    },
    orderGroupCancelSucceeded: (state) => {
      state.isCancelling = false;
    },
    orderGroupCancelFailed: (state, action: PayloadAction<string>) => {
      state.isCancelling = false;
      state.error = action.payload;
    },
    refundRequestRequested: (
      state,
      _action: PayloadAction<{ orderId: number; reason: string; amount: number }>,
    ) => {
      state.isRefundRequesting = true;
      state.refundError = null;
    },
    refundRequestSucceeded: (state) => {
      state.isRefundRequesting = false;
    },
    refundRequestFailed: (state, action: PayloadAction<string>) => {
      state.isRefundRequesting = false;
      state.refundError = action.payload;
    },
    orderDetailReset: () => initialState,
  },
});

export const ordersReducer = ordersSlice.reducer;
export const ordersActions = ordersSlice.actions;
