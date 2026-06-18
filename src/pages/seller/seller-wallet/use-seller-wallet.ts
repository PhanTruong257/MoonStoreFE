import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { FormInstance } from "antd";

import type { AppDispatch, RootState } from "@/app/app-store";
import { sellerWalletActions } from "@/features/seller/seller-wallet/seller-wallet.slice";

export const useSellerWallet = (form?: FormInstance) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, error, isWithdrawing, withdrawError } = useSelector(
    (state: RootState) => state.sellerWallet,
  );

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  useEffect(() => {
    dispatch(sellerWalletActions.walletRequested());
  }, [dispatch]);

  // Close the modal only when an in-flight withdrawal just finished successfully —
  // not the moment it opens (isWithdrawing is also false then, which used to close it instantly).
  const wasWithdrawingRef = useRef(false);
  useEffect(() => {
    if (wasWithdrawingRef.current && !isWithdrawing && !withdrawError) {
      setWithdrawModalOpen(false);
      form?.resetFields();
    }
    wasWithdrawingRef.current = isWithdrawing;
  }, [isWithdrawing, withdrawError, form]);

  const openWithdrawModal = () => setWithdrawModalOpen(true);
  const closeWithdrawModal = () => {
    setWithdrawModalOpen(false);
    form?.resetFields();
  };

  const submitWithdrawal = (values: {
    amount: number;
    bankName: string;
    bankAccount: string;
    bankHolder: string;
  }) => {
    dispatch(sellerWalletActions.withdrawalRequested(values));
  };

  return {
    wallet: data?.wallet ?? null,
    transactions: data?.transactions ?? [],
    withdrawals: data?.withdrawals ?? [],
    isLoading,
    error,
    isWithdrawing,
    withdrawError,
    withdrawModalOpen,
    openWithdrawModal,
    closeWithdrawModal,
    submitWithdrawal,
  };
};
