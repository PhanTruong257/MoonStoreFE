import { message } from "antd";
import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import { ordersActions } from "./orders.slice";

import {
  cancelOrderGroup,
  fetchMyOrderDetail,
  fetchMyOrders,
} from "@/services/orders-service";
import type { OrderSummary } from "@/services/orders-service";

function* handleListRequested() {
  try {
    const orders = (yield call(fetchMyOrders)) as OrderSummary[];
    yield put(ordersActions.ordersListSucceeded(orders));
  } catch {
    yield put(ordersActions.ordersListFailed("Unable to load orders."));
  }
}

function* handleDetailRequested(action: PayloadAction<number>) {
  try {
    const order = (yield call(fetchMyOrderDetail, action.payload)) as OrderSummary;
    yield put(ordersActions.orderDetailSucceeded(order));
  } catch {
    yield put(ordersActions.orderDetailFailed("Unable to load order."));
  }
}

function* handleCancelRequested(
  action: PayloadAction<{ orderId: number; groupId: number }>,
) {
  try {
    yield call(cancelOrderGroup, action.payload.groupId);
    void message.success("Order group cancelled.");
    yield put(ordersActions.orderGroupCancelSucceeded());
    const order = (yield call(
      fetchMyOrderDetail,
      action.payload.orderId,
    )) as OrderSummary;
    yield put(ordersActions.orderDetailSucceeded(order));
  } catch {
    void message.error("Unable to cancel order group.");
    yield put(
      ordersActions.orderGroupCancelFailed("Unable to cancel order group."),
    );
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
}
