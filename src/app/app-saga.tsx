import { all, fork } from "redux-saga/effects";

function* authSaga() {
  yield Promise.resolve();
}

function* cartSaga() {
  yield Promise.resolve();
}

function* profileSaga() {
  yield Promise.resolve();
}

export function* rootSaga() {
  yield all([fork(authSaga), fork(cartSaga), fork(profileSaga)]);
}
