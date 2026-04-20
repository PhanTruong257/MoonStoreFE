import { configureStore, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import { rootSaga } from "@/app/app-saga";
import { authReducer } from "@/features/auth/auth-slice";
import { homeCategoryReducer } from "@/features/home/category/category.slice";
import { flashSaleReducer } from "@/features/home/flash-sale/flash-sale.slice";
import { productListReducer } from "@/features/home/product-list/product-list.slice";

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
