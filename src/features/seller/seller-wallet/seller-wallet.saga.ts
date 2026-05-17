import { call, put, takeLatest } from "redux-saga/effects";

import { extractApiErrorMessage } from "@/app/utils/error-message";
import { sellerWalletActions } from "./seller-wallet.slice";
import {
  fetchWalletDetail,
  createWithdrawal,
  type WalletDetail,
  type CreateWithdrawalPayload,
} from "@/services/wallet-service";

function* handleWalletRequested() {
  try {
    const data = (yield call(fetchWalletDetail)) as WalletDetail;
    yield put(sellerWalletActions.walletSucceeded(data));
  } catch (error) {
    yield put(
      sellerWalletActions.walletFailed(
        extractApiErrorMessage(error, "Unable to load wallet."),
      ),
    );
  }
}

function* handleWithdrawalRequested(
  action: ReturnType<typeof sellerWalletActions.withdrawalRequested>,
) {
  try {
    yield call(createWithdrawal, action.payload as CreateWithdrawalPayload);
    yield put(sellerWalletActions.withdrawalSucceeded());
    yield put(sellerWalletActions.walletRequested());
  } catch (error) {
    yield put(
      sellerWalletActions.withdrawalFailed(
        extractApiErrorMessage(error, "Unable to process withdrawal."),
      ),
    );
  }
}

export function* sellerWalletSaga() {
  yield takeLatest(
    sellerWalletActions.walletRequested.type,
    handleWalletRequested,
  );
  yield takeLatest(
    sellerWalletActions.withdrawalRequested.type,
    handleWithdrawalRequested,
  );
}
