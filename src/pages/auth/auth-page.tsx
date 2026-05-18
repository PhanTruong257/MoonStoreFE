import { useLocation } from "react-router-dom";

import styles from "./auth-page.module.scss";

import { UI_TEXT } from "@/const/ui-text";
import { Login } from "@/features/auth/login/login";
import { Register } from "@/features/auth/register/register";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const th = UI_TEXT.header;

export const AuthPage = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: th.brand, to: "/login" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: th.searchPlaceholder }}
      />

      <section className={styles.content}>
        <article className={styles.hero}>
          <div className={styles.heroInner} />
        </article>

        <article className={styles.formWrap}>
          {isLoginPage ? <Login /> : <Register />}
        </article>
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
      />
    </main>
  );
};
