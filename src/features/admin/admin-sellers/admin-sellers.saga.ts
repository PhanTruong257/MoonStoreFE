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
    yield put(adminSellersActions.failed("Unable to load seller applications."));
  }
}

function* handleApprove(action: PayloadAction<number>) {
  try {
    yield call(approveSeller, action.payload);
    void message.success("Seller approved.");
    yield put(adminSellersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Unable to approve seller.");
    yield put(adminSellersActions.actionFailed("Unable to approve seller."));
  }
}

function* handleReject(
  action: PayloadAction<{ sellerId: number; reason?: string }>,
) {
  try {
    yield call(rejectSeller, action.payload.sellerId, action.payload.reason);
    void message.success("Seller rejected.");
    yield put(adminSellersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Unable to reject seller.");
    yield put(adminSellersActions.actionFailed("Unable to reject seller."));
  }
}

function* handleDisable(action: PayloadAction<number>) {
  try {
    yield call(setSellerStatus, action.payload, "disable");
    void message.success("Seller disabled.");
    yield put(adminSellersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Unable to disable seller.");
    yield put(adminSellersActions.actionFailed("Unable to disable seller."));
  }
}

function* handleEnable(action: PayloadAction<number>) {
  try {
    yield call(setSellerStatus, action.payload, "enable");
    void message.success("Seller enabled.");
    yield put(adminSellersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Unable to enable seller.");
    yield put(adminSellersActions.actionFailed("Unable to enable seller."));
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
