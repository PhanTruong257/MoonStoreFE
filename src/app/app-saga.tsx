import { all, fork } from "redux-saga/effects";

import { authSaga } from "@/features/auth/auth-saga";
import { homeCategorySaga } from "@/features/home/category/category.saga";
import { flashSaleSaga } from "@/features/home/flash-sale/flash-sale.saga";
import { productListSaga } from "@/features/home/product-list/product-list.saga";

function* cartSaga() {
  yield Promise.resolve();
}

function* profileSaga() {
  yield Promise.resolve();
}

export function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(homeCategorySaga),
    fork(flashSaleSaga),
    fork(productListSaga),
    fork(cartSaga),
    fork(profileSaga),
  ]);
}
