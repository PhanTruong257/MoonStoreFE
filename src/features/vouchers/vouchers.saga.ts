import type { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";

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
          result.reason ?? "Mã giảm giá không hợp lệ.",
        ),
      );
      return;
    }

    yield put(
      vouchersActions.voucherValidateSucceeded({
        voucher: result.voucher,
        discountAmount: result.discountAmount,
        message: `Đã áp dụng mã giảm giá: -${result.discountAmount.toLocaleString("vi-VN")}`,
      }),
    );
  } catch {
    yield put(
      vouchersActions.voucherValidateFailed("Không thể kiểm tra mã giảm giá."),
    );
  }
}

export function* vouchersSaga() {
  yield takeLatest(
    vouchersActions.voucherValidateRequested.type,
    handleValidateRequested,
  );
}
