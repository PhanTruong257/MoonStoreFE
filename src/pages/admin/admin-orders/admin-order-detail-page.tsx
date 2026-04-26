import { Link } from "react-router-dom";
import { Empty, Skeleton, Tag } from "antd";

import styles from "./admin-order-detail-page.module.scss";
import { useAdminOrderDetail } from "./use-admin-order-detail";

import { AdminShell } from "@/features/admin/components/admin-shell";

const STATUS_TAG_COLOR: Record<string, string> = {
  PENDING: "gold",
  CONFIRMED: "blue",
  SHIPPING: "geekblue",
  DELIVERED: "green",
  CANCELLED: "red",
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;
const formatDateTime = (iso: string) => new Date(iso).toLocaleString();

const renderAddress = (address: Record<string, unknown> | null) => {
  if (!address) {
    return "(none)";
  }
  const parts = [
    address.addressLine ?? address.streetAddress,
    address.district,
    address.city,
  ].filter(Boolean);
  return parts.join(", ") || "(empty)";
};

export const AdminOrderDetailPage = () => {
  const { order, isLoading, error } = useAdminOrderDetail();

  return (
    <AdminShell
      title={order ? `Order #${order.id}` : "Order detail"}
      subtitle={order ? formatDateTime(order.createdAt) : "Loading..."}
      actions={
        <Link to="/admin/orders" className={styles.backLink}>
          ← Back to orders
        </Link>
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : error || !order ? (
        <Empty description={error ?? "Order not found"} />
      ) : (
        <div className={styles.grid}>
          <div className={styles.column}>
            {order.groups.map((group) => (
              <article key={group.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{group.sellerShopName}</h3>
                  <Tag color={STATUS_TAG_COLOR[group.status] ?? "default"}>
                    {group.status}
                  </Tag>
                </div>
                {group.items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <img src={item.imageUrl} alt={item.productName} />
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
                  <span>Subtotal</span>
                  <strong>{formatMoney(group.subtotal)}</strong>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.column}>
            <article className={styles.card}>
              <h3>Buyer</h3>
              <div className={styles.row}>
                <span>Name</span>
                <span>{order.userFullName}</span>
              </div>
              <div className={styles.row}>
                <span>Email</span>
                <span>{order.userEmail}</span>
              </div>
              <div className={styles.row}>
                <span>Phone</span>
                <span>{order.userPhone}</span>
              </div>
            </article>

            <article className={styles.card}>
              <h3>Totals</h3>
              <div className={styles.row}>
                <span>Items</span>
                <span>{formatMoney(order.totalAmount)}</span>
              </div>
              <div className={styles.row}>
                <span>Shipping</span>
                <span>{formatMoney(order.shippingFee)}</span>
              </div>
              <div className={styles.row}>
                <span>Discount</span>
                <span>
                  {order.discountAmount === 0
                    ? "—"
                    : `-${formatMoney(order.discountAmount)}`}
                </span>
              </div>
              <div className={styles.rowTotal}>
                <strong>Final</strong>
                <strong>{formatMoney(order.finalAmount)}</strong>
              </div>
            </article>

            <article className={styles.card}>
              <h3>Payment</h3>
              <div className={styles.row}>
                <span>Method</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className={styles.row}>
                <span>Status</span>
                <Tag>{order.paymentStatus}</Tag>
              </div>
            </article>

            <article className={styles.card}>
              <h3>Shipping</h3>
              <p className={styles.address}>
                {renderAddress(order.shippingAddress)}
              </p>
            </article>
          </div>
        </div>
      )}
    </AdminShell>
  );
};
