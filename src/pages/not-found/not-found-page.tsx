import { Link } from "react-router-dom";

import styles from "./not-found-page.module.scss";

import { Breadcrumb } from "@/component/breadcrumb/breadcrumb";
import { UI_TEXT } from "@/const/ui-text";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const t = UI_TEXT.notFound;
const h = UI_TEXT.header;

export const NotFoundPage = () => {
  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: h.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: h.searchPlaceholder }}
      />

      <section className={styles.main}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[{ label: UI_TEXT.common.home, to: "/" }, { label: t.breadcrumbLabel }]}
        />

        <section className={styles.content}>
          <div>
            <h1>{t.title}</h1>
            <p>{t.description}</p>
            <Link to="/">{t.backToHome}</Link>
          </div>
        </section>
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
      />
    </main>
  );
};
