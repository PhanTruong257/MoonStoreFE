import type { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { call, put, select, takeLatest } from "redux-saga/effects";

import {
  adminSellersActions,
  type SellerStatusFilter,
} from "./admin-sellers.slice";

import type { RootState } from "@/app/app-store";
import {
  approveSeller,
  fetchAdminSellers,
  rejectSeller,
  setSellerStatus,
} from "@/services/admin-service";
import type { AdminSeller } from "@/services/admin-service";

function* loadList() {
  try {
    const filter = (yield select(
      (state: RootState) => state.adminSellers.statusFilter,
    )) as SellerStatusFilter;
    const sellers = (yield call(
      fetchAdminSellers,
      filter === "all" ? undefined : filter,
    )) as AdminSeller[];
    yield put(adminSellersActions.succeeded(sellers));
  } catch {
    yield put(adminSellersActions.failed("Không tải được danh sách đăng ký người bán."));
  }
}

function* handleApprove(action: PayloadAction<number>) {
  try {
    yield call(approveSeller, action.payload);
    void message.success("Đã duyệt người bán.");
    yield put(adminSellersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Không thể duyệt người bán.");
    yield put(adminSellersActions.actionFailed("Không thể duyệt người bán."));
  }
}

function* handleReject(
  action: PayloadAction<{ sellerId: number; reason?: string }>,
) {
  try {
    yield call(rejectSeller, action.payload.sellerId, action.payload.reason);
    void message.success("Đã từ chối người bán.");
    yield put(adminSellersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Không thể từ chối người bán.");
    yield put(adminSellersActions.actionFailed("Không thể từ chối người bán."));
  }
}

function* handleDisable(action: PayloadAction<number>) {
  try {
    yield call(setSellerStatus, action.payload, "disable");
    void message.success("Đã vô hiệu hoá người bán.");
    yield put(adminSellersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Không thể vô hiệu hoá người bán.");
    yield put(adminSellersActions.actionFailed("Không thể vô hiệu hoá người bán."));
  }
}

function* handleEnable(action: PayloadAction<number>) {
  try {
    yield call(setSellerStatus, action.payload, "enable");
    void message.success("Đã kích hoạt người bán.");
    yield put(adminSellersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Không thể kích hoạt người bán.");
    yield put(adminSellersActions.actionFailed("Không thể kích hoạt người bán."));
  }
}

export function* adminSellersSaga() {
  yield takeLatest(adminSellersActions.requested.type, loadList);
  yield takeLatest(
    adminSellersActions.statusFilterChanged.type,
    loadList,
  );
  yield takeLatest(adminSellersActions.approveRequested.type, handleApprove);
  yield takeLatest(adminSellersActions.rejectRequested.type, handleReject);
  yield takeLatest(adminSellersActions.disableRequested.type, handleDisable);
  yield takeLatest(adminSellersActions.enableRequested.type, handleEnable);
}
