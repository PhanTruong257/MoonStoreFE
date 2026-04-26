import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import {
  ADMIN_FILTER_ALL,
  ADMIN_ORDER_STATUS_OPTIONS,
} from "@/const/admin.const";
import { adminOrdersActions } from "@/features/admin/admin-orders/admin-orders.slice";

export { ADMIN_ORDER_STATUS_OPTIONS };

export const useAdminOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, isListLoading, error } = useSelector(
    (state: RootState) => state.adminOrders,
  );
  const [statusFilter, setStatusFilter] = useState<string>(ADMIN_FILTER_ALL);

  useEffect(() => {
    dispatch(
      adminOrdersActions.listRequested(
        statusFilter === ADMIN_FILTER_ALL ? {} : { status: statusFilter },
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
