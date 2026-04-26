import { Link } from "react-router-dom";
import { Skeleton } from "antd";

import styles from "./seller-dashboard-page.module.scss";
import { useSellerDashboard } from "./use-seller-dashboard";

import { SELLER_ROUTES, formatSellerCurrency } from "@/const/seller.const";
import { SellerShell } from "@/features/seller/components/seller-shell";

export const SellerDashboardPage = () => {
  const { stats, loading, error } = useSellerDashboard();

  return (
    <SellerShell
      title="Your seller cockpit"
      subtitle="Track performance and manage your shop from one place."
      actions={
        <>
          <Link to={SELLER_ROUTES.productNew} className={styles.heroLink}>
            + Upload product
          </Link>
          <Link to={SELLER_ROUTES.orders} className={styles.heroLink}>
            View orders
          </Link>
        </>
      }
    >
      {error ? <p className={styles.errorText}>{error}</p> : null}

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <>
          <div className={styles.statsGrid}>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Total products</span>
              <strong className={styles.statValue}>
                {stats.totalProducts}
              </strong>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Live listings</span>
              <strong className={styles.statValue}>
                {stats.activeProducts}
              </strong>
            </article>
            <article
              className={`${styles.statCard} ${styles.statCardAccent}`}
            >
              <span className={styles.statLabel}>Revenue</span>
              <strong className={styles.statValue}>
                {formatSellerCurrency(stats.revenue)}
              </strong>
            </article>
          </div>

          <div className={styles.statsGrid}>
            <article
              className={`${styles.statCard} ${styles.statCardMuted}`}
            >
              <span className={styles.statLabel}>Total orders</span>
              <strong className={styles.statValue}>{stats.totalOrders}</strong>
            </article>
            <article
              className={`${styles.statCard} ${styles.statCardMuted}`}
            >
              <span className={styles.statLabel}>Pending</span>
              <strong className={styles.statValue}>
                {stats.pendingOrders}
              </strong>
            </article>
            <article
              className={`${styles.statCard} ${styles.statCardMuted}`}
            >
              <span className={styles.statLabel}>Delivered</span>
              <strong className={styles.statValue}>
                {stats.deliveredOrders}
              </strong>
            </article>
          </div>
        </>
      )}

      <div className={styles.grid}>
        <section className={`${styles.card} ${styles.quickAction}`}>
          <h3 className={styles.panelTitle}>Next best move</h3>
          <p className={styles.panelDesc}>
            Launch new items, keep stock updated, monitor what is trending.
          </p>
          <Link to={SELLER_ROUTES.productNew} className={styles.quickButton}>
            Create new listing
          </Link>
          <Link
            to={SELLER_ROUTES.products}
            className={`${styles.quickButton} ${styles.quickSecondary}`}
          >
            Review catalog
          </Link>
        </section>

        <section className={`${styles.card} ${styles.quickAction}`}>
          <h3 className={styles.panelTitle}>Fulfillment checklist</h3>
          <p className={styles.panelDesc}>
            Confirm pending orders fast and keep buyers updated.
          </p>
          <Link to={SELLER_ROUTES.orders} className={styles.quickButton}>
            Open orders queue
          </Link>
        </section>
      </div>
    </SellerShell>
  );
};
