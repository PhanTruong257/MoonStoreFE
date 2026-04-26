import { Skeleton } from "antd";
import { Link } from "react-router-dom";

import styles from "./admin-dashboard-page.module.scss";
import { useAdminDashboard } from "./use-admin-dashboard";

import { AdminShell } from "@/features/admin/components/admin-shell";

export const AdminDashboardPage = () => {
  const { stats, isLoading, error } = useAdminDashboard();

  return (
    <AdminShell
      title="Admin dashboard"
      subtitle="Overview of users, sellers and applications."
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : stats ? (
        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Total users</span>
            <strong className={styles.statValue}>{stats.totalUsers}</strong>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Active sellers</span>
            <strong className={styles.statValue}>{stats.totalSellers}</strong>
          </article>
          <article className={styles.statCardHighlight}>
            <span className={styles.statLabel}>Pending applications</span>
            <strong className={styles.statValue}>{stats.pendingSellers}</strong>
            <Link to="/admin/sellers" className={styles.statLink}>
              Review now →
            </Link>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Admins</span>
            <strong className={styles.statValue}>{stats.totalAdmins}</strong>
          </article>
        </div>
      ) : null}
    </AdminShell>
  );
};
