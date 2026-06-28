import type { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { call, put, takeLatest } from "redux-saga/effects";

import { adminVouchersActions } from "./admin-vouchers.slice";

import { extractApiErrorMessage } from "@/app/utils/error-message";
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
    yield put(adminVouchersActions.failed("Không tải được mã giảm giá."));
  }
}

function* handleCreate(action: PayloadAction<CreateAdminVoucherPayload>) {
  try {
    yield call(createAdminVoucher, action.payload);
    void message.success("Đã tạo mã giảm giá.");
    yield put(adminVouchersActions.actionSucceeded());
    yield call(loadList);
  } catch (error) {
    const msg = extractApiErrorMessage(error, "Không thể tạo mã giảm giá.");
    void message.error(msg);
    yield put(adminVouchersActions.actionFailed(msg));
  }
}

function* handleUpdate(
  action: PayloadAction<{ id: number; payload: UpdateAdminVoucherPayload }>,
) {
  try {
    yield call(updateAdminVoucher, action.payload.id, action.payload.payload);
    void message.success("Đã cập nhật mã giảm giá.");
    yield put(adminVouchersActions.actionSucceeded());
    yield call(loadList);
  } catch (error) {
    const msg = extractApiErrorMessage(error, "Không thể cập nhật mã giảm giá.");
    void message.error(msg);
    yield put(adminVouchersActions.actionFailed(msg));
  }
}

function* handleDelete(action: PayloadAction<number>) {
  try {
    yield call(deleteAdminVoucher, action.payload);
    void message.success("Đã xoá mã giảm giá.");
    yield put(adminVouchersActions.actionSucceeded());
    yield call(loadList);
  } catch (error) {
    const msg = extractApiErrorMessage(error, "Không thể xoá mã giảm giá.");
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
