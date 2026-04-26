import { Button, Input, Modal, Skeleton, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";

import styles from "./seller-order-detail-page.module.scss";
import { useSellerOrderDetail } from "./use-seller-order-detail";

import {
  SELLER_ORDER_STATUS_COLORS,
  SELLER_ROUTES,
  formatSellerCurrency,
  formatSellerDateTime,
} from "@/const/seller.const";
import { SellerShell } from "@/features/seller/components/seller-shell";

export const SellerOrderDetailPage = () => {
  const {
    group,
    loading,
    error,
    submitting,
    nextStatus,
    canCancel,
    totalAmount,
    addressLines,
    advanceOpen,
    cancelOpen,
    note,
    setNote,
    openAdvance,
    openCancel,
    closeAdvance,
    closeCancel,
    confirmAdvance,
    confirmCancel,
  } = useSellerOrderDetail();
  const navigate = useNavigate();

  if (loading) {
    return (
      <SellerShell title="Order detail" subtitle="Loading order...">
        <div className={styles.card}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </SellerShell>
    );
  }

  if (error || !group) {
    return (
      <SellerShell title="Order detail" subtitle={error || "Order not found."}>
        <div className={styles.card}>
          <Button
            onClick={() => {
              void navigate(SELLER_ROUTES.orders);
            }}
          >
            Back to orders
          </Button>
        </div>
      </SellerShell>
    );
  }

  return (
    <SellerShell
      title={`Order #${group.id}`}
      subtitle={`Order ${group.orderId} · ${formatSellerDateTime(group.createdAt)}`}
      actions={
        <Link to={SELLER_ROUTES.orders} className={styles.backLink}>
          ← Back to orders
        </Link>
      }
    >
      <div className={styles.grid}>
        <div className={styles.column}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              Items{" "}
              <Tag color={SELLER_ORDER_STATUS_COLORS[group.status]}>
                {group.status}
              </Tag>
            </h3>
            <div className={styles.itemList}>
              {group.items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className={styles.itemThumb}
                  />
                  <div>
                    <div className={styles.itemName}>{item.productName}</div>
                    <div className={styles.itemMeta}>
                      Product #{item.productId} · x{item.quantity}
                    </div>
                    {item.selectedOptions.length > 0 ? (
                      <div className={styles.itemMeta}>
                        {item.selectedOptions
                          .map(
                            (opt) => `${opt.groupName}: ${opt.optionName}`,
                          )
                          .join(" · ")}
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.itemPrice}>
                    {formatSellerCurrency(item.unitPriceAtTime * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              {nextStatus ? (
                <Button
                  type="primary"
                  loading={submitting}
                  onClick={openAdvance}
                >
                  Mark as {nextStatus}
                </Button>
              ) : null}

              {canCancel ? (
                <Button danger loading={submitting} onClick={openCancel}>
                  Cancel order
                </Button>
              ) : null}
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Status history</h3>
            <div className={styles.logList}>
              {group.statusLogs.length === 0 ? (
                <span className={styles.itemMeta}>No log entries.</span>
              ) : (
                group.statusLogs.map((log) => (
                  <div key={log.id} className={styles.logEntry}>
                    <div className={styles.logTime}>
                      {formatSellerDateTime(log.createdAt)}
                    </div>
                    <div className={styles.logNote}>
                      <Tag
                        color={SELLER_ORDER_STATUS_COLORS[log.status] ?? "default"}
                      >
                        {log.status}
                      </Tag>
                      {log.note ?? "—"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Buyer</h3>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Name</span>
              <span className={styles.rowValue}>{group.buyer.fullName}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Phone</span>
              <span className={styles.rowValue}>{group.buyer.phone}</span>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Totals</h3>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Subtotal</span>
              <span className={styles.rowValue}>
                {formatSellerCurrency(group.subtotal)}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Shipping fee</span>
              <span className={styles.rowValue}>
                {formatSellerCurrency(group.shippingFee)}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Total</span>
              <span className={styles.rowValue}>
                {formatSellerCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Shipping address</h3>
            {addressLines.length === 0 ? (
              <span className={styles.itemMeta}>No address provided.</span>
            ) : (
              addressLines.map((line) => (
                <div key={line.key} className={styles.row}>
                  <span className={styles.rowLabel}>{line.key}</span>
                  <span className={styles.rowValue}>{line.value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        open={advanceOpen}
        title={`Mark order as ${nextStatus ?? ""}?`}
        okText="Confirm"
        onOk={confirmAdvance}
        onCancel={closeAdvance}
        confirmLoading={submitting}
      >
        <p>Add an optional note to help the buyer understand this update.</p>
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="E.g. Package handed to carrier"
        />
      </Modal>

      <Modal
        open={cancelOpen}
        title="Cancel this order?"
        okText="Cancel order"
        okButtonProps={{ danger: true }}
        onOk={confirmCancel}
        onCancel={closeCancel}
        confirmLoading={submitting}
      >
        <p>Tell the buyer why you are cancelling.</p>
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="E.g. Out of stock"
        />
      </Modal>
    </SellerShell>
  );
};
