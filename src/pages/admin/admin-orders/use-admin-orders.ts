import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { adminOrdersActions } from "@/features/admin/admin-orders/admin-orders.slice";

const STATUS_OPTIONS = ["all", "PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"];

export const ADMIN_ORDER_STATUS_OPTIONS = STATUS_OPTIONS;

export const useAdminOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, isListLoading, error } = useSelector(
    (state: RootState) => state.adminOrders,
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    dispatch(
      adminOrdersActions.listRequested(
        statusFilter === "all" ? {} : { status: statusFilter },
      ),
    );
  }, [dispatch, statusFilter]);

  return {
    orders: list,
    isLoading: isListLoading,
    error,
    statusFilter,
    setStatusFilter,
  };
};
