import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import styles from "./admin-shell.module.scss";

import type { RootState } from "@/app/app-store";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

type AdminShellProps = {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
};

export const AdminShell = ({
  title,
  subtitle,
  actions,
  children,
}: AdminShellProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: "Exclusive", to: "/" }}
        navLinks={homeHeaderLinks}
        promo={{
          message: "Admin console",
          linkLabel: "Home",
          to: "/",
        }}
        search={{ placeholder: "Search admin" }}
      />

      <section className={styles.hero}>
        <span className={styles.heroLabel}>Admin Console</span>
        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroSubtitle}>{subtitle}</p>
        {actions ? <div className={styles.heroActions}>{actions}</div> : null}
      </section>

      <section className={styles.main}>
        <aside className={styles.sidebar}>
          <div>
            <h2 className={styles.sidebarTitle}>
              {user?.fullName ?? "Admin"}
            </h2>
            <p className={styles.sidebarMeta}>{user?.email}</p>
          </div>
          <nav className={styles.navLinks}>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/sellers"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              Sellers
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              Users
            </NavLink>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              Orders
            </NavLink>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              Categories
            </NavLink>
            <NavLink
              to="/admin/brands"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              Brands
            </NavLink>
            <NavLink
              to="/admin/vouchers"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              Vouchers
            </NavLink>
          </nav>
        </aside>

        <div className={styles.content}>{children}</div>
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
