import { message } from "antd";
import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import { adminCategoriesActions } from "./admin-categories.slice";

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
    yield put(adminCategoriesActions.failed("Unable to load categories."));
  }
}

function* handleCreate(action: PayloadAction<CreateAdminCategoryPayload>) {
  try {
    yield call(createAdminCategory, action.payload);
    void message.success("Category created.");
    yield put(adminCategoriesActions.actionSucceeded());
    yield call(loadList);
  } catch (e) {
    const msg =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any)?.response?.data?.message ?? "Unable to create category.";
    void message.error(msg);
    yield put(adminCategoriesActions.actionFailed(msg));
  }
}

function* handleUpdate(
  action: PayloadAction<{ id: number; payload: UpdateAdminCategoryPayload }>,
) {
  try {
    yield call(updateAdminCategory, action.payload.id, action.payload.payload);
    void message.success("Category updated.");
    yield put(adminCategoriesActions.actionSucceeded());
    yield call(loadList);
  } catch (e) {
    const msg =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any)?.response?.data?.message ?? "Unable to update category.";
    void message.error(msg);
    yield put(adminCategoriesActions.actionFailed(msg));
  }
}

function* handleDelete(action: PayloadAction<number>) {
  try {
    yield call(deleteAdminCategory, action.payload);
    void message.success("Category deleted.");
    yield put(adminCategoriesActions.actionSucceeded());
    yield call(loadList);
  } catch (e) {
    const msg =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any)?.response?.data?.message ?? "Unable to delete category.";
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
