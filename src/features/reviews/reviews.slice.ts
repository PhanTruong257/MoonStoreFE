import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  ProductReviewsResponse,
  ReviewEligibility,
} from "@/services/reviews-service";

export type ReviewsState = {
  productId: number | null;
  averageRating: number;
  totalReviews: number;
  items: ProductReviewsResponse["reviews"];
  eligibility: ReviewEligibility | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
};

const initialState: ReviewsState = {
  productId: null,
  averageRating: 0,
  totalReviews: 0,
  items: [],
  eligibility: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    reviewsRequested: (state, action: PayloadAction<number>) => {
      state.productId = action.payload;
      state.isLoading = true;
      state.error = null;
    },
    reviewsSucceeded: (
      state,
      action: PayloadAction<ProductReviewsResponse>,
    ) => {
      state.isLoading = false;
      state.error = null;
      state.averageRating = action.payload.averageRating;
      state.totalReviews = action.payload.totalReviews;
      state.items = action.payload.reviews;
    },
    reviewsFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    reviewEligibilityRequested: (state, action: PayloadAction<number>) => {
      void state;
      void action.payload;
    },
    reviewEligibilitySucceeded: (
      state,
      action: PayloadAction<ReviewEligibility>,
    ) => {
      state.eligibility = action.payload;
    },
    reviewEligibilityFailed: (state) => {
      state.eligibility = null;
    },
    reviewSubmitRequested: (
      state,
      action: PayloadAction<{
        productId: number;
        rating: number;
        comment?: string;
      }>,
    ) => {
      void action.payload;
      state.isSubmitting = true;
    },
    reviewSubmitSucceeded: (state) => {
      state.isSubmitting = false;
    },
    reviewSubmitFailed: (state, action: PayloadAction<string>) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    reviewsReset: () => initialState,
  },
});

export const reviewsReducer = reviewsSlice.reducer;
export const reviewsActions = reviewsSlice.actions;
