import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { adminRefundsActions } from "@/features/admin/admin-refunds/admin-refunds.slice";

export const useAdminRefunds = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, error, isProcessing } = useSelector(
    (state: RootState) => state.adminRefunds,
  );

  useEffect(() => {
    dispatch(adminRefundsActions.refundsRequested());
  }, [dispatch]);

  const approve = (id: number, note?: string) =>
    dispatch(adminRefundsActions.refundApproveRequested({ id, note }));

  const reject = (id: number, note?: string) =>
    dispatch(adminRefundsActions.refundRejectRequested({ id, note }));

  return { items, isLoading, error, isProcessing, approve, reject };
};
