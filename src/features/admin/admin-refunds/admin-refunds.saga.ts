import { call, put, takeLatest } from "redux-saga/effects";

import { extractApiErrorMessage } from "@/app/utils/error-message";
import {
  fetchAdminRefundRequests,
  approveRefundRequest,
  rejectRefundRequest,
  type AdminRefundRequest,
} from "@/services/admin-service";
import { adminRefundsActions } from "./admin-refunds.slice";

function* handleRefundsRequested() {
  try {
    const items = (yield call(fetchAdminRefundRequests)) as AdminRefundRequest[];
    yield put(adminRefundsActions.refundsSucceeded(items));
  } catch (error) {
    yield put(adminRefundsActions.refundsFailed(extractApiErrorMessage(error, "Unable to load refund requests.")));
  }
}

function* handleRefundApprove(
  action: ReturnType<typeof adminRefundsActions.refundApproveRequested>,
) {
  try {
    const result = (yield call(approveRefundRequest, action.payload.id, action.payload.note)) as { id: number; status: string };
    yield put(adminRefundsActions.refundProcessSucceeded(result));
  } catch {
    yield put(adminRefundsActions.refundProcessFailed());
  }
}

function* handleRefundReject(
  action: ReturnType<typeof adminRefundsActions.refundRejectRequested>,
) {
  try {
    const result = (yield call(rejectRefundRequest, action.payload.id, action.payload.note)) as { id: number; status: string };
    yield put(adminRefundsActions.refundProcessSucceeded(result));
  } catch {
    yield put(adminRefundsActions.refundProcessFailed());
  }
}

export function* adminRefundsSaga() {
  yield takeLatest(adminRefundsActions.refundsRequested.type, handleRefundsRequested);
  yield takeLatest(adminRefundsActions.refundApproveRequested.type, handleRefundApprove);
  yield takeLatest(adminRefundsActions.refundRejectRequested.type, handleRefundReject);
}
