import { call, put, takeLatest } from "redux-saga/effects";

import { sellerOrdersActions } from "@/features/seller/seller-orders/seller-orders.slice";
import {
  fetchSellerOrders,
  type SellerOrderGroup,
} from "@/services/seller-service";

function* handleSellerOrdersRequested() {
  try {
    const groups = (yield call(fetchSellerOrders)) as SellerOrderGroup[];
    yield put(sellerOrdersActions.sellerOrdersSucceeded(groups));
  } catch {
    yield put(
      sellerOrdersActions.sellerOrdersFailed("Unable to load orders."),
    );
  }
}

export function* sellerOrdersSaga() {
  yield takeLatest(
    sellerOrdersActions.sellerOrdersRequested.type,
    handleSellerOrdersRequested,
  );
}
