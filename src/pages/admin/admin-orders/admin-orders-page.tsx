import { Empty, Segmented, Skeleton, Tag } from "antd";
import { Link } from "react-router-dom";

import styles from "./admin-orders-page.module.scss";
import {
  ADMIN_ORDER_STATUS_OPTIONS,
  useAdminOrders,
} from "./use-admin-orders";

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

export const AdminOrdersPage = () => {
  const { orders, isLoading, error, statusFilter, setStatusFilter } =
    useAdminOrders();

  return (
    <AdminShell
      title="Orders"
      subtitle="All orders across the marketplace."
      actions={
        <Segmented
          value={statusFilter}
          onChange={(value) => setStatusFilter(String(value))}
          options={ADMIN_ORDER_STATUS_OPTIONS.map((opt) => ({
            label: opt.toUpperCase(),
            value: opt,
          }))}
        />
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : orders.length === 0 ? (
        <Empty description="No orders" />
      ) : (
        <div className={styles.list}>
          {orders.map((order) => (
            <article key={order.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <Link to={`/admin/orders/${order.id}`}>
                    <strong>Order #{order.id}</strong>
                  </Link>
                  <Tag color={STATUS_TAG_COLOR[order.status] ?? "default"}>
                    {order.status}
                  </Tag>
                  <Tag>{order.paymentStatus}</Tag>
                </div>
                <div className={styles.meta}>
                  Buyer: {order.userFullName} (#{order.userId}) ·{" "}
                  {order.groupCount} shop(s) · {formatDateTime(order.createdAt)}
                </div>
              </div>
              <div className={styles.totals}>
                <strong>{formatMoney(order.finalAmount)}</strong>
                <Link to={`/admin/orders/${order.id}`} className={styles.link}>
                  View →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
};
