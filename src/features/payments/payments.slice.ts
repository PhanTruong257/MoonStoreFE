import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { QrPaymentInfo } from "@/services/payments-service";

export type PaymentsState = {
  qrInfo: QrPaymentInfo | null;
  isQrLoading: boolean;
  isConfirming: boolean;
  error: string | null;
};

const initialState: PaymentsState = {
  qrInfo: null,
  isQrLoading: false,
  isConfirming: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    qrInfoRequested: (state, action: PayloadAction<number>) => {
      void action.payload;
      state.isQrLoading = true;
      state.qrInfo = null;
      state.error = null;
    },
    qrInfoSucceeded: (state, action: PayloadAction<QrPaymentInfo>) => {
      state.isQrLoading = false;
      state.qrInfo = action.payload;
    },
    qrInfoFailed: (state, action: PayloadAction<string>) => {
      state.isQrLoading = false;
      state.error = action.payload;
    },
    qrInfoReset: () => initialState,
    manualConfirmRequested: (
      state,
      action: PayloadAction<{ paymentId: number; orderId: number }>,
    ) => {
      void action.payload;
      state.isConfirming = true;
      state.error = null;
    },
    manualConfirmSucceeded: (state, action: PayloadAction<string>) => {
      state.isConfirming = false;
      if (state.qrInfo) {
        state.qrInfo.paymentStatus = action.payload;
      }
    },
    manualConfirmFailed: (state, action: PayloadAction<string>) => {
      state.isConfirming = false;
      state.error = action.payload;
    },
  },
});

export const paymentsReducer = paymentsSlice.reducer;
export const paymentsActions = paymentsSlice.actions;
