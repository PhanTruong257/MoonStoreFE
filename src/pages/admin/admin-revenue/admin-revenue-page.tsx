import { Button, InputNumber, Skeleton } from "antd";
import { useState } from "react";

import { AdminShell } from "@/features/admin/components/admin-shell";
import { ADMIN_ROUTES } from "@/const/admin.const";
import { formatSellerCurrency } from "@/const/seller.const";
import { UI_TEXT } from "@/const/ui-text";
import styles from "./admin-revenue-page.module.scss";
import { useAdminRevenue } from "./use-admin-revenue";

const t = UI_TEXT.admin.revenue;

const PendingBar = ({
  label,
  value,
  max,
  href,
  linkLabel,
}: {
  label: string;
  value: number;
  max: number;
  href: string;
  linkLabel: string;
}) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={styles.barRow}>
      <div className={styles.barMeta}>
        <span className={styles.barLabel}>{label}</span>
        <strong className={styles.barCount}>{value}</strong>
      </div>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${Math.max(pct, value > 0 ? 4 : 0)}%` }} />
      </div>
      <a href={href} className={styles.link}>{linkLabel}</a>
    </div>
  );
};

export const AdminRevenuePage = () => {
  const { data, isLoading, error, commissionRate, isUpdatingRate, updateCommissionRate } =
    useAdminRevenue();
  const [rateInput, setRateInput] = useState<number | null>(null);

  const handleUpdateRate = () => {
    if (rateInput !== null) updateCommissionRate(rateInput);
  };

  const pendingMax = Math.max(
    data?.pendingRefunds ?? 0,
    data?.pendingWithdrawals ?? 0,
    1,
  );

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

          <div className={styles.chartBox}>
            <h3 className={styles.chartTitle}>{t.pendingOverviewTitle}</h3>
            <p className={styles.chartDesc}>{t.pendingOverviewDesc}</p>
            <div className={styles.chartBars}>
              <PendingBar
                label={t.statPendingRefunds}
                value={data?.pendingRefunds ?? 0}
                max={pendingMax}
                href={ADMIN_ROUTES.refunds}
                linkLabel={t.reviewNow}
              />
              <PendingBar
                label={t.statPendingWithdrawals}
                value={data?.pendingWithdrawals ?? 0}
                max={pendingMax}
                href={ADMIN_ROUTES.withdrawals}
                linkLabel={t.reviewNow}
              />
            </div>
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
