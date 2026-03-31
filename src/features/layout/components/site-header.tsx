import { useState } from "react";
import { Link } from "react-router-dom";

import { SharedButton } from "@/component/shared-button/shared-button";
import { SharedInput } from "@/component/shared-input/shared-input";
import { HEADER_TEXT } from "@/const/header.const";
import styles from "@/features/layout/components/site-header.module.scss";

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

        {search ? (
          <div className={styles.searchWrap}>
            <SharedInput
              placeholder={search.placeholder}
              ariaLabel={search.ariaLabel ?? HEADER_TEXT.defaultSearchAriaLabel}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <SharedButton
              variant="text"
              label={search.actionLabel ?? HEADER_TEXT.defaultSearchActionLabel}
            />
          </div>
        ) : (
          <div />
        )}
      </div>
    </header>
  );
};
