import type { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { call, put, takeLatest } from "redux-saga/effects";

import { adminCategoriesActions } from "./admin-categories.slice";

import { extractApiErrorMessage } from "@/app/utils/error-message";
import {
  createAdminCategory,
  deleteAdminCategory,
  fetchAdminCategories,
  updateAdminCategory,
} from "@/services/admin-service";
import type {
  AdminCategory,
  CreateAdminCategoryPayload,
  UpdateAdminCategoryPayload,
} from "@/services/admin-service";

function* loadList() {
  try {
    const items = (yield call(fetchAdminCategories)) as AdminCategory[];
    yield put(adminCategoriesActions.succeeded(items));
  } catch {
    yield put(adminCategoriesActions.failed("Không tải được danh mục."));
  }
}

function* handleCreate(action: PayloadAction<CreateAdminCategoryPayload>) {
  try {
    yield call(createAdminCategory, action.payload);
    void message.success("Đã tạo danh mục.");
    yield put(adminCategoriesActions.actionSucceeded());
    yield call(loadList);
  } catch (error) {
    const msg = extractApiErrorMessage(error, "Không thể tạo danh mục.");
    void message.error(msg);
    yield put(adminCategoriesActions.actionFailed(msg));
  }
}

function* handleUpdate(
  action: PayloadAction<{ id: number; payload: UpdateAdminCategoryPayload }>,
) {
  try {
    yield call(updateAdminCategory, action.payload.id, action.payload.payload);
    void message.success("Đã cập nhật danh mục.");
    yield put(adminCategoriesActions.actionSucceeded());
    yield call(loadList);
  } catch (error) {
    const msg = extractApiErrorMessage(error, "Không thể cập nhật danh mục.");
    void message.error(msg);
    yield put(adminCategoriesActions.actionFailed(msg));
  }
}

function* handleDelete(action: PayloadAction<number>) {
  try {
    yield call(deleteAdminCategory, action.payload);
    void message.success("Đã xoá danh mục.");
    yield put(adminCategoriesActions.actionSucceeded());
    yield call(loadList);
  } catch (error) {
    const msg = extractApiErrorMessage(error, "Không thể xoá danh mục.");
    void message.error(msg);
    yield put(adminCategoriesActions.actionFailed(msg));
  }
}

export function* adminCategoriesSaga() {
  yield takeLatest(adminCategoriesActions.requested.type, loadList);
  yield takeLatest(adminCategoriesActions.createRequested.type, handleCreate);
  yield takeLatest(adminCategoriesActions.updateRequested.type, handleUpdate);
  yield takeLatest(adminCategoriesActions.deleteRequested.type, handleDelete);
}
