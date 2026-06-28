import type { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";

import { adminOrdersActions } from "./admin-orders.slice";

import {
  fetchAdminOrderDetail,
  fetchAdminOrders,
} from "@/services/admin-service";
import type {
  AdminOrderDetail,
  AdminOrderListFilters,
  AdminOrderListItem,
} from "@/services/admin-service";

function* handleList(
  action: PayloadAction<AdminOrderListFilters | undefined>,
) {
  try {
    const orders = (yield call(
      fetchAdminOrders,
      action.payload ?? {},
    )) as AdminOrderListItem[];
    yield put(adminOrdersActions.listSucceeded(orders));
  } catch {
    yield put(adminOrdersActions.listFailed("Không tải được đơn hàng."));
  }
}

function* handleDetail(action: PayloadAction<number>) {
  try {
    const order = (yield call(
      fetchAdminOrderDetail,
      action.payload,
    )) as AdminOrderDetail;
    yield put(adminOrdersActions.detailSucceeded(order));
  } catch {
    yield put(adminOrdersActions.detailFailed("Không tải được đơn hàng."));
  }
}

export function* adminOrdersSaga() {
  yield takeLatest(adminOrdersActions.listRequested.type, handleList);
  yield takeLatest(adminOrdersActions.detailRequested.type, handleDetail);
}
