import { Button, Input, Skeleton, Tag } from "antd";

import styles from "./admin-analytics-page.module.scss";
import { AnalyticsAskData } from "./analytics-ask-data";
import { AnalyticsBarList } from "./analytics-bar-list";
import { useAdminAnalytics } from "./use-admin-analytics";

import { ADMIN_ANALYTICS_SAMPLE_QUESTIONS } from "@/const/admin.const";
import { formatSellerCurrency } from "@/const/seller.const";
import { UI_TEXT } from "@/const/ui-text";
import { AdminShell } from "@/features/admin/components/admin-shell";

const t = UI_TEXT.admin.analytics;

export const AdminAnalyticsPage = () => {
  const {
    dashboard,
    isLoading,
    error,
    conversation,
    isAsking,
    question,
    setQuestion,
    ask,
    revenueBars,
    topProductBars,
    statusBars,
    userGrowthBars,
  } = useAdminAnalytics();

  const overview = dashboard?.overview;
  const returnRefund = dashboard?.returnRefund;

  return (
    <AdminShell title={t.title} subtitle={t.subtitle}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <div className={styles.kpiGrid}>
            <article className={styles.kpiCard}>
              <span className={styles.kpiLabel}>{t.kpiRevenue}</span>
              <strong className={styles.kpiValue}>
                {formatSellerCurrency(overview?.totalRevenue ?? 0)}
              </strong>
            </article>
            <article className={styles.kpiCard}>
              <span className={styles.kpiLabel}>{t.kpiOrders}</span>
              <strong className={styles.kpiValue}>{overview?.totalOrders ?? 0}</strong>
            </article>
            <article className={styles.kpiCard}>
              <span className={styles.kpiLabel}>{t.kpiUsers}</span>
              <strong className={styles.kpiValue}>{overview?.totalUsers ?? 0}</strong>
            </article>
            <article className={styles.kpiCard}>
              <span className={styles.kpiLabel}>{t.kpiSellers}</span>
              <strong className={styles.kpiValue}>{overview?.activeSellers ?? 0}</strong>
            </article>
            <article className={styles.kpiCard}>
              <span className={styles.kpiLabel}>{t.kpiProducts}</span>
              <strong className={styles.kpiValue}>{overview?.activeProducts ?? 0}</strong>
            </article>
          </div>

          <div className={styles.chartGrid}>
            <section className={styles.chartCard}>
              <h3 className={styles.chartTitle}>{t.revenueTitle}</h3>
              <AnalyticsBarList bars={revenueBars} />
            </section>
            <section className={styles.chartCard}>
              <h3 className={styles.chartTitle}>{t.topProductsTitle}</h3>
              <AnalyticsBarList bars={topProductBars} />
            </section>
            <section className={styles.chartCard}>
              <h3 className={styles.chartTitle}>{t.statusTitle}</h3>
              <AnalyticsBarList bars={statusBars} />
            </section>
            <section className={styles.chartCard}>
              <h3 className={styles.chartTitle}>{t.userGrowthTitle}</h3>
              <AnalyticsBarList bars={userGrowthBars} />
            </section>
          </div>

          <section className={styles.returnBox}>
            <h3 className={styles.chartTitle}>{t.returnRefundTitle}</h3>
            <div className={styles.returnStats}>
              <span>
                {t.returns}: <strong>{returnRefund?.returns ?? 0}</strong>
              </span>
              <span>
                {t.refunds}: <strong>{returnRefund?.refunds ?? 0}</strong>
              </span>
              <span>
                {t.returnRate}:{" "}
                <strong>{returnRefund?.returnRefundRatePercent ?? 0}%</strong>
              </span>
            </div>
          </section>

          <section className={styles.askBox}>
            <h3 className={styles.chartTitle}>{t.askTitle}</h3>

            <div className={styles.suggestions}>
              <span className={styles.suggestLabel}>{t.suggestionsLabel}</span>
              {ADMIN_ANALYTICS_SAMPLE_QUESTIONS.map((q) => (
                <Tag
                  key={q}
                  className={styles.suggestTag}
                  onClick={() => ask(q)}
                >
                  {q}
                </Tag>
              ))}
            </div>

            <div className={styles.askComposer}>
              <Input.TextArea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t.askPlaceholder}
                autoSize={{ minRows: 1, maxRows: 3 }}
                onPressEnter={(e) => {
                  e.preventDefault();
                  ask(question);
                }}
              />
              <Button
                type="primary"
                loading={isAsking}
                onClick={() => ask(question)}
              >
                {t.askBtn}
              </Button>
            </div>

            {conversation.length === 0 ? (
              <p className={styles.askEmpty}>{t.emptyAsk}</p>
            ) : (
              <div className={styles.conversation}>
                {conversation.map((entry) => (
                  <div key={entry.id} className={styles.qaBlock}>
                    <p className={styles.qaQuestion}>{entry.question}</p>
                    <div className={styles.qaAnswer}>
                      <p className={styles.qaText}>
                        {entry.pending ? t.asking : entry.answer}
                      </p>
                      {!entry.pending && <AnalyticsAskData data={entry.data} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </AdminShell>
  );
};
