import { Button, Empty, Form, Input, Modal, Popconfirm, Skeleton, Tag } from "antd";
import { Link } from "react-router-dom";

import { resolveImageUrl } from "@/app/utils/image-url";

import styles from "./order-detail-page.module.scss";
import { QrPaymentCard } from "./qr-payment-card";
import { useOrderDetail } from "./use-order-detail";

import { renderAddressLine } from "@/app/utils/format";
import {
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  formatOrdersCurrency,
  formatOrdersDateTime,
} from "@/const/orders.const";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/const/payment.const";
import { UI_TEXT } from "@/const/ui-text";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const t = UI_TEXT.orders;
const th = UI_TEXT.header;

export const OrderDetailPage = () => {
  const [returnForm] = Form.useForm();
  const {
    order,
    isLoading,
    isCancelling,
    error,
    cancelGroup,
    qrInfo,
    isQrLoading,
    isChatCreating,
    startChatWithSeller,
    returnModalGroupId,
    openReturnModal,
    closeReturnModal,
    submitReturnRequest,
    isReturnRequesting,
  } = useOrderDetail();

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: th.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: th.searchPlaceholder }}
      />

      <section className={styles.main}>
        <div className={styles.headerRow}>
          <Link to="/orders" className={styles.backLink}>
            {t.backToOrders}
          </Link>
        </div>

        {isLoading ? (
          <div className={styles.card}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        ) : error || !order ? (
          <div className={styles.card}>
            <Empty description={error ?? t.orderNotFound} />
          </div>
        ) : (
          <>
            <header className={styles.summary}>
              <div>
                <h1>{t.orderTitle(order.id)}</h1>
                <p>{formatOrdersDateTime(order.createdAt)}</p>
              </div>
              <div className={styles.summaryTotals}>
                <span>{t.totalLabel}</span>
                <strong>{formatOrdersCurrency(order.finalAmount)}</strong>
              </div>
            </header>

            <div className={styles.grid}>
              <div className={styles.column}>
                {order.groups?.map((group) => (
                  <article key={group.id} className={styles.card}>
                    <div className={styles.groupHeader}>
                      <h3>{group.shopName || t.shopLabel(group.sellerId)}</h3>
                      <div className={styles.groupActions}>
                        <Tag
                          color={ORDER_STATUS_COLORS[group.status] ?? "default"}
                        >
                          {ORDER_STATUS_LABELS[group.status] ?? group.status}
                        </Tag>
                        <Button
                          size="small"
                          onClick={() => startChatWithSeller(group.sellerId)}
                          loading={isChatCreating}
                        >
                          {t.chatWithShop}
                        </Button>
                        {group.status === ORDER_STATUS.PENDING ? (
                          <Popconfirm
                            title={t.cancelConfirm}
                            okText={t.cancelGroupOk}
                            okButtonProps={{ danger: true }}
                            onConfirm={() => cancelGroup(group.id)}
                          >
                            <Button
                              danger
                              size="small"
                              loading={isCancelling}
                            >
                              {t.cancelGroupBtn}
                            </Button>
                          </Popconfirm>
                        ) : null}
                        {group.status === ORDER_STATUS.DELIVERED ? (
                          <Button
                            size="small"
                            onClick={() => openReturnModal(group.id)}
                          >
                            Trả hàng / hoàn tiền
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    {group.items?.map((item) => (
                      <div key={item.id} className={styles.item}>
                        <Link
                          to={`/product/${item.productId}`}
                          className={styles.productLink}
                        >
                          <img src={resolveImageUrl(item.imageUrlAtTime)} alt={item.productName} />
                        </Link>
                        <div className={styles.itemInfo}>
                          <Link
                            to={`/product/${item.productId}`}
                            className={styles.productLink}
                          >
                            <strong>{item.productName}</strong>
                          </Link>
                          {item.selectedOptions.length > 0 ? (
                            <small>
                              {item.selectedOptions
                                .map(
                                  (opt) =>
                                    `${opt.groupName}: ${opt.optionName}`,
                                )
                                .join(" · ")}
                            </small>
                          ) : null}
                          <small>
                            {formatOrdersCurrency(item.unitPriceAtTime)} ×{" "}
                            {item.quantity}
                          </small>
                        </div>
                        <strong>
                          {formatOrdersCurrency(
                            item.unitPriceAtTime * item.quantity,
                          )}
                        </strong>
                      </div>
                    ))}

                    <div className={styles.groupTotals}>
                      <span>{t.subtotalLabel}</span>
                      <strong>{formatOrdersCurrency(group.subtotal)}</strong>
                    </div>
                  </article>
                ))}
              </div>

              <div className={styles.column}>
                <QrPaymentCard qrInfo={qrInfo} isLoading={isQrLoading} />

                <article className={styles.card}>
                  <h3>{t.totalsTitle}</h3>
                  <div className={styles.row}>
                    <span>{t.itemsLabel}</span>
                    <span>{formatOrdersCurrency(order.totalAmount)}</span>
                  </div>
                  <div className={styles.row}>
                    <span>{t.shippingLabel}</span>
                    <span>{formatOrdersCurrency(order.shippingFee)}</span>
                  </div>
                  <div className={styles.row}>
                    <span>{t.discountLabel}</span>
                    <span>
                      {order.discountAmount === 0
                        ? "—"
                        : `-${formatOrdersCurrency(order.discountAmount)}`}
                    </span>
                  </div>
                  <div className={styles.rowTotal}>
                    <strong>{t.finalLabel}</strong>
                    <strong>{formatOrdersCurrency(order.finalAmount)}</strong>
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
                  <h3>{t.shippingAddressTitle}</h3>
                  {order.shippingAddress ? (
                    <p className={styles.address}>
                      {renderAddressLine(order.shippingAddress)}
                    </p>
                  ) : (
                    <p className={styles.address}>{t.noAddress}</p>
                  )}
                </article>
              </div>
            </div>
          </>
        )}
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
      />

      <Modal
        title="Trả hàng / hoàn tiền"
        open={returnModalGroupId !== null}
        onCancel={() => {
          closeReturnModal();
          returnForm.resetFields();
        }}
        onOk={() => returnForm.submit()}
        okText="Gửi yêu cầu"
        confirmLoading={isReturnRequesting}
      >
        <Form
          form={returnForm}
          layout="vertical"
          onFinish={(values) => {
            submitReturnRequest(values);
            returnForm.resetFields();
          }}
        >
          <Form.Item
            label="Lý do"
            name="reason"
            rules={[{ required: true, message: "Vui lòng nhập lý do." }]}
          >
            <Input.TextArea rows={4} placeholder="Mô tả lý do bạn muốn trả hàng..." />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
};
