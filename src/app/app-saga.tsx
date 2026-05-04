import { all, fork } from "redux-saga/effects";

import { adminBrandsSaga } from "@/features/admin/admin-brands/admin-brands.saga";
import { adminCategoriesSaga } from "@/features/admin/admin-categories/admin-categories.saga";
import { adminDashboardSaga } from "@/features/admin/admin-dashboard/admin-dashboard.saga";
import { adminOrdersSaga } from "@/features/admin/admin-orders/admin-orders.saga";
import { adminSellersSaga } from "@/features/admin/admin-sellers/admin-sellers.saga";
import { adminUsersSaga } from "@/features/admin/admin-users/admin-users.saga";
import { adminVouchersSaga } from "@/features/admin/admin-vouchers/admin-vouchers.saga";
import { authSaga } from "@/features/auth/auth-saga";
import { chatSaga } from "@/features/chat/chat.saga";
import { homeCategorySaga } from "@/features/home/category/category.saga";
import { flashSaleSaga } from "@/features/home/flash-sale/flash-sale.saga";
import { productListSaga } from "@/features/home/product-list/product-list.saga";
import { ordersSaga } from "@/features/orders/orders.saga";
import { paymentsSaga } from "@/features/payments/payments.saga";
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
    fork(chatSaga),
    fork(homeCategorySaga),
    fork(flashSaleSaga),
    fork(productListSaga),
    fork(ordersSaga),
    fork(paymentsSaga),
    fork(reviewsSaga),
    fork(sellerDashboardSaga),
    fork(sellerOrderDetailSaga),
    fork(sellerOrdersSaga),
    fork(sellerProductEditSaga),
    fork(sellerProductsSaga),
    fork(vouchersSaga),
    fork(adminDashboardSaga),
    fork(adminSellersSaga),
    fork(adminUsersSaga),
    fork(adminCategoriesSaga),
    fork(adminBrandsSaga),
    fork(adminVouchersSaga),
    fork(adminOrdersSaga),
  ]);
}
