import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import {
  ADMIN_SELLER_STATUS_OPTIONS,
  type AdminSellerStatusFilter,
} from "@/const/admin.const";
import { adminSellersActions } from "@/features/admin/admin-sellers/admin-sellers.slice";

export { ADMIN_SELLER_STATUS_OPTIONS };
export type { AdminSellerStatusFilter };

export const useAdminSellers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sellers, statusFilter, isLoading, isActing, actingId, error } =
    useSelector((state: RootState) => state.adminSellers);

  useEffect(() => {
    dispatch(adminSellersActions.requested());
  }, [dispatch]);

  return {
    sellers,
    statusFilter,
    isLoading,
    actingId: isActing ? actingId : null,
    error,
    setStatusFilter: (next: AdminSellerStatusFilter) =>
      dispatch(adminSellersActions.statusFilterChanged(next)),
    handleApprove: (sellerId: number) =>
      dispatch(adminSellersActions.approveRequested(sellerId)),
    handleReject: (sellerId: number, reason: string) =>
      dispatch(
        adminSellersActions.rejectRequested({
          sellerId,
          reason: reason.trim() || undefined,
        }),
      ),
    handleDisable: (sellerId: number) =>
      dispatch(adminSellersActions.disableRequested(sellerId)),
    handleEnable: (sellerId: number) =>
      dispatch(adminSellersActions.enableRequested(sellerId)),
  };
};
