import { Skeleton } from "antd";
import { Link } from "react-router-dom";

import styles from "./payment-result-page.module.scss";
import { usePaymentResult } from "./use-payment-result";

import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

export const PaymentResultPage = () => {
  const { isLoading, result, error } = usePaymentResult();

  const isSuccess = result?.paid === true;
  const orderId = result?.orderId ?? null;

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: "Exclusive", to: "/" }}
        navLinks={homeHeaderLinks}
        promo={{ message: "Payment", linkLabel: "ShopNow", to: "/" }}
        search={{ placeholder: "Search products" }}
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
                {isSuccess ? "Payment successful" : "Payment failed"}
              </h1>
              <p className={styles.message}>
                {error || result?.message || "No payment information."}
              </p>
              <div className={styles.actions}>
                {orderId ? (
                  <Link
                    to={`/orders/${orderId}`}
                    className={styles.linkPrimary}
                  >
                    View order #{orderId}
                  </Link>
                ) : null}
                <Link to="/orders" className={styles.linkSecondary}>
                  My orders
                </Link>
              </div>
            </>
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
