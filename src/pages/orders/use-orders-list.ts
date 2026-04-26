import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { ordersActions } from "@/features/orders/orders.slice";

const DEFAULT_FILTER = "ALL";

export const useOrdersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, isListLoading, error } = useSelector(
    (state: RootState) => state.orders,
  );
  const [statusFilter, setStatusFilter] = useState<string>(DEFAULT_FILTER);

  useEffect(() => {
    dispatch(ordersActions.ordersListRequested());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (statusFilter === DEFAULT_FILTER) {
      return list;
    }
    return list.filter((order) => order.status === statusFilter);
  }, [list, statusFilter]);

  return {
    orders: filtered,
    statusFilter,
    setStatusFilter,
    isLoading: isListLoading,
    error,
  };
};
