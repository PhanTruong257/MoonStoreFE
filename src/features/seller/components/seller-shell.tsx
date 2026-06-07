import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import styles from "./seller-shell.module.scss";

import { UI_TEXT } from "@/const/ui-text";
import { getStoredUser } from "@/features/auth/auth-storage";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const ts = UI_TEXT.seller;

type SellerShellProps = {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
  fullHeight?: boolean;
};

export const SellerShell = ({
  title,
  subtitle,
  actions,
  children,
  fullHeight = false,
}: SellerShellProps) => {
  const user = getStoredUser();

  return (
    <main
      className={`${styles.page}${fullHeight ? ` ${styles.pageFullHeight}` : ""}`}
    >
      <SiteHeader
        brand={{ label: UI_TEXT.header.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: UI_TEXT.header.searchPlaceholder }}
      />

      <section
        className={`${styles.main}${fullHeight ? ` ${styles.mainFullHeight}` : ""}`}
      >
        <aside className={styles.sidebar}>
          <div>
            <h2 className={styles.sidebarTitle}>
              {user?.fullName ?? "Seller"}
            </h2>
            <p className={styles.sidebarMeta}>
              {user?.role === "seller" ? ts.activeSeller : ts.sellerSetup}
            </p>
          </div>
          <nav className={styles.navLinks}>
            <NavLink
              to="/seller"
              end
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ts.nav.dashboard}
            </NavLink>
            <NavLink
              to="/seller/orders"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ts.nav.orders}
            </NavLink>
            <NavLink
              to="/seller/chat"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ts.nav.messages}
            </NavLink>
            <NavLink
              to="/seller/products"
              end
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ts.nav.manageProducts}
            </NavLink>
            <NavLink
              to="/seller/products/new"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ts.nav.uploadProduct}
            </NavLink>
            <NavLink
              to="/seller/wallet"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ts.nav.wallet}
            </NavLink>
            <NavLink
              to="/seller/returns"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ts.nav.returns}
            </NavLink>
          </nav>
        </aside>

        <div
          className={`${styles.content}${fullHeight ? ` ${styles.contentFullHeight}` : ""}`}
        >
          {children}
        </div>
      </section>

      {!fullHeight ? (
        <SiteFooter
          sections={homeFooterSections}
          copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
        />
      ) : null}
    </main>
  );
};
