
import styles from "./ai-chat-widget.module.scss";
import type { OrderDraft } from "./use-ai-chat";

import { formatMoney } from "@/app/utils/format";

type OrderDraftCardProps = {
  draft: OrderDraft;
  confirming?: boolean;
  done?: boolean;
  onCheckout: () => void;
};

export const OrderDraftCard = ({
  draft,
  confirming,
  done,
  onCheckout,
}: OrderDraftCardProps) => {
  return (
    <div className={styles.orderCard}>
      <div className={styles.orderTitle}>🛒 Đơn hàng dự kiến</div>

      <div className={styles.orderItems}>
        {draft.items.map((item) => (
          <div key={item.productId} className={styles.orderItem}>
            <span className={styles.orderItemName}>
              {item.quantity}× {item.name}
            </span>
            <span>{formatMoney(item.lineTotal)}</span>
          </div>
        ))}
      </div>

      <div className={styles.orderSummary}>
        <div className={styles.orderRow}>
          <span>Tạm tính</span>
          <span>{formatMoney(draft.subtotal)}</span>
        </div>
        {draft.discountAmount > 0 && (
          <div className={styles.orderRow}>
            <span>Giảm giá{draft.voucherCode ? ` (${draft.voucherCode})` : ""}</span>
            <span>-{formatMoney(draft.discountAmount)}</span>
          </div>
        )}
        <div className={`${styles.orderRow} ${styles.orderTotal}`}>
          <span>Tổng cộng</span>
          <strong>{formatMoney(draft.finalAmount)}</strong>
        </div>
      </div>

      {draft.warnings.length > 0 && (
        <ul className={styles.orderWarnings}>
          {draft.warnings.map((w, i) => (
            <li key={i}>⚠️ {w}</li>
          ))}
        </ul>
      )}

      {!done ? (
        <button
          type="button"
          className={styles.orderConfirmBtn}
          onClick={onCheckout}
          disabled={confirming || !draft.items.length}
        >
          {confirming ? "Đang chuẩn bị..." : "Tới trang thanh toán"}
        </button>
      ) : (
        <div className={styles.orderDoneNote}>Đã chuyển tới trang thanh toán ✓</div>
      )}
    </div>
  );
};
