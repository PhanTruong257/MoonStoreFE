import { message } from "antd";
import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import { adminVouchersActions } from "./admin-vouchers.slice";

import {
  createAdminVoucher,
  deleteAdminVoucher,
  fetchAdminVouchers,
  updateAdminVoucher,
} from "@/services/admin-service";
import type {
  AdminVoucher,
  CreateAdminVoucherPayload,
  UpdateAdminVoucherPayload,
} from "@/services/admin-service";

function* loadList() {
  try {
    const items = (yield call(fetchAdminVouchers)) as AdminVoucher[];
    yield put(adminVouchersActions.succeeded(items));
  } catch {
    yield put(adminVouchersActions.failed("Unable to load vouchers."));
  }
}

function* handleCreate(action: PayloadAction<CreateAdminVoucherPayload>) {
  try {
    yield call(createAdminVoucher, action.payload);
    void message.success("Voucher created.");
    yield put(adminVouchersActions.actionSucceeded());
    yield call(loadList);
  } catch (e) {
    const msg =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any)?.response?.data?.message ?? "Unable to create voucher.";
    void message.error(msg);
    yield put(adminVouchersActions.actionFailed(msg));
  }
}

function* handleUpdate(
  action: PayloadAction<{ id: number; payload: UpdateAdminVoucherPayload }>,
) {
  try {
    yield call(updateAdminVoucher, action.payload.id, action.payload.payload);
    void message.success("Voucher updated.");
    yield put(adminVouchersActions.actionSucceeded());
    yield call(loadList);
  } catch (e) {
    const msg =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any)?.response?.data?.message ?? "Unable to update voucher.";
    void message.error(msg);
    yield put(adminVouchersActions.actionFailed(msg));
  }
}

function* handleDelete(action: PayloadAction<number>) {
  try {
    yield call(deleteAdminVoucher, action.payload);
    void message.success("Voucher deleted.");
    yield put(adminVouchersActions.actionSucceeded());
    yield call(loadList);
  } catch (e) {
    const msg =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any)?.response?.data?.message ?? "Unable to delete voucher.";
    void message.error(msg);
    yield put(adminVouchersActions.actionFailed(msg));
  }
}

export function* adminVouchersSaga() {
  yield takeLatest(adminVouchersActions.requested.type, loadList);
  yield takeLatest(adminVouchersActions.createRequested.type, handleCreate);
  yield takeLatest(adminVouchersActions.updateRequested.type, handleUpdate);
  yield takeLatest(adminVouchersActions.deleteRequested.type, handleDelete);
}
