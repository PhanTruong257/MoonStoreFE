import { configureStore, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import { rootSaga } from "@/app/app-saga";
import { adminBrandsReducer } from "@/features/admin/admin-brands/admin-brands.slice";
import { adminCategoriesReducer } from "@/features/admin/admin-categories/admin-categories.slice";
import { adminDashboardReducer } from "@/features/admin/admin-dashboard/admin-dashboard.slice";
import { adminOrdersReducer } from "@/features/admin/admin-orders/admin-orders.slice";
import { adminRefundsReducer } from "@/features/admin/admin-refunds/admin-refunds.slice";
import { adminRevenueReducer } from "@/features/admin/admin-revenue/admin-revenue.slice";
import { adminSellersReducer } from "@/features/admin/admin-sellers/admin-sellers.slice";
import { adminUsersReducer } from "@/features/admin/admin-users/admin-users.slice";
import { adminVouchersReducer } from "@/features/admin/admin-vouchers/admin-vouchers.slice";
import { adminWithdrawalsReducer } from "@/features/admin/admin-withdrawals/admin-withdrawals.slice";
import { authReducer } from "@/features/auth/auth-slice";
import { chatReducer } from "@/features/chat/chat.slice";
import { homeCategoryReducer } from "@/features/home/category/category.slice";
import { flashSaleReducer } from "@/features/home/flash-sale/flash-sale.slice";
import { productListReducer } from "@/features/home/product-list/product-list.slice";
import { ordersReducer } from "@/features/orders/orders.slice";
import { paymentsReducer } from "@/features/payments/payments.slice";
import { reviewsReducer } from "@/features/reviews/reviews.slice";
import { sellerDashboardReducer } from "@/features/seller/seller-dashboard/seller-dashboard.slice";
import { sellerOrderDetailReducer } from "@/features/seller/seller-order-detail/seller-order-detail.slice";
import { sellerOrdersReducer } from "@/features/seller/seller-orders/seller-orders.slice";
import { sellerProductEditReducer } from "@/features/seller/seller-product-edit/seller-product-edit.slice";
import { sellerProductsReducer } from "@/features/seller/seller-products/seller-products.slice";
import { sellerWalletReducer } from "@/features/seller/seller-wallet/seller-wallet.slice";
import { vouchersReducer } from "@/features/vouchers/vouchers.slice";

type AppState = {
  isBootstrapped: boolean;
};

const initialState: AppState = {
  isBootstrapped: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setBootstrapped: (state, action: PayloadAction<boolean>) => {
      state.isBootstrapped = action.payload;
    },
  },
});

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    auth: authReducer,
    chat: chatReducer,
    homeCategory: homeCategoryReducer,
    flashSale: flashSaleReducer,
    productList: productListReducer,
    orders: ordersReducer,
    payments: paymentsReducer,
    reviews: reviewsReducer,
    sellerDashboard: sellerDashboardReducer,
    sellerOrderDetail: sellerOrderDetailReducer,
    sellerOrders: sellerOrdersReducer,
    sellerProductEdit: sellerProductEditReducer,
    sellerProducts: sellerProductsReducer,
    vouchers: vouchersReducer,
    sellerWallet: sellerWalletReducer,
    adminDashboard: adminDashboardReducer,
    adminSellers: adminSellersReducer,
    adminUsers: adminUsersReducer,
    adminCategories: adminCategoriesReducer,
    adminBrands: adminBrandsReducer,
    adminVouchers: adminVouchersReducer,
    adminOrders: adminOrdersReducer,
    adminRevenue: adminRevenueReducer,
    adminRefunds: adminRefundsReducer,
    adminWithdrawals: adminWithdrawalsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const appActions = appSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
