import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "@/app/app-store";
import { ORDER_STATUS } from "@/const/orders.const";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/const/payment.const";
import { ordersActions } from "@/features/orders/orders.slice";
import { paymentsActions } from "@/features/payments/payments.slice";

export const useOrderDetail = () => {
  const params = useParams<{ orderId: string }>();
  const orderId = Number(params.orderId ?? 0);
  const dispatch = useDispatch<AppDispatch>();
  const { detail, isDetailLoading, isCancelling, error } = useSelector(
    (state: RootState) => state.orders,
  );
  const { qrInfo, isQrLoading } = useSelector(
    (state: RootState) => state.payments,
  );

  useEffect(() => {
    if (!orderId) {
      return;
    }
    dispatch(ordersActions.orderDetailRequested(orderId));

    return () => {
      dispatch(ordersActions.orderDetailReset());
      dispatch(paymentsActions.qrInfoReset());
    };
  }, [dispatch, orderId]);

  useEffect(() => {
    if (!detail) {
      return;
    }
    if (
      detail.paymentMethod === PAYMENT_METHOD.QR &&
      detail.paymentStatus === PAYMENT_STATUS.PENDING
    ) {
      dispatch(paymentsActions.qrInfoRequested(detail.id));
    } else {
      dispatch(paymentsActions.qrInfoReset());
    }
  }, [
    dispatch,
    detail,
    detail?.id,
    detail?.paymentMethod,
    detail?.paymentStatus,
  ]);


  const canCancel = useMemo(() => {
    if (!detail) {
      return false;
    }
    if (!detail.groups || detail.groups.length === 0) {
      return false;
    }
    return detail.groups.every((group) => group.status === ORDER_STATUS.PENDING);
  }, [detail]);

  const cancelGroup = (groupId: number) => {
    if (!detail) {
      return;
    }
    dispatch(
      ordersActions.orderGroupCancelRequested({
        orderId: detail.id,
        groupId,
      }),
    );
  };

  return {
    orderId,
    order: detail,
    isLoading: isDetailLoading,
    isCancelling,
    error,
    canCancel,
    cancelGroup,
    qrInfo,
    isQrLoading,
  };
};
