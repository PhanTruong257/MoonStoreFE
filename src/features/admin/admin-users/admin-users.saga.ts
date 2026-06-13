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
    yield put(adminUsersActions.failed("Unable to load users."));
  }
}

function* handlePromote(action: PayloadAction<number>) {
  try {
    yield call(promoteUserToAdmin, action.payload);
    void message.success("User promoted to admin.");
    yield put(adminUsersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Unable to promote user.");
    yield put(adminUsersActions.actionFailed("Unable to promote user."));
  }
}

function* handleDisable(action: PayloadAction<number>) {
  try {
    yield call(setUserStatus, action.payload, "disable");
    void message.success("User disabled.");
    yield put(adminUsersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Unable to disable user.");
    yield put(adminUsersActions.actionFailed("Unable to disable user."));
  }
}

function* handleEnable(action: PayloadAction<number>) {
  try {
    yield call(setUserStatus, action.payload, "enable");
    void message.success("User enabled.");
    yield put(adminUsersActions.actionSucceeded());
    yield call(loadList);
  } catch {
    void message.error("Unable to enable user.");
    yield put(adminUsersActions.actionFailed("Unable to enable user."));
  }
}

function* handleGrantRole(
  action: PayloadAction<{ userId: number } & GrantUserRolePayload>,
) {
  try {
    const { userId, ...payload } = action.payload;
    yield call(grantUserRole, userId, payload);
    void message.success(`Role "${payload.role}" granted successfully.`);
    yield put(adminUsersActions.actionSucceeded());
    yield call(loadList);
  } catch (e: unknown) {
    const msg =
      (e as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ?? "Unable to grant role.";
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
