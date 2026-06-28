import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

import { adminAnalyticsActions } from "./admin-analytics.slice";

import { extractApiErrorMessage } from "@/app/utils/error-message";
import {
  askAdminAnalytics,
  fetchAdminAnalyticsDashboard,
  type AdminAnalyticsDashboard,
  type AdminAnalyticsAskResponse,
} from "@/services/admin-service";

function* handleDashboardRequested() {
  try {
    const data = (yield call(fetchAdminAnalyticsDashboard)) as AdminAnalyticsDashboard;
    yield put(adminAnalyticsActions.dashboardSucceeded(data));
  } catch (error) {
    yield put(
      adminAnalyticsActions.dashboardFailed(
        extractApiErrorMessage(error, "Không tải được số liệu thống kê."),
      ),
    );
  }
}

function* handleAskRequested(
  action: ReturnType<typeof adminAnalyticsActions.askRequested>,
) {
  const { id, question, history } = action.payload;
  try {
    const res = (yield call(
      askAdminAnalytics,
      question,
      history,
    )) as AdminAnalyticsAskResponse;
    yield put(
      adminAnalyticsActions.askSucceeded({ id, answer: res.text, data: res.data }),
    );
  } catch (error) {
    yield put(
      adminAnalyticsActions.askFailed({
        id,
        error: extractApiErrorMessage(error, "Có lỗi khi truy vấn số liệu."),
      }),
    );
  }
}

export function* adminAnalyticsSaga() {
  yield takeLatest(adminAnalyticsActions.dashboardRequested.type, handleDashboardRequested);
  yield takeEvery(adminAnalyticsActions.askRequested.type, handleAskRequested);
}
