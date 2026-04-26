import { http } from "@/app/api/http";

export type ReviewItem = {
  id: number;
  rating: number;
  comment: string | null;
  user: {
    id: number;
    fullName: string;
  };
};

export type ProductReviewsResponse = {
  productId: number;
  averageRating: number;
  totalReviews: number;
  reviews: ReviewItem[];
};

export type ReviewEligibility = {
  productId: number;
  canReview: boolean;
  reason: string | null;
  existingReviewId: number | null;
};

export type CreateReviewPayload = {
  productId: number;
  rating: number;
  comment?: string;
};

export type CreateReviewResponse = {
  review: ReviewItem;
};

export const fetchProductReviews = async (productId: number) => {
  const response = await http.get<ProductReviewsResponse>(
    `/reviews/product/${productId}`,
  );
  return response.data;
};

export const fetchReviewEligibility = async (productId: number) => {
  const response = await http.get<ReviewEligibility>(
    `/reviews/eligibility/${productId}`,
  );
  return response.data;
};

export const createReview = async (payload: CreateReviewPayload) => {
  const response = await http.post<CreateReviewResponse>("/reviews", payload);
  return response.data;
};
