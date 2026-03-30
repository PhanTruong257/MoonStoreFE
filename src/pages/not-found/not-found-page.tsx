import { Link } from "react-router-dom";

import styles from "./not-found-page.module.scss";

import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

export const NotFoundPage = () => {
  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: "Exclusive", to: "/" }}
        navLinks={homeHeaderLinks}
        promo={{
          message:
            "Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!",
          linkLabel: "ShopNow",
          to: "/",
        }}
        search={{ placeholder: "What are you looking for?" }}
      />

      <section className={styles.main}>
        <div className={styles.breadcrumb}>Home / 404 Error</div>

        <section className={styles.content}>
          <div>
            <h1>404 Not Found</h1>
            <p>Your visited page not found. You may go home page.</p>
            <Link to="/">Back to home page</Link>
          </div>
        </section>
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
