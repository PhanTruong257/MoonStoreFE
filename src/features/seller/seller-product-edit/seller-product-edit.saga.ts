import type { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { all, call, put, takeLatest } from "redux-saga/effects";

import { sellerProductEditActions } from "@/features/seller/seller-product-edit/seller-product-edit.slice";
import {
  fetchCategories,
  type CatalogCategory,
} from "@/services/catalog-service";
import {
  deleteSellerProduct,
  fetchSellerProductDetail,
  updateSellerProduct,
  type CreateProductResponse,
  type UpdateSellerProductPayload,
} from "@/services/seller-service";

function* handleLoadRequested(action: PayloadAction<number>) {
  try {
    const [detail, categories] = (yield all([
      call(fetchSellerProductDetail, action.payload),
      call(fetchCategories),
    ])) as [CreateProductResponse, CatalogCategory[]];

    yield put(
      sellerProductEditActions.sellerProductEditLoadSucceeded({
        detail,
        categories,
      }),
    );
  } catch {
    yield put(
      sellerProductEditActions.sellerProductEditLoadFailed(
        "Không tải được sản phẩm.",
      ),
    );
  }
}

function* handleUpdateRequested(
  action: PayloadAction<{
    productId: number;
    payload: UpdateSellerProductPayload;
  }>,
) {
  try {
    yield call(
      updateSellerProduct,
      action.payload.productId,
      action.payload.payload,
    );
    void message.success("Đã cập nhật sản phẩm.");
    yield put(sellerProductEditActions.sellerProductEditUpdateSucceeded());
  } catch {
    void message.error("Không thể cập nhật sản phẩm.");
    yield put(
      sellerProductEditActions.sellerProductEditUpdateFailed(
        "Không thể cập nhật sản phẩm.",
      ),
    );
  }
}

function* handleDeleteRequested(action: PayloadAction<number>) {
  try {
    yield call(deleteSellerProduct, action.payload);
    void message.success("Đã xoá sản phẩm.");
    yield put(sellerProductEditActions.sellerProductEditDeleteSucceeded());
  } catch {
    void message.error("Không thể xoá sản phẩm.");
    yield put(
      sellerProductEditActions.sellerProductEditDeleteFailed(
        "Không thể xoá sản phẩm.",
      ),
    );
  }
}

export function* sellerProductEditSaga() {
  yield takeLatest(
    sellerProductEditActions.sellerProductEditLoadRequested.type,
    handleLoadRequested,
  );
  yield takeLatest(
    sellerProductEditActions.sellerProductEditUpdateRequested.type,
    handleUpdateRequested,
  );
  yield takeLatest(
    sellerProductEditActions.sellerProductEditDeleteRequested.type,
    handleDeleteRequested,
  );
}
