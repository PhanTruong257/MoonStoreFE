import { Button, InputNumber, Skeleton } from "antd";
import { useState } from "react";

import { AdminShell } from "@/features/admin/components/admin-shell";
import { ADMIN_ROUTES } from "@/const/admin.const";
import { formatSellerCurrency } from "@/const/seller.const";
import { UI_TEXT } from "@/const/ui-text";
import styles from "./admin-revenue-page.module.scss";
import { useAdminRevenue } from "./use-admin-revenue";

const t = UI_TEXT.admin.revenue;

export const AdminRevenuePage = () => {
  const { data, isLoading, error, commissionRate, isUpdatingRate, updateCommissionRate } =
    useAdminRevenue();
  const [rateInput, setRateInput] = useState<number | null>(null);

  const handleUpdateRate = () => {
    if (rateInput !== null) updateCommissionRate(rateInput);
  };

  return (
    <AdminShell title={t.title} subtitle={t.subtitle}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>{t.statPlatformRevenue}</span>
              <strong className={styles.statValue}>
                {formatSellerCurrency(data?.platformRevenue ?? 0)}
              </strong>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>{t.statTotalTransactions}</span>
              <strong className={styles.statValue}>{data?.totalTransactions ?? 0}</strong>
            </article>
            <article className={`${styles.statCard} ${styles.highlight}`}>
              <span className={styles.statLabel}>{t.statPendingRefunds}</span>
              <strong className={styles.statValue}>{data?.pendingRefunds ?? 0}</strong>
              <a href={ADMIN_ROUTES.refunds} className={styles.link}>{t.reviewNow}</a>
            </article>
            <article className={`${styles.statCard} ${styles.highlight}`}>
              <span className={styles.statLabel}>{t.statPendingWithdrawals}</span>
              <strong className={styles.statValue}>{data?.pendingWithdrawals ?? 0}</strong>
              <a href={ADMIN_ROUTES.withdrawals} className={styles.link}>{t.reviewNow}</a>
            </article>
          </div>

          <div className={styles.commissionBox}>
            <h3 className={styles.commissionTitle}>{t.commissionTitle}</h3>
            <p className={styles.commissionDesc}>
              {t.commissionDesc(String(commissionRate ?? "—"))}
            </p>
            <div className={styles.commissionRow}>
              <InputNumber
                min={0}
                max={100}
                value={rateInput ?? commissionRate ?? undefined}
                onChange={(v) => setRateInput(v)}
                addonAfter="%"
                style={{ width: 160 }}
              />
              <Button
                type="primary"
                loading={isUpdatingRate}
                onClick={handleUpdateRate}
                disabled={rateInput === null || rateInput === commissionRate}
              >
                {t.updateBtn}
              </Button>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
};
