import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "@/app/app-store";
import { CHAT_ROUTES } from "@/const/chat.const";
import { ORDER_STATUS } from "@/const/orders.const";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/const/payment.const";
import { chatActions } from "@/features/chat/chat.slice";
import { ordersActions } from "@/features/orders/orders.slice";
import { paymentsActions } from "@/features/payments/payments.slice";

export const useOrderDetail = () => {
  const params = useParams<{ orderId: string }>();
  const orderId = Number(params.orderId ?? 0);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const pendingChatRef = useRef(false);

  const { detail, isDetailLoading, isCancelling, error } = useSelector(
    (state: RootState) => state.orders,
  );
  const { qrInfo, isQrLoading } = useSelector(
    (state: RootState) => state.payments,
  );
  const isChatCreating = useSelector((state: RootState) => state.chat.isCreating);
  const lastCreatedChatId = useSelector((state: RootState) => state.chat.lastCreatedId);

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


  useEffect(() => {
    if (pendingChatRef.current && !isChatCreating && lastCreatedChatId !== null) {
      pendingChatRef.current = false;
      navigate(CHAT_ROUTES.buyerDetail(lastCreatedChatId));
    }
  }, [isChatCreating, lastCreatedChatId, navigate]);

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

  const startChatWithSeller = (sellerId: number) => {
    if (!detail) {
      return;
    }
    pendingChatRef.current = true;
    dispatch(
      chatActions.conversationCreateRequested({ sellerId, orderId: detail.id }),
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
    isChatCreating,
    startChatWithSeller,
  };
};
