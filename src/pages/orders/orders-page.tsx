import { Empty, Segmented, Skeleton, Tag } from "antd";
import { Link } from "react-router-dom";

import styles from "./orders-page.module.scss";
import { useOrdersList } from "./use-orders-list";

import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_FILTER_OPTIONS,
  formatOrdersCurrency,
  formatOrdersDateTime,
} from "@/const/orders.const";
import { UI_TEXT } from "@/const/ui-text";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const t = UI_TEXT.orders;
const th = UI_TEXT.header;

export const OrdersPage = () => {
  const { orders, statusFilter, setStatusFilter, isLoading, error } =
    useOrdersList();

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: th.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: th.searchPlaceholder }}
      />

      <section className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
          <Segmented
            value={statusFilter}
            onChange={(value) => setStatusFilter(String(value))}
            options={ORDER_STATUS_FILTER_OPTIONS}
          />
        </header>

        <div className={styles.card}>
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
                      <Link to={`/orders/${order.id}`}>
                        <strong>{t.orderTitle(order.id)}</strong>
                      </Link>
                      <Tag
                        color={ORDER_STATUS_COLORS[order.status] ?? "default"}
                      >
                        {order.status}
                      </Tag>
                    </div>
                    <div className={styles.meta}>
                      {formatOrdersDateTime(order.createdAt)} ·{" "}
                      {order.paymentMethod} · {t.paymentLabel} {order.paymentStatus}
                    </div>
                    <div className={styles.meta}>
                      {t.shopCount(order.groups?.length ?? 0)}
                    </div>
                  </div>
                  <div className={styles.totals}>
                    <strong>{formatOrdersCurrency(order.finalAmount)}</strong>
                    <Link to={`/orders/${order.id}`} className={styles.link}>
                      {t.viewDetail}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
      />
    </main>
  );
};
