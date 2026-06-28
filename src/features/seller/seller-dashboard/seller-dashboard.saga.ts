import { call, put, takeLatest } from "redux-saga/effects";

import { sellerDashboardActions } from "@/features/seller/seller-dashboard/seller-dashboard.slice";
import {
  fetchSellerStats,
  type SellerStats,
} from "@/services/seller-service";

function* handleDashboardRequested() {
  try {
    const stats = (yield call(fetchSellerStats)) as SellerStats;
    yield put(sellerDashboardActions.sellerDashboardSucceeded(stats));
  } catch {
    yield put(
      sellerDashboardActions.sellerDashboardFailed("Không tải được thống kê."),
    );
  }
}

export function* sellerDashboardSaga() {
  yield takeLatest(
    sellerDashboardActions.sellerDashboardRequested.type,
    handleDashboardRequested,
  );
}
