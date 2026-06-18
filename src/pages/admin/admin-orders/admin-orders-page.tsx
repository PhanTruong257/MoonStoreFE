import { Empty, Segmented, Skeleton, Tag } from "antd";
import { Link } from "react-router-dom";

import {
  ADMIN_ORDER_STATUS_OPTIONS,
  useAdminOrders,
} from "./use-admin-orders";

import { formatDateTime, formatMoney } from "@/app/utils/format";
import { ADMIN_FILTER_ALL, ADMIN_ROUTES } from "@/const/admin.const";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/const/orders.const";
import { PAYMENT_STATUS_LABELS } from "@/const/payment.const";
import { UI_TEXT } from "@/const/ui-text";
import { AdminShell } from "@/features/admin/components/admin-shell";
import styles from "@/styles/admin-list.module.scss";

const t = UI_TEXT.admin.orders;

export const AdminOrdersPage = () => {
  const { orders, isLoading, error, statusFilter, setStatusFilter } =
    useAdminOrders();

  return (
    <AdminShell
      title={t.title}
      subtitle={t.subtitle}
      actions={
        <Segmented
          value={statusFilter}
          onChange={(value) => setStatusFilter(String(value))}
          options={ADMIN_ORDER_STATUS_OPTIONS.map((opt) => ({
            label:
              opt === ADMIN_FILTER_ALL
                ? UI_TEXT.orders.statusFilterAll
                : ORDER_STATUS_LABELS[opt] ?? opt,
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
        <Empty description={t.noOrders} />
      ) : (
        <div className={styles.list}>
          {orders.map((order) => (
            <article key={order.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <Link to={ADMIN_ROUTES.orderDetail(order.id)}>
                    <strong>Order #{order.id}</strong>
                  </Link>
                  <Tag color={ORDER_STATUS_COLORS[order.status] ?? "default"}>
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </Tag>
                  <Tag>
                    {PAYMENT_STATUS_LABELS[order.paymentStatus] ??
                      order.paymentStatus}
                  </Tag>
                </div>
                <div className={styles.meta}>
                  {t.buyerPrefix}{order.userFullName} (#{order.userId}) ·{" "}
                  {UI_TEXT.orders.shopCount(order.groupCount)} ·{" "}
                  {formatDateTime(order.createdAt)}
                </div>
              </div>
              <div className={styles.totals}>
                <strong>{formatMoney(order.finalAmount)}</strong>
                <Link
                  to={ADMIN_ROUTES.orderDetail(order.id)}
                  className={styles.link}
                >
                  {UI_TEXT.admin.table.reviewLink}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
};
