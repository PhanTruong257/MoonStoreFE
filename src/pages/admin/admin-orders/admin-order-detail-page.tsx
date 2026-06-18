import { Empty, Skeleton, Tag } from "antd";
import { Link } from "react-router-dom";

import styles from "./admin-order-detail-page.module.scss";
import { useAdminOrderDetail } from "./use-admin-order-detail";

import {
  formatDateTime,
  formatMoney,
  renderAddressLine,
} from "@/app/utils/format";
import { resolveImageUrl } from "@/app/utils/image-url";
import { ADMIN_ROUTES } from "@/const/admin.const";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/const/orders.const";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/const/payment.const";
import { UI_TEXT } from "@/const/ui-text";
import { AdminShell } from "@/features/admin/components/admin-shell";

const t = UI_TEXT.admin.orderDetail;

export const AdminOrderDetailPage = () => {
  const { order, isLoading, error } = useAdminOrderDetail();

  return (
    <AdminShell
      title={order ? t.title(order.id) : t.titleFallback}
      subtitle={order ? formatDateTime(order.createdAt) : t.loadingSubtitle}
      actions={
        <Link to={ADMIN_ROUTES.orders} className={styles.backLink}>
          {t.backToOrders}
        </Link>
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : error || !order ? (
        <Empty description={error ?? t.notFound} />
      ) : (
        <div className={styles.grid}>
          <div className={styles.column}>
            {order.groups.map((group) => (
              <article key={group.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{group.sellerShopName}</h3>
                  <Tag color={ORDER_STATUS_COLORS[group.status] ?? "default"}>
                    {ORDER_STATUS_LABELS[group.status] ?? group.status}
                  </Tag>
                </div>
                {group.items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <img src={resolveImageUrl(item.imageUrl)} alt={item.productName} />
                    <div className={styles.itemInfo}>
                      <strong>{item.productName}</strong>
                      <small>
                        {formatMoney(item.unitPriceAtTime)} × {item.quantity}
                      </small>
                    </div>
                    <strong>
                      {formatMoney(item.unitPriceAtTime * item.quantity)}
                    </strong>
                  </div>
                ))}
                <div className={styles.row}>
                  <span>{t.subtotalLabel}</span>
                  <strong>{formatMoney(group.subtotal)}</strong>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.column}>
            <article className={styles.card}>
              <h3>{t.buyerTitle}</h3>
              <div className={styles.row}>
                <span>{t.buyerName}</span>
                <span>{order.userFullName}</span>
              </div>
              <div className={styles.row}>
                <span>{t.buyerEmail}</span>
                <span>{order.userEmail}</span>
              </div>
              <div className={styles.row}>
                <span>{t.buyerPhone}</span>
                <span>{order.userPhone}</span>
              </div>
            </article>

            <article className={styles.card}>
              <h3>{t.totalsTitle}</h3>
              <div className={styles.row}>
                <span>{t.itemsLabel}</span>
                <span>{formatMoney(order.totalAmount)}</span>
              </div>
              <div className={styles.row}>
                <span>{t.shippingLabel}</span>
                <span>{formatMoney(order.shippingFee)}</span>
              </div>
              <div className={styles.row}>
                <span>{t.discountLabel}</span>
                <span>
                  {order.discountAmount === 0
                    ? "—"
                    : `-${formatMoney(order.discountAmount)}`}
                </span>
              </div>
              <div className={styles.rowTotal}>
                <strong>{t.finalLabel}</strong>
                <strong>{formatMoney(order.finalAmount)}</strong>
              </div>
            </article>

            <article className={styles.card}>
              <h3>{t.paymentTitle}</h3>
              <div className={styles.row}>
                <span>{t.paymentMethod}</span>
                <span>
                  {PAYMENT_METHOD_LABELS[order.paymentMethod] ??
                    order.paymentMethod}
                </span>
              </div>
              <div className={styles.row}>
                <span>{t.paymentStatus}</span>
                <Tag>
                  {PAYMENT_STATUS_LABELS[order.paymentStatus] ??
                    order.paymentStatus}
                </Tag>
              </div>
            </article>

            <article className={styles.card}>
              <h3>{t.shippingTitle}</h3>
              <p className={styles.address}>
                {renderAddressLine(order.shippingAddress)}
              </p>
            </article>
          </div>
        </div>
      )}
    </AdminShell>
  );
};
