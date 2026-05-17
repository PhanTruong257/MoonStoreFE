import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { adminRevenueActions } from "@/features/admin/admin-revenue/admin-revenue.slice";

export const useAdminRevenue = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, error, commissionRate, isUpdatingRate } = useSelector(
    (state: RootState) => state.adminRevenue,
  );

  useEffect(() => {
    dispatch(adminRevenueActions.revenueRequested());
  }, [dispatch]);

  const updateCommissionRate = (rate: number) => {
    dispatch(adminRevenueActions.commissionRateUpdateRequested(rate));
  };

  return { data, isLoading, error, commissionRate, isUpdatingRate, updateCommissionRate };
};
