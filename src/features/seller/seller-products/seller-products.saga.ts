import type { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { call, put, takeLatest } from "redux-saga/effects";

import { sellerProductsActions } from "@/features/seller/seller-products/seller-products.slice";
import {
  deleteSellerProduct,
  fetchSellerProducts,
  type SellerProductListItem,
} from "@/services/seller-service";

function* handleProductsRequested() {
  try {
    const products = (yield call(
      fetchSellerProducts,
    )) as SellerProductListItem[];
    yield put(sellerProductsActions.sellerProductsSucceeded(products));
  } catch {
    yield put(
      sellerProductsActions.sellerProductsFailed("Unable to load products."),
    );
  }
}

function* handleDeleteRequested(action: PayloadAction<number>) {
  try {
    yield call(deleteSellerProduct, action.payload);
    void message.success("Product deleted.");
    yield put(
      sellerProductsActions.sellerProductDeleteSucceeded(action.payload),
    );
  } catch {
    void message.error("Unable to delete product.");
    yield put(
      sellerProductsActions.sellerProductDeleteFailed(
        "Unable to delete product.",
      ),
    );
  }
}

export function* sellerProductsSaga() {
  yield takeLatest(
    sellerProductsActions.sellerProductsRequested.type,
    handleProductsRequested,
  );
  yield takeLatest(
    sellerProductsActions.sellerProductDeleteRequested.type,
    handleDeleteRequested,
  );
}
