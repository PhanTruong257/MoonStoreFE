import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import styles from "./admin-shell.module.scss";

import type { RootState } from "@/app/app-store";
import { UI_TEXT } from "@/const/ui-text";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeHeaderLinks } from "@/pages/home/mock-data";

const ta = UI_TEXT.admin;

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
        brand={{ label: UI_TEXT.header.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: UI_TEXT.header.searchPlaceholder }}
      />

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
              {ta.nav.dashboard}
            </NavLink>
            <NavLink
              to="/admin/sellers"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ta.nav.sellers}
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ta.nav.users}
            </NavLink>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ta.nav.orders}
            </NavLink>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ta.nav.categories}
            </NavLink>
            <NavLink
              to="/admin/brands"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ta.nav.brands}
            </NavLink>
            <NavLink
              to="/admin/vouchers"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ta.nav.vouchers}
            </NavLink>
            <NavLink
              to="/admin/revenue"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ta.nav.revenue}
            </NavLink>
            <NavLink
              to="/admin/withdrawals"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ta.nav.withdrawals}
            </NavLink>
            <NavLink
              to="/admin/shippers"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ta.nav.shippers}
            </NavLink>
            <NavLink
              to="/admin/shipments"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ta.nav.shipments}
            </NavLink>
            <NavLink
              to="/admin/returns"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ""}`
              }
            >
              {ta.nav.returns}
            </NavLink>
          </nav>
        </aside>

        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <div>
              <h2 className={styles.contentTitle}>{title}</h2>
              {subtitle ? <p className={styles.contentSubtitle}>{subtitle}</p> : null}
            </div>
            {actions ? <div>{actions}</div> : null}
          </div>
          {children}
        </div>
      </section>
    </main>
  );
};
