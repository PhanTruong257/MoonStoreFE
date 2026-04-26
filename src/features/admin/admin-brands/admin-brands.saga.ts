import { message } from "antd";
import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import { adminBrandsActions } from "./admin-brands.slice";

import {
  createAdminBrand,
  deleteAdminBrand,
  fetchAdminBrands,
  updateAdminBrand,
} from "@/services/admin-service";
import type { AdminBrand } from "@/services/admin-service";

function* loadList() {
  try {
    const items = (yield call(fetchAdminBrands)) as AdminBrand[];
    yield put(adminBrandsActions.succeeded(items));
  } catch {
    yield put(adminBrandsActions.failed("Unable to load brands."));
  }
}

function* handleCreate(action: PayloadAction<{ name: string }>) {
  try {
    yield call(createAdminBrand, action.payload);
    void message.success("Brand created.");
    yield put(adminBrandsActions.actionSucceeded());
    yield call(loadList);
  } catch (e) {
    const msg =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any)?.response?.data?.message ?? "Unable to create brand.";
    void message.error(msg);
    yield put(adminBrandsActions.actionFailed(msg));
  }
}

function* handleUpdate(
  action: PayloadAction<{ id: number; name: string }>,
) {
  try {
    yield call(updateAdminBrand, action.payload.id, {
      name: action.payload.name,
    });
    void message.success("Brand updated.");
    yield put(adminBrandsActions.actionSucceeded());
    yield call(loadList);
  } catch (e) {
    const msg =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any)?.response?.data?.message ?? "Unable to update brand.";
    void message.error(msg);
    yield put(adminBrandsActions.actionFailed(msg));
  }
}

function* handleDelete(action: PayloadAction<number>) {
  try {
    yield call(deleteAdminBrand, action.payload);
    void message.success("Brand deleted.");
    yield put(adminBrandsActions.actionSucceeded());
    yield call(loadList);
  } catch (e) {
    const msg =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any)?.response?.data?.message ?? "Unable to delete brand.";
    void message.error(msg);
    yield put(adminBrandsActions.actionFailed(msg));
  }
}

export function* adminBrandsSaga() {
  yield takeLatest(adminBrandsActions.requested.type, loadList);
  yield takeLatest(adminBrandsActions.createRequested.type, handleCreate);
  yield takeLatest(adminBrandsActions.updateRequested.type, handleUpdate);
  yield takeLatest(adminBrandsActions.deleteRequested.type, handleDelete);
}
