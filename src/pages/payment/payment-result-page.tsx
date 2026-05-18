import { Skeleton } from "antd";
import { Link } from "react-router-dom";

import styles from "./payment-result-page.module.scss";
import { usePaymentResult } from "./use-payment-result";

import { UI_TEXT } from "@/const/ui-text";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const t = UI_TEXT.payment;
const th = UI_TEXT.header;

export const PaymentResultPage = () => {
  const { isLoading, result, error } = usePaymentResult();

  const isSuccess = result?.paid === true;
  const orderId = result?.orderId ?? null;

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: th.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: th.searchPlaceholder }}
      />

      <section className={styles.main}>
        <div className={styles.card}>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : (
            <>
              <div className={styles.statusIcon}>
                {isSuccess ? "✅" : "❌"}
              </div>
              <h1 className={styles.title}>
                {isSuccess ? t.successTitle : t.failedTitle}
              </h1>
              <p className={styles.message}>
                {error || result?.message || t.noInfo}
              </p>
              <div className={styles.actions}>
                {orderId ? (
                  <Link
                    to={`/orders/${orderId}`}
                    className={styles.linkPrimary}
                  >
                    {t.viewOrder(orderId)}
                  </Link>
                ) : null}
                <Link to="/orders" className={styles.linkSecondary}>
                  {t.myOrders}
                </Link>
              </div>
            </>
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
