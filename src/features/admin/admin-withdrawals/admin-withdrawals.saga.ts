import { call, put, takeLatest } from "redux-saga/effects";

import { extractApiErrorMessage } from "@/app/utils/error-message";
import {
  fetchAdminWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  type AdminWithdrawal,
} from "@/services/admin-service";
import { adminWithdrawalsActions } from "./admin-withdrawals.slice";

function* handleWithdrawalsRequested() {
  try {
    const items = (yield call(fetchAdminWithdrawals)) as AdminWithdrawal[];
    yield put(adminWithdrawalsActions.withdrawalsSucceeded(items));
  } catch (error) {
    yield put(adminWithdrawalsActions.withdrawalsFailed(extractApiErrorMessage(error, "Không tải được yêu cầu rút tiền.")));
  }
}

function* handleWithdrawalApprove(
  action: ReturnType<typeof adminWithdrawalsActions.withdrawalApproveRequested>,
) {
  try {
    const result = (yield call(approveWithdrawal, action.payload.id, action.payload.note)) as { id: number; status: string };
    yield put(adminWithdrawalsActions.withdrawalProcessSucceeded(result));
  } catch {
    yield put(adminWithdrawalsActions.withdrawalProcessFailed());
  }
}

function* handleWithdrawalReject(
  action: ReturnType<typeof adminWithdrawalsActions.withdrawalRejectRequested>,
) {
  try {
    const result = (yield call(rejectWithdrawal, action.payload.id, action.payload.note)) as { id: number; status: string };
    yield put(adminWithdrawalsActions.withdrawalProcessSucceeded(result));
  } catch {
    yield put(adminWithdrawalsActions.withdrawalProcessFailed());
  }
}

export function* adminWithdrawalsSaga() {
  yield takeLatest(adminWithdrawalsActions.withdrawalsRequested.type, handleWithdrawalsRequested);
  yield takeLatest(adminWithdrawalsActions.withdrawalApproveRequested.type, handleWithdrawalApprove);
  yield takeLatest(adminWithdrawalsActions.withdrawalRejectRequested.type, handleWithdrawalReject);
}
