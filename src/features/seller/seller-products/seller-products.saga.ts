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
      sellerProductsActions.sellerProductsFailed("Không tải được sản phẩm."),
    );
  }
}

function* handleDeleteRequested(action: PayloadAction<number>) {
  try {
    yield call(deleteSellerProduct, action.payload);
    void message.success("Đã xoá sản phẩm.");
    yield put(
      sellerProductsActions.sellerProductDeleteSucceeded(action.payload),
    );
  } catch {
    void message.error("Không thể xoá sản phẩm.");
    yield put(
      sellerProductsActions.sellerProductDeleteFailed(
        "Không thể xoá sản phẩm.",
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
