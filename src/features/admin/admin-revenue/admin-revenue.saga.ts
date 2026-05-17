import { call, put, takeLatest } from "redux-saga/effects";

import { extractApiErrorMessage } from "@/app/utils/error-message";
import {
  fetchAdminRevenueReport,
  fetchCommissionRate,
  setCommissionRate,
  type AdminRevenueReport,
} from "@/services/admin-service";
import { adminRevenueActions } from "./admin-revenue.slice";

function* handleRevenueRequested() {
  try {
    const [report, config] = (yield Promise.all([
      fetchAdminRevenueReport(),
      fetchCommissionRate(),
    ])) as [AdminRevenueReport, { commissionRate: number }];
    yield put(adminRevenueActions.revenueSucceeded({ report, commissionRate: config.commissionRate }));
  } catch (error) {
    yield put(adminRevenueActions.revenueFailed(extractApiErrorMessage(error, "Unable to load revenue.")));
  }
}

function* handleCommissionRateUpdateRequested(
  action: ReturnType<typeof adminRevenueActions.commissionRateUpdateRequested>,
) {
  try {
    const result = (yield call(setCommissionRate, action.payload)) as { commissionRate: number };
    yield put(adminRevenueActions.commissionRateUpdateSucceeded(result.commissionRate));
  } catch {
    yield put(adminRevenueActions.commissionRateUpdateFailed());
  }
}

export function* adminRevenueSaga() {
  yield takeLatest(adminRevenueActions.revenueRequested.type, handleRevenueRequested);
  yield takeLatest(adminRevenueActions.commissionRateUpdateRequested.type, handleCommissionRateUpdateRequested);
}
