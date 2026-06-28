import type { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { call, put, takeLatest } from "redux-saga/effects";

import { ordersActions } from "./orders.slice";

import {
  cancelOrderGroup,
  createRefundRequest,
  fetchMyOrderDetail,
  fetchMyOrders,
} from "@/services/orders-service";
import type { OrderSummary } from "@/services/orders-service";
import { extractApiErrorMessage } from "@/app/utils/error-message";

function* handleListRequested() {
  try {
    const orders = (yield call(fetchMyOrders)) as OrderSummary[];
    yield put(ordersActions.ordersListSucceeded(orders));
  } catch {
    yield put(ordersActions.ordersListFailed("Không tải được đơn hàng."));
  }
}

function* handleDetailRequested(action: PayloadAction<number>) {
  try {
    const order = (yield call(fetchMyOrderDetail, action.payload)) as OrderSummary;
    yield put(ordersActions.orderDetailSucceeded(order));
  } catch {
    yield put(ordersActions.orderDetailFailed("Không tải được đơn hàng."));
  }
}

function* handleCancelRequested(
  action: PayloadAction<{ orderId: number; groupId: number }>,
) {
  try {
    yield call(cancelOrderGroup, action.payload.groupId);
    void message.success("Đã huỷ nhóm đơn hàng.");
    yield put(ordersActions.orderGroupCancelSucceeded());
    const order = (yield call(
      fetchMyOrderDetail,
      action.payload.orderId,
    )) as OrderSummary;
    yield put(ordersActions.orderDetailSucceeded(order));
  } catch {
    void message.error("Không thể huỷ nhóm đơn hàng.");
    yield put(
      ordersActions.orderGroupCancelFailed("Không thể huỷ nhóm đơn."),
    );
  }
}

function* handleRefundRequestRequested(
  action: PayloadAction<{ orderId: number; reason: string; amount: number }>,
) {
  try {
    yield call(createRefundRequest, action.payload.orderId, {
      reason: action.payload.reason,
      amount: action.payload.amount,
    });
    void message.success("Đã gửi yêu cầu hoàn tiền.");
    yield put(ordersActions.refundRequestSucceeded());
  } catch (error) {
    const msg = extractApiErrorMessage(error, "Không thể gửi yêu cầu hoàn tiền.");
    void message.error(msg);
    yield put(ordersActions.refundRequestFailed(msg));
  }
}

export function* ordersSaga() {
  yield takeLatest(ordersActions.ordersListRequested.type, handleListRequested);
  yield takeLatest(
    ordersActions.orderDetailRequested.type,
    handleDetailRequested,
  );
  yield takeLatest(
    ordersActions.orderGroupCancelRequested.type,
    handleCancelRequested,
  );
  yield takeLatest(
    ordersActions.refundRequestRequested.type,
    handleRefundRequestRequested,
  );
}
