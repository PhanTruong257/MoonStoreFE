import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "@/app/app-store";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/const/payment.const";
import { SELLER_ORDER_STATUS, getNextOrderStatus } from "@/const/seller.const";
import { paymentsActions } from "@/features/payments/payments.slice";
import { sellerOrderDetailActions } from "@/features/seller/seller-order-detail/seller-order-detail.slice";

const CANCEL_NOTE_DEFAULT = "Đã huỷ bởi người bán";

export const useSellerOrderDetail = () => {
  const params = useParams<{ groupId: string }>();
  const groupId = Number(params.groupId ?? 0);
  const dispatch = useDispatch<AppDispatch>();
  const { group, isLoading, isSubmitting, error } = useSelector(
    (state: RootState) => state.sellerOrderDetail,
  );
  const { isConfirming, qrInfo } = useSelector(
    (state: RootState) => state.payments,
  );

  const [advanceOpen, setAdvanceOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [note, setNote] = useState("");
  const lastConfirmedPaymentRef = useRef<number | null>(null);

  useEffect(() => {
    if (!groupId) {
      return;
    }
    dispatch(sellerOrderDetailActions.sellerOrderDetailRequested(groupId));

    return () => {
      dispatch(paymentsActions.qrInfoReset());
    };
  }, [dispatch, groupId]);

  useEffect(() => {
    if (!qrInfo || qrInfo.paymentStatus !== PAYMENT_STATUS.PAID) {
      return;
    }
    if (lastConfirmedPaymentRef.current === qrInfo.paymentId) {
      return;
    }
    lastConfirmedPaymentRef.current = qrInfo.paymentId;
    dispatch(sellerOrderDetailActions.sellerOrderDetailRequested(groupId));
  }, [dispatch, groupId, qrInfo]);

  const nextStatus =
    group?.status === SELLER_ORDER_STATUS.PENDING
      ? getNextOrderStatus(group.status)
      : null;
  const canCancel = Boolean(
    group && group.status === SELLER_ORDER_STATUS.PENDING,
  );
  const totalAmount = group ? group.subtotal + group.shippingFee : 0;

  const addressLines = useMemo(() => {
    if (!group?.shippingAddress) {
      return [];
    }
    return Object.entries(group.shippingAddress).map(([key, value]) => ({
      key,
      value: typeof value === "string" || typeof value === "number"
        ? String(value)
        : "",
    }));
  }, [group]);

  const openAdvance = useCallback(() => {
    setNote("");
    setAdvanceOpen(true);
  }, []);

  const openCancel = useCallback(() => {
    setNote("");
    setCancelOpen(true);
  }, []);

  const closeAdvance = useCallback(() => setAdvanceOpen(false), []);
  const closeCancel = useCallback(() => setCancelOpen(false), []);

  const confirmAdvance = useCallback(() => {
    if (!nextStatus) {
      return;
    }
    dispatch(
      sellerOrderDetailActions.sellerOrderStatusUpdateRequested({
        groupId,
        status: nextStatus,
        note: note.trim() || undefined,
      }),
    );
    setAdvanceOpen(false);
  }, [dispatch, groupId, nextStatus, note]);

  const canConfirmManualPayment = Boolean(
    group &&
      group.paymentMethod === PAYMENT_METHOD.QR &&
      group.paymentStatus === PAYMENT_STATUS.PENDING &&
      group.qrPaymentId,
  );

  const confirmManualPayment = useCallback(() => {
    if (!group?.qrPaymentId) {
      return;
    }
    dispatch(
      paymentsActions.manualConfirmRequested({
        paymentId: group.qrPaymentId,
        orderId: group.orderId,
      }),
    );
  }, [dispatch, group]);

  const confirmCancel = useCallback(() => {
    dispatch(
      sellerOrderDetailActions.sellerOrderStatusUpdateRequested({
        groupId,
        status: SELLER_ORDER_STATUS.CANCELLED,
        note: note.trim() || CANCEL_NOTE_DEFAULT,
      }),
    );
    setCancelOpen(false);
  }, [dispatch, groupId, note]);

  return {
    groupId,
    group,
    loading: isLoading,
    error,
    submitting: isSubmitting,
    nextStatus,
    canCancel,
    totalAmount,
    addressLines,
    advanceOpen,
    cancelOpen,
    note,
    setNote,
    openAdvance,
    openCancel,
    closeAdvance,
    closeCancel,
    confirmAdvance,
    confirmCancel,
    canConfirmManualPayment,
    confirmingManualPayment: isConfirming,
    confirmManualPayment,
  };
};
