import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { adminDashboardActions } from "@/features/admin/admin-dashboard/admin-dashboard.slice";

export const useAdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, isLoading, error } = useSelector(
    (state: RootState) => state.adminDashboard,
  );

  useEffect(() => {
    dispatch(adminDashboardActions.requested());
  }, [dispatch]);

  return { stats, isLoading, error };
};
