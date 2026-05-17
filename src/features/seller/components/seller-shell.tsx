import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import styles from "./seller-shell.module.scss";

import { getStoredUser } from "@/features/auth/auth-storage";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

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
        brand={{ label: "Exclusive", to: "/" }}
        navLinks={homeHeaderLinks}
        promo={{
          message:
            "Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!",
          linkLabel: "ShopNow",
          to: "/",
        }}
        search={{ placeholder: "Search in seller hub" }}
      />

      <section className={styles.hero}>
        <span className={styles.heroLabel}>Seller Studio</span>
        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroSubtitle}>{subtitle}</p>
        {actions ? <div className={styles.heroActions}>{actions}</div> : null}
      </section>

      <section
        className={`${styles.main}${fullHeight ? ` ${styles.mainFullHeight}` : ""}`}
      >
        <aside className={styles.sidebar}>
          <div>
            <h2 className={styles.sidebarTitle}>
              {user?.fullName ?? "Seller"}
            </h2>
            <p className={styles.sidebarMeta}>
              {user?.role === "seller" ? "Active seller" : "Seller setup"}
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
              Dashboard
            </NavLink>
            <NavLink
              to="/seller/orders"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              Orders
            </NavLink>
            <NavLink
              to="/seller/chat"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              Messages
            </NavLink>
            <NavLink
              to="/seller/products"
              end
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              Manage products
            </NavLink>
            <NavLink
              to="/seller/products/new"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              Upload product
            </NavLink>
            <NavLink
              to="/seller/wallet"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              Wallet
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
          copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
        />
      ) : null}
    </main>
  );
};
