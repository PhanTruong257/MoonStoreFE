import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { adminWithdrawalsActions } from "@/features/admin/admin-withdrawals/admin-withdrawals.slice";

export const useAdminWithdrawals = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, error, isProcessing } = useSelector(
    (state: RootState) => state.adminWithdrawals,
  );

  useEffect(() => {
    dispatch(adminWithdrawalsActions.withdrawalsRequested());
  }, [dispatch]);

  const approve = (id: number, note?: string) =>
    dispatch(adminWithdrawalsActions.withdrawalApproveRequested({ id, note }));

  const reject = (id: number, note?: string) =>
    dispatch(adminWithdrawalsActions.withdrawalRejectRequested({ id, note }));

  return { items, isLoading, error, isProcessing, approve, reject };
};
