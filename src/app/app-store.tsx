import { configureStore, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import { rootSaga } from "@/app/app-saga";
import { authReducer } from "@/features/auth/auth-slice";
import { homeCategoryReducer } from "@/features/home/category/category.slice";
import { flashSaleReducer } from "@/features/home/flash-sale/flash-sale.slice";
import { productListReducer } from "@/features/home/product-list/product-list.slice";
import { reviewsReducer } from "@/features/reviews/reviews.slice";
import { sellerDashboardReducer } from "@/features/seller/seller-dashboard/seller-dashboard.slice";
import { sellerOrderDetailReducer } from "@/features/seller/seller-order-detail/seller-order-detail.slice";
import { sellerOrdersReducer } from "@/features/seller/seller-orders/seller-orders.slice";
import { sellerProductEditReducer } from "@/features/seller/seller-product-edit/seller-product-edit.slice";
import { sellerProductsReducer } from "@/features/seller/seller-products/seller-products.slice";
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
    homeCategory: homeCategoryReducer,
    flashSale: flashSaleReducer,
    productList: productListReducer,
    reviews: reviewsReducer,
    sellerDashboard: sellerDashboardReducer,
    sellerOrderDetail: sellerOrderDetailReducer,
    sellerOrders: sellerOrdersReducer,
    sellerProductEdit: sellerProductEditReducer,
    sellerProducts: sellerProductsReducer,
    vouchers: vouchersReducer,
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
