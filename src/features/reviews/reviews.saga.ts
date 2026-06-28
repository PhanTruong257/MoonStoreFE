import type { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { call, put, takeLatest } from "redux-saga/effects";

import { reviewsActions } from "@/features/reviews/reviews.slice";
import {
  createReview,
  fetchProductReviews,
  fetchReviewEligibility,
  type ProductReviewsResponse,
  type ReviewEligibility,
} from "@/services/reviews-service";

function* handleReviewsRequested(action: PayloadAction<number>) {
  try {
    const data = (yield call(
      fetchProductReviews,
      action.payload,
    )) as ProductReviewsResponse;
    yield put(reviewsActions.reviewsSucceeded(data));
  } catch {
    yield put(reviewsActions.reviewsFailed("Không tải được đánh giá."));
  }
}

function* handleEligibilityRequested(action: PayloadAction<number>) {
  try {
    const data = (yield call(
      fetchReviewEligibility,
      action.payload,
    )) as ReviewEligibility;
    yield put(reviewsActions.reviewEligibilitySucceeded(data));
  } catch {
    yield put(reviewsActions.reviewEligibilityFailed());
  }
}

function* handleSubmitRequested(
  action: PayloadAction<{ productId: number; rating: number; comment?: string }>,
) {
  try {
    yield call(createReview, action.payload);
    void message.success("Đã gửi đánh giá.");
    yield put(reviewsActions.reviewSubmitSucceeded());
    yield put(reviewsActions.reviewsRequested(action.payload.productId));
    yield put(
      reviewsActions.reviewEligibilityRequested(action.payload.productId),
    );
  } catch {
    void message.error("Không thể gửi đánh giá.");
    yield put(
      reviewsActions.reviewSubmitFailed("Không thể gửi đánh giá."),
    );
  }
}

export function* reviewsSaga() {
  yield takeLatest(
    reviewsActions.reviewsRequested.type,
    handleReviewsRequested,
  );
  yield takeLatest(
    reviewsActions.reviewEligibilityRequested.type,
    handleEligibilityRequested,
  );
  yield takeLatest(
    reviewsActions.reviewSubmitRequested.type,
    handleSubmitRequested,
  );
}
