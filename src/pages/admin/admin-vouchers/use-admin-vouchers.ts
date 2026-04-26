import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { adminVouchersActions } from "@/features/admin/admin-vouchers/admin-vouchers.slice";
import type {
  CreateAdminVoucherPayload,
  UpdateAdminVoucherPayload,
} from "@/services/admin-service";

export const useAdminVouchers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, isSubmitting, error } = useSelector(
    (state: RootState) => state.adminVouchers,
  );

  useEffect(() => {
    dispatch(adminVouchersActions.requested());
  }, [dispatch]);

  return {
    items,
    isLoading,
    isSubmitting,
    error,
    create: (payload: CreateAdminVoucherPayload) =>
      dispatch(adminVouchersActions.createRequested(payload)),
    update: (id: number, payload: UpdateAdminVoucherPayload) =>
      dispatch(adminVouchersActions.updateRequested({ id, payload })),
    remove: (id: number) =>
      dispatch(adminVouchersActions.deleteRequested(id)),
  };
};
