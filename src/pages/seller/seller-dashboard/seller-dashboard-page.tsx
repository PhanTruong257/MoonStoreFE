import { Skeleton } from "antd";
import { Link } from "react-router-dom";

import styles from "./seller-dashboard-page.module.scss";
import { useSellerDashboard } from "./use-seller-dashboard";

import { SELLER_ROUTES, formatSellerCurrency } from "@/const/seller.const";
import { UI_TEXT } from "@/const/ui-text";
import { SellerShell } from "@/features/seller/components/seller-shell";

const t = UI_TEXT.seller.dashboard;

export const SellerDashboardPage = () => {
  const { stats, loading, error } = useSellerDashboard();

  return (
    <SellerShell
      title={t.title}
      subtitle={t.subtitle}
      actions={
        <>
          <Link to={SELLER_ROUTES.productNew} className={styles.heroLink}>
            {t.uploadProductBtn}
          </Link>
          <Link to={SELLER_ROUTES.orders} className={styles.heroLink}>
            {t.viewOrdersBtn}
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
              <span className={styles.statLabel}>{t.statTotalProducts}</span>
              <strong className={styles.statValue}>
                {stats.totalProducts}
              </strong>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>{t.statLiveListings}</span>
              <strong className={styles.statValue}>
                {stats.activeProducts}
              </strong>
            </article>
            <article
              className={`${styles.statCard} ${styles.statCardAccent}`}
            >
              <span className={styles.statLabel}>{t.statRevenue}</span>
              <strong className={styles.statValue}>
                {formatSellerCurrency(stats.revenue)}
              </strong>
            </article>
          </div>

          <div className={styles.statsGrid}>
            <article
              className={`${styles.statCard} ${styles.statCardMuted}`}
            >
              <span className={styles.statLabel}>{t.statTotalOrders}</span>
              <strong className={styles.statValue}>{stats.totalOrders}</strong>
            </article>
            <article
              className={`${styles.statCard} ${styles.statCardMuted}`}
            >
              <span className={styles.statLabel}>{t.statPending}</span>
              <strong className={styles.statValue}>
                {stats.pendingOrders}
              </strong>
            </article>
            <article
              className={`${styles.statCard} ${styles.statCardMuted}`}
            >
              <span className={styles.statLabel}>{t.statDelivered}</span>
              <strong className={styles.statValue}>
                {stats.deliveredOrders}
              </strong>
            </article>
          </div>
        </>
      )}

      <div className={styles.grid}>
        <section className={`${styles.card} ${styles.quickAction}`}>
          <h3 className={styles.panelTitle}>{t.nextMoveTitle}</h3>
          <p className={styles.panelDesc}>{t.nextMoveDesc}</p>
          <Link to={SELLER_ROUTES.productNew} className={styles.quickButton}>
            {t.createListingBtn}
          </Link>
          <Link
            to={SELLER_ROUTES.products}
            className={`${styles.quickButton} ${styles.quickSecondary}`}
          >
            {t.reviewCatalogBtn}
          </Link>
        </section>

        <section className={`${styles.card} ${styles.quickAction}`}>
          <h3 className={styles.panelTitle}>{t.fulfillmentTitle}</h3>
          <p className={styles.panelDesc}>{t.fulfillmentDesc}</p>
          <Link to={SELLER_ROUTES.orders} className={styles.quickButton}>
            {t.openOrdersBtn}
          </Link>
        </section>
      </div>
    </SellerShell>
  );
};
