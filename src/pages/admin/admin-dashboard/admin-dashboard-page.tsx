import { Skeleton } from "antd";
import { Link } from "react-router-dom";

import styles from "./admin-dashboard-page.module.scss";
import { useAdminDashboard } from "./use-admin-dashboard";

import { AdminShell } from "@/features/admin/components/admin-shell";
import { UI_TEXT } from "@/const/ui-text";

const t = UI_TEXT.admin.dashboard;

export const AdminDashboardPage = () => {
  const { stats, isLoading, error } = useAdminDashboard();

  return (
    <AdminShell title={t.title} subtitle={t.subtitle}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : stats ? (
        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>{t.statTotalUsers}</span>
            <strong className={styles.statValue}>{stats.totalUsers}</strong>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>{t.statActiveSellers}</span>
            <strong className={styles.statValue}>{stats.totalSellers}</strong>
          </article>
          <article className={styles.statCardHighlight}>
            <span className={styles.statLabel}>{t.statPendingApps}</span>
            <strong className={styles.statValue}>{stats.pendingSellers}</strong>
            <Link to="/admin/sellers" className={styles.statLink}>
              {t.reviewNow}
            </Link>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>{t.statAdmins}</span>
            <strong className={styles.statValue}>{stats.totalAdmins}</strong>
          </article>
        </div>
      ) : null}
    </AdminShell>
  );
};
