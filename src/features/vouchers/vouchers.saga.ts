import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import { vouchersActions } from "@/features/vouchers/vouchers.slice";
import {
  validateVoucher,
  type VoucherValidateResponse,
} from "@/services/vouchers-service";

function* handleValidateRequested(
  action: PayloadAction<{ code: string; subtotal: number }>,
) {
  try {
    const result = (yield call(
      validateVoucher,
      action.payload,
    )) as VoucherValidateResponse;

    if (!result.isValid || !result.voucher) {
      yield put(
        vouchersActions.voucherValidateFailed(
          result.reason ?? "Invalid voucher.",
        ),
      );
      return;
    }

    yield put(
      vouchersActions.voucherValidateSucceeded({
        voucher: result.voucher,
        discountAmount: result.discountAmount,
        message: `Voucher applied: -${result.discountAmount.toLocaleString("vi-VN")}`,
      }),
    );
  } catch {
    yield put(
      vouchersActions.voucherValidateFailed("Unable to validate voucher."),
    );
  }
}

export function* vouchersSaga() {
  yield takeLatest(
    vouchersActions.voucherValidateRequested.type,
    handleValidateRequested,
  );
}
