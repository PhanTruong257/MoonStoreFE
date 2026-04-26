import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "@/app/app-store";
import { adminOrdersActions } from "@/features/admin/admin-orders/admin-orders.slice";

export const useAdminOrderDetail = () => {
  const params = useParams<{ orderId: string }>();
  const orderId = Number(params.orderId ?? 0);
  const dispatch = useDispatch<AppDispatch>();
  const { detail, isDetailLoading, error } = useSelector(
    (state: RootState) => state.adminOrders,
  );

  useEffect(() => {
    if (!orderId) {
      return;
    }
    dispatch(adminOrdersActions.detailRequested(orderId));
    return () => {
      dispatch(adminOrdersActions.detailReset());
    };
  }, [dispatch, orderId]);

  return {
    orderId,
    order: detail,
    isLoading: isDetailLoading,
    error,
  };
};
