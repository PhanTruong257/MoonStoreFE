import { call, put, takeLatest } from "redux-saga/effects";

import { adminDashboardActions } from "./admin-dashboard.slice";

import { fetchAdminStats } from "@/services/admin-service";
import type { AdminStats } from "@/services/admin-service";

function* handleRequested() {
  try {
    const stats = (yield call(fetchAdminStats)) as AdminStats;
    yield put(adminDashboardActions.succeeded(stats));
  } catch {
    yield put(adminDashboardActions.failed("Unable to load admin stats."));
  }
}

export function* adminDashboardSaga() {
  yield takeLatest(adminDashboardActions.requested.type, handleRequested);
}
