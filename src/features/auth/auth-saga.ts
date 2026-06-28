import type { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";

import { getAuthErrorMessage } from "./auth-errors";
import { authActions } from "./auth-slice";
import { setStoredUser } from "./auth-storage";

import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/services/auth-service";
import { login, logout, register } from "@/services/auth-service";

function* handleLogin(action: PayloadAction<LoginPayload>) {
  try {
    const user = (yield call(login, action.payload)) as AuthUser;
    yield call(setStoredUser, user);
    yield put(authActions.loginSucceeded(user));
  } catch (error) {
    const message = getAuthErrorMessage(error, "Đăng nhập thất bại.");
    yield put(authActions.loginFailed(message));
  }
}

function* handleRegister(action: PayloadAction<RegisterPayload>) {
  try {
    const user = (yield call(register, action.payload)) as AuthUser;
    yield call(setStoredUser, user);
    yield put(authActions.registerSucceeded(user));
  } catch (error) {
    const message = getAuthErrorMessage(error, "Đăng ký thất bại.");
    yield put(authActions.registerFailed(message));
  }
}

function* handleLogout() {
  try {
    yield call(logout);
  } finally {
    yield call(setStoredUser, null);
    yield put(authActions.logoutSucceeded());
  }
}

export function* authSaga() {
  yield takeLatest(authActions.loginRequested.type, handleLogin);
  yield takeLatest(authActions.registerRequested.type, handleRegister);
  yield takeLatest(authActions.logoutRequested.type, handleLogout);
}
