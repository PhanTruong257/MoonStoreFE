import { Button, Empty, Popconfirm, Skeleton, Tag } from "antd";
import { Link } from "react-router-dom";

import styles from "./order-detail-page.module.scss";
import { QrPaymentCard } from "./qr-payment-card";
import { useOrderDetail } from "./use-order-detail";

import { renderAddressLine } from "@/app/utils/format";
import {
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  formatOrdersCurrency,
  formatOrdersDateTime,
} from "@/const/orders.const";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

export const OrderDetailPage = () => {
  const {
    order,
    isLoading,
    isCancelling,
    error,
    cancelGroup,
    qrInfo,
    isQrLoading,
  } = useOrderDetail();

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: "Exclusive", to: "/" }}
        navLinks={homeHeaderLinks}
        promo={{
          message: "Track your orders",
          linkLabel: "ShopNow",
          to: "/",
        }}
        search={{ placeholder: "Search products" }}
      />

      <section className={styles.main}>
        <div className={styles.headerRow}>
          <Link to="/orders" className={styles.backLink}>
            ← Back to my orders
          </Link>
        </div>

        {isLoading ? (
          <div className={styles.card}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        ) : error || !order ? (
          <div className={styles.card}>
            <Empty description={error ?? "Order not found"} />
          </div>
        ) : (
          <>
            <header className={styles.summary}>
              <div>
                <h1>Order #{order.id}</h1>
                <p>{formatOrdersDateTime(order.createdAt)}</p>
              </div>
              <div className={styles.summaryTotals}>
                <span>Total</span>
                <strong>{formatOrdersCurrency(order.finalAmount)}</strong>
                <Tag color={ORDER_STATUS_COLORS[order.status] ?? "default"}>
                  {order.status}
                </Tag>
              </div>
            </header>

            <div className={styles.grid}>
              <div className={styles.column}>
                {order.groups?.map((group) => (
                  <article key={group.id} className={styles.card}>
                    <div className={styles.groupHeader}>
                      <h3>Shop #{group.sellerId}</h3>
                      <div className={styles.groupActions}>
                        <Tag
                          color={ORDER_STATUS_COLORS[group.status] ?? "default"}
                        >
                          {group.status}
                        </Tag>
                        {group.status === ORDER_STATUS.PENDING ? (
                          <Popconfirm
                            title="Cancel this order group?"
                            okText="Cancel order"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => cancelGroup(group.id)}
                          >
                            <Button
                              danger
                              size="small"
                              loading={isCancelling}
                            >
                              Cancel
                            </Button>
                          </Popconfirm>
                        ) : null}
                      </div>
                    </div>

                    {group.items?.map((item) => (
                      <div key={item.id} className={styles.item}>
                        <Link
                          to={`/product/${item.productId}`}
                          className={styles.productLink}
                        >
                          <img src={item.imageUrlAtTime} alt={item.productName} />
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
                      <span>Subtotal</span>
                      <strong>{formatOrdersCurrency(group.subtotal)}</strong>
                    </div>
                  </article>
                ))}
              </div>

              <div className={styles.column}>
                <QrPaymentCard qrInfo={qrInfo} isLoading={isQrLoading} />

                <article className={styles.card}>
                  <h3>Totals</h3>
                  <div className={styles.row}>
                    <span>Items</span>
                    <span>{formatOrdersCurrency(order.totalAmount)}</span>
                  </div>
                  <div className={styles.row}>
                    <span>Shipping</span>
                    <span>{formatOrdersCurrency(order.shippingFee)}</span>
                  </div>
                  <div className={styles.row}>
                    <span>Discount</span>
                    <span>
                      {order.discountAmount === 0
                        ? "—"
                        : `-${formatOrdersCurrency(order.discountAmount)}`}
                    </span>
                  </div>
                  <div className={styles.rowTotal}>
                    <strong>Final</strong>
                    <strong>{formatOrdersCurrency(order.finalAmount)}</strong>
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
                  <h3>Shipping address</h3>
                  {order.shippingAddress ? (
                    <p className={styles.address}>
                      {renderAddressLine(order.shippingAddress)}
                    </p>
                  ) : (
                    <p className={styles.address}>(none)</p>
                  )}
                </article>
              </div>
            </div>
          </>
        )}
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
