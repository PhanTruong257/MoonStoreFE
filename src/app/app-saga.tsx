import { all, fork } from "redux-saga/effects";

import { authSaga } from "@/features/auth/auth-saga";
import { homeCategorySaga } from "@/features/home/category/category.saga";
import { flashSaleSaga } from "@/features/home/flash-sale/flash-sale.saga";
import { productListSaga } from "@/features/home/product-list/product-list.saga";
import { reviewsSaga } from "@/features/reviews/reviews.saga";
import { sellerDashboardSaga } from "@/features/seller/seller-dashboard/seller-dashboard.saga";
import { sellerOrderDetailSaga } from "@/features/seller/seller-order-detail/seller-order-detail.saga";
import { sellerOrdersSaga } from "@/features/seller/seller-orders/seller-orders.saga";
import { sellerProductEditSaga } from "@/features/seller/seller-product-edit/seller-product-edit.saga";
import { sellerProductsSaga } from "@/features/seller/seller-products/seller-products.saga";
import { vouchersSaga } from "@/features/vouchers/vouchers.saga";

export function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(homeCategorySaga),
    fork(flashSaleSaga),
    fork(productListSaga),
    fork(reviewsSaga),
    fork(sellerDashboardSaga),
    fork(sellerOrderDetailSaga),
    fork(sellerOrdersSaga),
    fork(sellerProductEditSaga),
    fork(sellerProductsSaga),
    fork(vouchersSaga),
  ]);
}
