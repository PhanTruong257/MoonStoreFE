import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { SELLER_ORDER_STATUS, getNextOrderStatus } from "@/const/seller.const";
import { sellerOrderDetailActions } from "@/features/seller/seller-order-detail/seller-order-detail.slice";

const CANCEL_NOTE_DEFAULT = "Cancelled by seller";

export const useSellerOrderDetail = () => {
  const params = useParams<{ groupId: string }>();
  const groupId = Number(params.groupId ?? 0);
  const dispatch = useDispatch<AppDispatch>();
  const { group, isLoading, isSubmitting, error } = useSelector(
    (state: RootState) => state.sellerOrderDetail,
  );

  const [advanceOpen, setAdvanceOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!groupId) {
      return;
    }
    dispatch(sellerOrderDetailActions.sellerOrderDetailRequested(groupId));
  }, [dispatch, groupId]);

  const nextStatus = group ? getNextOrderStatus(group.status) : null;
  const canCancel = Boolean(
    group &&
      group.status !== SELLER_ORDER_STATUS.CANCELLED &&
      group.status !== SELLER_ORDER_STATUS.DELIVERED,
  );
  const totalAmount = group ? group.subtotal + group.shippingFee : 0;

  const addressLines = useMemo(() => {
    if (!group?.shippingAddress) {
      return [];
    }
    return Object.entries(group.shippingAddress).map(([key, value]) => ({
      key,
      value: String(value ?? ""),
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
  };
};
