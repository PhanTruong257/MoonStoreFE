import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { SharedButton } from "@/component/shared-button/shared-button";
import { SharedInput } from "@/component/shared-input/shared-input";
import { HEADER_TEXT } from "@/const/header.const";
import styles from "@/features/layout/components/site-header.module.scss";
import type { AppDispatch, RootState } from "@/app/app-store";
import type { AuthState } from "@/features/auth/auth-slice";
import { authActions } from "@/features/auth/auth-slice";

type HeaderLink = {
  label: string;
  to: string;
};

type PromoConfig = {
  message: string;
  linkLabel: string;
  to: string;
};

type SearchConfig = {
  placeholder: string;
  ariaLabel?: string;
  actionLabel?: string;
};

type SiteHeaderProps = {
  brand: HeaderLink;
  navLinks: HeaderLink[];
  promo?: PromoConfig;
  search?: SearchConfig;
};

export const SiteHeader = ({
  brand,
  navLinks,
  promo,
  search,
}: SiteHeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const selectAuth = (state: RootState): AuthState => state.auth as AuthState;
  const { user } = useSelector(selectAuth);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    dispatch(authActions.logoutRequested());
  };

  return (
    <header className={styles.header}>
      {promo ? (
        <div className={styles.promoBar}>
          <span>{promo.message}</span>
          <Link to={promo.to}>{promo.linkLabel}</Link>
        </div>
      ) : null}

      <div className={styles.navRow}>
        <Link to={brand.to} className={styles.brand}>
          {brand.label}
        </Link>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link key={`${link.label}-${link.to}`} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {search ? (
            <div className={styles.searchWrap}>
              <SharedInput
                placeholder={search.placeholder}
                ariaLabel={
                  search.ariaLabel ?? HEADER_TEXT.defaultSearchAriaLabel
                }
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
              <SharedButton
                variant="text"
                label={
                  search.actionLabel ?? HEADER_TEXT.defaultSearchActionLabel
                }
              />
            </div>
          ) : null}

          <div className={styles.accountMenu}>
            {user ? (
              <>
                <button
                  type="button"
                  className={styles.accountButton}
                  onClick={toggleMenu}
                >
                  {user.fullName || "Account"}
                </button>
                {isMenuOpen ? (
                  <div className={styles.accountDropdown}>
                    <Link
                      to="/account"
                      className={styles.accountItem}
                      onClick={closeMenu}
                    >
                      Account settings
                    </Link>
                    <button
                      type="button"
                      className={styles.accountItem}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <Link className={styles.loginLink} to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
