import { Button, Input, Modal, Popconfirm, Skeleton, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";

import styles from "./seller-order-detail-page.module.scss";
import { useSellerOrderDetail } from "./use-seller-order-detail";

import { PAYMENT_STATUS } from "@/const/payment.const";
import {
  SELLER_ORDER_STATUS_COLORS,
  SELLER_ROUTES,
  formatSellerCurrency,
  formatSellerDateTime,
} from "@/const/seller.const";
import { UI_TEXT } from "@/const/ui-text";
import { SellerShell } from "@/features/seller/components/seller-shell";

const t = UI_TEXT.seller.orderDetail;

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
    canConfirmManualPayment,
    confirmingManualPayment,
    confirmManualPayment,
  } = useSellerOrderDetail();
  const navigate = useNavigate();

  if (loading) {
    return (
      <SellerShell title={t.title} subtitle={t.loadingSubtitle}>
        <div className={styles.card}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </SellerShell>
    );
  }

  if (error || !group) {
    return (
      <SellerShell title={t.title} subtitle={error ?? t.notFound}>
        <div className={styles.card}>
          <Button
            onClick={() => {
              void navigate(SELLER_ROUTES.orders);
            }}
          >
            {t.backToOrders}
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
          {t.backToOrders}
        </Link>
      }
    >
      <div className={styles.grid}>
        <div className={styles.column}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              {t.orderItemsTitle}{" "}
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
                  {t.markAs(nextStatus)}
                </Button>
              ) : null}

              {canCancel ? (
                <Button danger loading={submitting} onClick={openCancel}>
                  {t.cancelOrderBtn}
                </Button>
              ) : null}
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{t.statusHistoryTitle}</h3>
            <div className={styles.logList}>
              {group.statusLogs.length === 0 ? (
                <span className={styles.itemMeta}>{t.noLogs}</span>
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
            <h3 className={styles.cardTitle}>{t.buyerTitle}</h3>
            <div className={styles.row}>
              <span className={styles.rowLabel}>{t.buyerName}</span>
              <span className={styles.rowValue}>{group.buyer.fullName}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>{t.buyerPhone}</span>
              <span className={styles.rowValue}>{group.buyer.phone}</span>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{t.paymentTitle}</h3>
            <div className={styles.row}>
              <span className={styles.rowLabel}>{t.paymentMethod}</span>
              <span className={styles.rowValue}>{group.paymentMethod}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>{t.paymentStatus}</span>
              <span className={styles.rowValue}>
                <Tag
                  color={
                    group.paymentStatus === PAYMENT_STATUS.PAID
                      ? "green"
                      : "gold"
                  }
                >
                  {group.paymentStatus}
                </Tag>
              </span>
            </div>
            {canConfirmManualPayment ? (
              <Popconfirm
                title={t.qrConfirm}
                description={t.confirmQRDesc}
                okText={t.confirmQROk}
                onConfirm={confirmManualPayment}
              >
                <Button
                  type="primary"
                  block
                  loading={confirmingManualPayment}
                  style={{ marginTop: 8 }}
                >
                  {t.confirmQRBtn}
                </Button>
              </Popconfirm>
            ) : null}
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{t.totalsTitle}</h3>
            <div className={styles.row}>
              <span className={styles.rowLabel}>{t.subtotalLabel}</span>
              <span className={styles.rowValue}>
                {formatSellerCurrency(group.subtotal)}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>{t.shippingFeeLabel}</span>
              <span className={styles.rowValue}>
                {formatSellerCurrency(group.shippingFee)}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>{t.totalLabel}</span>
              <span className={styles.rowValue}>
                {formatSellerCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{t.shippingAddressTitle}</h3>
            {addressLines.length === 0 ? (
              <span className={styles.itemMeta}>{t.noAddress}</span>
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
        title={t.advanceModalTitle(nextStatus ?? "")}
        okText={t.advanceModalOk}
        onOk={confirmAdvance}
        onCancel={closeAdvance}
        confirmLoading={submitting}
      >
        <p>{t.advanceModalNote}</p>
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder={t.advancePlaceholder}
        />
      </Modal>

      <Modal
        open={cancelOpen}
        title={t.cancelModalTitle}
        okText={t.cancelModalOk}
        okButtonProps={{ danger: true }}
        onOk={confirmCancel}
        onCancel={closeCancel}
        confirmLoading={submitting}
      >
        <p>{t.cancelModalNote}</p>
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder={t.cancelPlaceholder}
        />
      </Modal>
    </SellerShell>
  );
};
