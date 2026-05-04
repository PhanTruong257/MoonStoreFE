import { Avatar, Button, Input, Rate, Skeleton } from "antd";

import styles from "./reviews-panel.module.scss";
import { useProductReviews } from "./use-product-reviews";

import { formatDateTime } from "@/app/utils/format";

type ReviewsPanelProps = {
  productId: number;
};

const getInitial = (name: string) => {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return "?";
  }
  return trimmed.charAt(0).toUpperCase();
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
        <div>
          <h2 className={styles.title}>Đánh giá sản phẩm</h2>
          <p className={styles.subtitle}>
            Phản hồi từ khách hàng đã mua và nhận hàng.
          </p>
        </div>
        <div className={styles.summary}>
          <div className={styles.summaryScore}>
            <strong>{averageRating.toFixed(1)}</strong>
            <span>/ 5</span>
          </div>
          <Rate disabled allowHalf value={averageRating} />
          <span className={styles.summaryCount}>
            {totalReviews} đánh giá
          </span>
        </div>
      </header>

      {eligibility?.canReview ? (
        <div className={styles.formBlock}>
          <div className={styles.ratingRow}>
            <span>Đánh giá của bạn:</span>
            <Rate value={rating} onChange={setRating} />
          </div>
          <Input.TextArea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            disabled={submitting}
          />
          <div className={styles.formActions}>
            <Button type="primary" onClick={submit} loading={submitting}>
              Gửi đánh giá
            </Button>
          </div>
        </div>
      ) : eligibility && !eligibility.canReview ? (
        <div className={styles.noEligible}>
          {eligibility.reason === "Already reviewed"
            ? "Bạn đã đánh giá sản phẩm này rồi."
            : "Chỉ khách đã nhận hàng (DELIVERED) mới có thể đánh giá."}
        </div>
      ) : null}

      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>★</span>
          <p>Chưa có đánh giá nào cho sản phẩm này.</p>
        </div>
      ) : (
        <ul className={styles.reviewList}>
          {items.map((item) => (
            <li key={item.id} className={styles.reviewItem}>
              <Avatar size={40} className={styles.reviewAvatar}>
                {getInitial(item.user.fullName)}
              </Avatar>
              <div className={styles.reviewBody}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewUser}>
                    {item.user.fullName}
                  </span>
                  <span className={styles.reviewDate}>
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>
                <Rate disabled value={item.rating} className={styles.reviewRating} />
                {item.comment ? (
                  <p className={styles.reviewComment}>{item.comment}</p>
                ) : (
                  <p className={styles.reviewCommentEmpty}>(Không có nhận xét)</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
