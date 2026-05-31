import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "@/app/app-store";
import { subscribeCartUpdated } from "@/app/utils/cart-event";
import {
  addSavedSearch,
  clearSavedSearches,
  getSavedSearches,
  removeSavedSearch,
} from "@/app/utils/saved-searches";
import { toCategorySlug } from "@/app/utils/category-slug";
import { CHAT_ROUTES } from "@/const/chat.const";
import { HEADER_TEXT } from "@/const/header.const";
import { UI_TEXT } from "@/const/ui-text";
import { CartIcon, ChatIcon, SearchIcon, UserIcon } from "@/component/icons";
import type { AuthState } from "@/features/auth/auth-slice";
import { authActions } from "@/features/auth/auth-slice";
import { getStoredUser } from "@/features/auth/auth-storage";
import { useUnreadCount } from "@/features/chat/use-unread-count";
import styles from "@/features/layout/components/site-header.module.scss";
import { fetchMyCart } from "@/services/cart-service";
import { fetchCategories } from "@/services/catalog-service";

type HeaderLink = {
  label: string;
  to: string;
};

type SearchConfig = {
  placeholder: string;
  ariaLabel?: string;
  actionLabel?: string;
  value?: string;
  onChange?: (value: string) => void;
  keywords?: string[];
};

type SiteHeaderProps = {
  brand: HeaderLink;
  navLinks: HeaderLink[];
  search?: SearchConfig;
  categoryLink?: HeaderLink;
  categoryItems?: HeaderLink[];
  cartCount?: number;
  promo?: { message: string; linkLabel: string; to: string };
};

export const SiteHeader = ({
  brand,
  navLinks,
  search,
  categoryLink,
  categoryItems,
  cartCount,
}: SiteHeaderProps) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const inputValue = search?.value ?? searchValue;
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [apiCategoryItems, setApiCategoryItems] = useState<HeaderLink[]>([]);

  const resolvedCategoryItems =
    categoryItems ??
    (apiCategoryItems.length > 0 ? apiCategoryItems : []);

  const dispatch = useDispatch<AppDispatch>();
  const selectAuth = (state: RootState): AuthState => state.auth;
  const { user } = useSelector(selectAuth);
  const storedUser = getStoredUser();
  const isLoggedIn = Boolean(user ?? storedUser);
  const [apiCartCount, setApiCartCount] = useState(0);
  const resolvedCartCount = !isLoggedIn
    ? 0
    : typeof cartCount === "number"
      ? cartCount
      : apiCartCount;

  const activeUserId = user?.id ?? storedUser?.id;
  const unreadChatCount = useUnreadCount(isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn || !activeUserId) return;

    let isMounted = true;
    const loadCartCount = async () => {
      try {
        const cart = await fetchMyCart();
        if (!isMounted) return;
        const nextCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        setApiCartCount(nextCount);
      } catch {
        if (!isMounted) return;
        setApiCartCount(0);
      }
    };

    void loadCartCount();
    const unsubscribe = subscribeCartUpdated(() => { void loadCartCount(); });
    return () => { isMounted = false; unsubscribe(); };
  }, [isLoggedIn, activeUserId]);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        if (!isMounted) return;
        const top = categories.filter((c) => c.parentId == null);
        setApiCategoryItems(
          top.map((c) => ({ label: c.name, to: `/${toCategorySlug(c.name)}` })),
        );
      } catch {
        if (!isMounted) return;
      }
    };
    void loadCategories();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setIsHistoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = () => {
    const query = inputValue.trim();
    if (query) {
      addSavedSearch(query);
      setSavedSearches(getSavedSearches());
    }
    setIsHistoryOpen(false);
  };

  const handleSearchFocus = () => {
    setSavedSearches(getSavedSearches());
    setIsHistoryOpen(true);
  };

  const handleHistorySelect = (query: string) => {
    search?.onChange?.(query);
    setSearchValue(query);
    setIsHistoryOpen(false);
  };

  const handleHistoryDelete = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    removeSavedSearch(query);
    setSavedSearches(getSavedSearches());
  };

  const handleHistoryClear = () => {
    clearSavedSearches();
    setSavedSearches([]);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    dispatch(authActions.logoutRequested());
  };

  const t = UI_TEXT.header;

  return (
    <header className={styles.header}>
      {/* ── Top utility strip ── */}
      <div className={styles.topStrip}>
        <div className={styles.topInner}>
          <span className={styles.topPromo}>{t.promoMessage}</span>
          <div className={styles.topLinks}>
            {user?.role === "user" ? (
              <Link to="/seller/apply" className={styles.topLink}>
                {t.becomeSeller}
              </Link>
            ) : user?.role === "seller" ? (
              <Link to="/seller" className={styles.topLink}>
                {t.sellerHub}
              </Link>
            ) : null}
            <Link to="/orders" className={styles.topLink}>
              {t.myOrders}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main row: logo | search | icons ── */}
      <div className={styles.mainRow}>
        <Link to={brand.to} className={styles.brand}>
          {brand.label}
        </Link>

        {search ? (
          <div className={styles.searchWrapper} ref={searchWrapRef}>
            <div className={styles.searchBar}>
              <input
                placeholder={search.placeholder}
                aria-label={search.ariaLabel ?? HEADER_TEXT.defaultSearchAriaLabel}
                value={inputValue}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setSearchValue(nextValue);
                  search.onChange?.(nextValue);
                }}
                onFocus={handleSearchFocus}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit();
                  if (e.key === "Escape") setIsHistoryOpen(false);
                }}
              />
              <button
                type="button"
                aria-label={t.searchAriaLabel}
                onClick={handleSearchSubmit}
              >
                <SearchIcon size={18} />
              </button>
            </div>

            {isHistoryOpen && savedSearches.length > 0 ? (
              <div className={styles.searchHistoryDropdown}>
                <div className={styles.searchHistoryHeader}>
                  <span>Tìm kiếm gần đây</span>
                  <button
                    type="button"
                    className={styles.searchHistoryClear}
                    onClick={handleHistoryClear}
                  >
                    Xóa tất cả
                  </button>
                </div>
                {savedSearches.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={styles.searchHistoryItem}
                    onClick={() => handleHistorySelect(q)}
                  >
                    <span className={styles.searchHistoryItemText}>{q}</span>
                    <span
                      role="button"
                      aria-label={`Xóa "${q}"`}
                      className={styles.searchHistoryItemDelete}
                      onClick={(e) => handleHistoryDelete(e, q)}
                    >
                      ×
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Icon action buttons */}
        <div className={styles.actions}>
          {isLoggedIn ? (
            <button
              type="button"
              className={styles.iconBtn}
              title={t.messages}
              onClick={() => void navigate(CHAT_ROUTES.buyerList)}
              aria-label={t.messages}
            >
              <ChatIcon size={22} />
              {unreadChatCount > 0 ? (
                <span className={styles.iconBtnBadge}>
                  {unreadChatCount > 99 ? "99+" : unreadChatCount}
                </span>
              ) : null}
            </button>
          ) : null}

          <button
            type="button"
            className={styles.iconBtn}
            title={t.cartLabel}
            onClick={() => {
              if (isLoggedIn) {
                void navigate("/cart");
              } else {
                void navigate("/login", { state: { from: "/cart" } });
              }
            }}
            aria-label={t.cartLabel}
          >
            <CartIcon size={22} />
            {resolvedCartCount > 0 ? (
              <span className={styles.iconBtnBadge}>
                {resolvedCartCount > 99 ? "99+" : resolvedCartCount}
              </span>
            ) : null}
          </button>

          <div
            className={styles.accountMenu}
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            {user ? (
              <>
                <button type="button" className={styles.iconBtn} title={user.fullName}>
                  <UserIcon size={22} />
                </button>
                <div
                  className={`${styles.accountDropdown} ${
                    isMenuOpen ? styles.accountDropdownOpen : ""
                  }`}
                >
                  <Link to="/account" className={styles.accountItem} onClick={closeMenu}>
                    {t.accountSettings}
                  </Link>
                  <Link to="/orders" className={styles.accountItem} onClick={closeMenu}>
                    {t.myOrders}
                  </Link>
                  <Link
                    to={CHAT_ROUTES.buyerList}
                    className={styles.accountItem}
                    onClick={closeMenu}
                  >
                    {t.messages}
                    {unreadChatCount > 0 ? (
                      <span className={styles.accountItemBadge}>
                        {unreadChatCount > 99 ? "99+" : unreadChatCount}
                      </span>
                    ) : null}
                  </Link>
                  {user.role === "admin" ? (
                    <Link to="/admin" className={styles.accountItem} onClick={closeMenu}>
                      {t.adminConsole}
                    </Link>
                  ) : null}
                  {user.role === "seller" ? (
                    <Link to="/seller" className={styles.accountItem} onClick={closeMenu}>
                      {t.sellerHub}
                    </Link>
                  ) : user.role === "user" ? (
                    <Link to="/seller/apply" className={styles.accountItem} onClick={closeMenu}>
                      {t.becomeSeller}
                    </Link>
                  ) : null}
                  <div className={styles.accountDivider} />
                  <button
                    type="button"
                    className={`${styles.accountItem} ${styles.accountItemLogout}`}
                    onClick={handleLogout}
                  >
                    {t.logout}
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className={styles.iconBtn} title={t.login} aria-label={t.login}>
                <UserIcon size={22} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Nav row: categories + page links ── */}
      <div className={styles.navRow}>
        <nav className={styles.navInner}>
          <div
            className={styles.categoryMenu}
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button
              type="button"
              className={styles.categoryButton}
              aria-haspopup="menu"
              aria-expanded={isCategoryOpen}
              onClick={() => setIsCategoryOpen((prev) => !prev)}
            >
              <span className={styles.categoryIcon}>
                <span />
                <span />
                <span />
              </span>
              <span>{categoryLink?.label ?? t.categoryLabel}</span>
            </button>

            <div
              className={`${styles.categoryDropdown} ${
                isCategoryOpen ? styles.categoryDropdownOpen : ""
              }`}
              role="menu"
            >
              {resolvedCategoryItems.map((item) => (
                <Link
                  key={`${item.label}-${item.to}`}
                  to={item.to}
                  className={styles.categoryItem}
                  onClick={() => setIsCategoryOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
