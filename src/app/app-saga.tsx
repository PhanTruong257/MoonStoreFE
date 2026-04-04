import { all, fork } from "redux-saga/effects";

import { authSaga } from "@/features/auth/auth-saga";

function* cartSaga() {
  yield Promise.resolve();
}

function* profileSaga() {
  yield Promise.resolve();
}

export function* rootSaga() {
  yield all([fork(authSaga), fork(cartSaga), fork(profileSaga)]);
}
