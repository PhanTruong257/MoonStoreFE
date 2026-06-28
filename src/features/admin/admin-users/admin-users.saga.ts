import type { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { adminUsersActions, type RoleFilter } from "./admin-users.slice";

import type { RootState } from "@/app/app-store";
import {
  fetchAdminUsers,
  grantUserRole,
  promoteUserToAdmin,
  setUserStatus,
} from "@/services/admin-service";
import type { AdminUser, GrantUserRolePayload } from "@/services/admin-service";

function* loadList() {
  try {
    const filter = (yield select(
      (state: RootState) => state.adminUsers.roleFilter,
    )) as RoleFilter;
    const users = (yield call(
      fetchAdminUsers,
      filter === "all" ? undefined : filter,
    )) as AdminUser[];
    yield put(adminUsersActions.succeeded(users));
  } catch {
    yield put(adminUsersActions.failed("Không tải được người dùng."));
  }
}

function* handlePromote(action: PayloadAction<number>) {
  try {
    yield call(promoteUserToAdmin, action.payload);
    void message.success("Đã thăng người dùng thành admin.");
    yield put(adminUsersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Không thể thăng cấp người dùng.");
    yield put(adminUsersActions.actionFailed("Không thể thăng cấp người dùng."));
  }
}

function* handleDisable(action: PayloadAction<number>) {
  try {
    yield call(setUserStatus, action.payload, "disable");
    void message.success("Đã vô hiệu hoá người dùng.");
    yield put(adminUsersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Không thể vô hiệu hoá người dùng.");
    yield put(adminUsersActions.actionFailed("Không thể vô hiệu hoá người dùng."));
  }
}

function* handleEnable(action: PayloadAction<number>) {
  try {
    yield call(setUserStatus, action.payload, "enable");
    void message.success("Đã kích hoạt người dùng.");
    yield put(adminUsersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Không thể kích hoạt người dùng.");
    yield put(adminUsersActions.actionFailed("Không thể kích hoạt người dùng."));
  }
}

function* handleGrantRole(
  action: PayloadAction<{ userId: number } & GrantUserRolePayload>,
) {
  try {
    const { userId, ...payload } = action.payload;
    yield call(grantUserRole, userId, payload);
    void message.success(`Đã cấp vai trò "${payload.role}" thành công.`);
    yield put(adminUsersActions.actionSucceeded());
    yield call(loadList);
  } catch (e: unknown) {
    const msg =
      (e as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ?? "Không thể cấp vai trò.";
    void message.error(msg);
    yield put(adminUsersActions.actionFailed(msg));
  }
}

export function* adminUsersSaga() {
  yield takeLatest(adminUsersActions.requested.type, loadList);
  yield takeLatest(adminUsersActions.roleFilterChanged.type, loadList);
  yield takeLatest(adminUsersActions.promoteRequested.type, handlePromote);
  yield takeLatest(adminUsersActions.disableRequested.type, handleDisable);
  yield takeLatest(adminUsersActions.enableRequested.type, handleEnable);
  yield takeLatest(adminUsersActions.grantRoleRequested.type, handleGrantRole);
}
