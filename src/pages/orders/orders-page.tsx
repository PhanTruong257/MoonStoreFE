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
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

export const OrdersPage = () => {
  const { orders, statusFilter, setStatusFilter, isLoading, error } =
    useOrdersList();

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
        <header className={styles.header}>
          <div>
            <h1>My orders</h1>
            <p>Review and track every order you placed.</p>
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
            <Empty description="No orders yet" />
          ) : (
            <div className={styles.list}>
              {orders.map((order) => (
                <article key={order.id} className={styles.row}>
                  <div className={styles.info}>
                    <div className={styles.titleRow}>
                      <Link to={`/orders/${order.id}`}>
                        <strong>Order #{order.id}</strong>
                      </Link>
                      <Tag
                        color={ORDER_STATUS_COLORS[order.status] ?? "default"}
                      >
                        {order.status}
                      </Tag>
                    </div>
                    <div className={styles.meta}>
                      {formatOrdersDateTime(order.createdAt)} ·{" "}
                      {order.paymentMethod} · payment {order.paymentStatus}
                    </div>
                    <div className={styles.meta}>
                      {order.groups?.length ?? 0} shop(s)
                    </div>
                  </div>
                  <div className={styles.totals}>
                    <strong>{formatOrdersCurrency(order.finalAmount)}</strong>
                    <Link to={`/orders/${order.id}`} className={styles.link}>
                      View detail →
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
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
