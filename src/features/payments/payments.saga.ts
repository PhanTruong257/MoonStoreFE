import type { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { call, put, takeLatest } from "redux-saga/effects";

import { paymentsActions } from "./payments.slice";

import { extractApiErrorMessage } from "@/app/utils/error-message";
import {
  confirmPaymentManual,
  fetchOrderQrInfo,
} from "@/services/payments-service";
import type {
  ConfirmManualResponse,
  QrPaymentInfo,
} from "@/services/payments-service";

function* handleQrInfoRequested(action: PayloadAction<number>) {
  try {
    const info = (yield call(
      fetchOrderQrInfo,
      action.payload,
    )) as QrPaymentInfo;
    yield put(paymentsActions.qrInfoSucceeded(info));
  } catch (error) {
    yield put(
      paymentsActions.qrInfoFailed(
        extractApiErrorMessage(error, "Unable to load QR information."),
      ),
    );
  }
}

function* handleManualConfirmRequested(
  action: PayloadAction<{ paymentId: number; orderId: number }>,
) {
  try {
    const result = (yield call(
      confirmPaymentManual,
      action.payload.paymentId,
    )) as ConfirmManualResponse;
    yield put(paymentsActions.manualConfirmSucceeded(result.paymentStatus));
    void message.success("Payment marked as received.");
  } catch (error) {
    const reason = extractApiErrorMessage(
      error,
      "Unable to confirm payment.",
    );
    void message.error(reason);
    yield put(paymentsActions.manualConfirmFailed(reason));
  }
}

export function* paymentsSaga() {
  yield takeLatest(
    paymentsActions.qrInfoRequested.type,
    handleQrInfoRequested,
  );
  yield takeLatest(
    paymentsActions.manualConfirmRequested.type,
    handleManualConfirmRequested,
  );
}
