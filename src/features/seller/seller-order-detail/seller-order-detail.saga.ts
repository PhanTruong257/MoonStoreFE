import { message } from "antd";
import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import { sellerOrderDetailActions } from "@/features/seller/seller-order-detail/seller-order-detail.slice";
import {
  fetchSellerOrderDetail,
  updateOrderGroupStatus,
  type SellerOrderDetail,
} from "@/services/seller-service";

function* handleLoadRequested(action: PayloadAction<number>) {
  try {
    const group = (yield call(
      fetchSellerOrderDetail,
      action.payload,
    )) as SellerOrderDetail;
    yield put(sellerOrderDetailActions.sellerOrderDetailSucceeded(group));
  } catch {
    yield put(
      sellerOrderDetailActions.sellerOrderDetailFailed(
        "Unable to load order detail.",
      ),
    );
  }
}

function* handleStatusUpdateRequested(
  action: PayloadAction<{ groupId: number; status: string; note?: string }>,
) {
  try {
    yield call(updateOrderGroupStatus, action.payload.groupId, {
      status: action.payload.status,
      note: action.payload.note,
    });
    void message.success(`Status updated to ${action.payload.status}.`);
    yield put(sellerOrderDetailActions.sellerOrderStatusUpdateSucceeded());
    yield put(
      sellerOrderDetailActions.sellerOrderDetailRequested(
        action.payload.groupId,
      ),
    );
  } catch {
    void message.error("Unable to update status.");
    yield put(
      sellerOrderDetailActions.sellerOrderStatusUpdateFailed(
        "Unable to update status.",
      ),
    );
  }
}

export function* sellerOrderDetailSaga() {
  yield takeLatest(
    sellerOrderDetailActions.sellerOrderDetailRequested.type,
    handleLoadRequested,
  );
  yield takeLatest(
    sellerOrderDetailActions.sellerOrderStatusUpdateRequested.type,
    handleStatusUpdateRequested,
  );
}
