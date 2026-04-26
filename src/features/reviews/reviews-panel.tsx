import { Button, Input, Rate, Skeleton } from "antd";

import styles from "./reviews-panel.module.scss";
import { useProductReviews } from "./use-product-reviews";

type ReviewsPanelProps = {
  productId: number;
};

export const ReviewsPanel = ({ productId }: ReviewsPanelProps) => {
  const {
    averageRating,
    totalReviews,
    items,
    eligibility,
    loading,
    submitting,
    rating,
    comment,
    setRating,
    setComment,
    submit,
  } = useProductReviews(productId);

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <h2 className={styles.title}>Customer reviews</h2>
        <div className={styles.summary}>
          <Rate disabled allowHalf value={averageRating} />
          <span>
            {averageRating.toFixed(1)} · {totalReviews} reviews
          </span>
        </div>
      </header>

      {eligibility?.canReview ? (
        <div className={styles.formBlock}>
          <div className={styles.ratingRow}>
            <span>Your rating:</span>
            <Rate value={rating} onChange={setRating} />
          </div>
          <Input.TextArea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            disabled={submitting}
          />
          <div style={{ marginTop: 10, textAlign: "right" }}>
            <Button type="primary" onClick={submit} loading={submitting}>
              Submit review
            </Button>
          </div>
        </div>
      ) : eligibility && !eligibility.canReview ? (
        <div className={styles.noEligible}>{eligibility.reason}</div>
      ) : null}

      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : items.length === 0 ? (
        <div className={styles.empty}>No reviews yet.</div>
      ) : (
        items.map((item) => (
          <article key={item.id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <span className={styles.reviewUser}>{item.user.fullName}</span>
              <Rate disabled value={item.rating} />
            </div>
            <p className={styles.reviewComment}>{item.comment ?? "—"}</p>
          </article>
        ))
      )}
    </section>
  );
};
