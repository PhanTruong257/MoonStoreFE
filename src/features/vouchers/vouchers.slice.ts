import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { VoucherSummary } from "@/services/vouchers-service";

export type VouchersState = {
  code: string;
  voucher: VoucherSummary | null;
  discountAmount: number;
  message: string;
  isValidating: boolean;
};

const initialState: VouchersState = {
  code: "",
  voucher: null,
  discountAmount: 0,
  message: "",
  isValidating: false,
};

const vouchersSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {
    voucherCodeChanged: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    voucherValidateRequested: (
      state,
      action: PayloadAction<{ code: string; subtotal: number }>,
    ) => {
      void action.payload;
      state.isValidating = true;
      state.message = "";
    },
    voucherValidateSucceeded: (
      state,
      action: PayloadAction<{
        voucher: VoucherSummary;
        discountAmount: number;
        message: string;
      }>,
    ) => {
      state.isValidating = false;
      state.voucher = action.payload.voucher;
      state.discountAmount = action.payload.discountAmount;
      state.message = action.payload.message;
    },
    voucherValidateFailed: (state, action: PayloadAction<string>) => {
      state.isValidating = false;
      state.voucher = null;
      state.discountAmount = 0;
      state.message = action.payload;
    },
    voucherReset: () => initialState,
  },
});

export const vouchersReducer = vouchersSlice.reducer;
export const vouchersActions = vouchersSlice.actions;
