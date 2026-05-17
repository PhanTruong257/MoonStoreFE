import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { WalletDetail } from "@/services/wallet-service";

export type SellerWalletState = {
  data: WalletDetail | null;
  isLoading: boolean;
  error: string | null;
  isWithdrawing: boolean;
  withdrawError: string | null;
};

const initialState: SellerWalletState = {
  data: null,
  isLoading: false,
  error: null,
  isWithdrawing: false,
  withdrawError: null,
};

const sellerWalletSlice = createSlice({
  name: "sellerWallet",
  initialState,
  reducers: {
    walletRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    walletSucceeded: (state, action: PayloadAction<WalletDetail>) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    walletFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    withdrawalRequested: (
      state,
      _action: PayloadAction<{
        amount: number;
        bankName: string;
        bankAccount: string;
        bankHolder: string;
      }>,
    ) => {
      state.isWithdrawing = true;
      state.withdrawError = null;
    },
    withdrawalSucceeded: (state) => {
      state.isWithdrawing = false;
    },
    withdrawalFailed: (state, action: PayloadAction<string>) => {
      state.isWithdrawing = false;
      state.withdrawError = action.payload;
    },
  },
});

export const sellerWalletReducer = sellerWalletSlice.reducer;
export const sellerWalletActions = sellerWalletSlice.actions;
