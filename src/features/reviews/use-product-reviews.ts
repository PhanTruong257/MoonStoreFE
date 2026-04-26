import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { getStoredUser } from "@/features/auth/auth-storage";
import { reviewsActions } from "@/features/reviews/reviews.slice";

export const useProductReviews = (productId: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((root: RootState) => root.reviews);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!productId) {
      return;
    }
    dispatch(reviewsActions.reviewsRequested(productId));
    if (getStoredUser()) {
      dispatch(reviewsActions.reviewEligibilityRequested(productId));
    }

    return () => {
      dispatch(reviewsActions.reviewsReset());
    };
  }, [dispatch, productId]);

  const submit = useCallback(() => {
    dispatch(
      reviewsActions.reviewSubmitRequested({
        productId,
        rating,
        comment: comment.trim() || undefined,
      }),
    );
    setComment("");
  }, [dispatch, productId, rating, comment]);

  return {
    averageRating: state.averageRating,
    totalReviews: state.totalReviews,
    items: state.items,
    eligibility: state.eligibility,
    loading: state.isLoading,
    submitting: state.isSubmitting,
    rating,
    comment,
    setRating,
    setComment,
    submit,
  };
};
