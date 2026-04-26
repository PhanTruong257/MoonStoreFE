import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { sellerDashboardActions } from "@/features/seller/seller-dashboard/seller-dashboard.slice";

export const useSellerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, isLoading, error } = useSelector(
    (state: RootState) => state.sellerDashboard,
  );

  useEffect(() => {
    dispatch(sellerDashboardActions.sellerDashboardRequested());
  }, [dispatch]);

  return { stats, loading: isLoading, error };
};
