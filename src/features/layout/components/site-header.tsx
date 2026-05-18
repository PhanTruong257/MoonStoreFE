import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "@/app/app-store";
import { subscribeCartUpdated } from "@/app/utils/cart-event";
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
import { fetchCartByUser } from "@/services/cart-service";
import { fetchCategories } from "@/services/catalog-service";

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
  value?: string;
  onChange?: (value: string) => void;
  keywords?: string[];
};

type SiteHeaderProps = {
  brand: HeaderLink;
  navLinks: HeaderLink[];
  promo?: PromoConfig;
  search?: SearchConfig;
  categoryLink?: HeaderLink;
  categoryItems?: HeaderLink[];
  cartCount?: number;
};

export const SiteHeader = ({
  brand,
  search,
  categoryLink,
  categoryItems,
  cartCount,
}: SiteHeaderProps) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const inputValue = search?.value ?? searchValue;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [apiCategoryItems, setApiCategoryItems] = useState<HeaderLink[]>([]);
  const resolvedCategoryItems =
    categoryItems ??
    (apiCategoryItems.length > 0
      ? apiCategoryItems
      : [
          { label: "Dien thoai", to: "/categories" },
          { label: "Laptop", to: "/categories" },
          { label: "May tinh bang", to: "/categories" },
          { label: "Tai nghe", to: "/categories" },
          { label: "Dong ho", to: "/categories" },
          { label: "Phu kien", to: "/categories" },
        ]);
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
    if (!isLoggedIn || !activeUserId) {
      return;
    }

    let isMounted = true;

    const loadCartCount = async () => {
      try {
        const cart = await fetchCartByUser(activeUserId);
        if (!isMounted) {
          return;
        }
        const nextCount = cart.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        setApiCartCount(nextCount);
      } catch {
        if (!isMounted) {
          return;
        }
        setApiCartCount(0);
      }
    };

    void loadCartCount();
    const unsubscribe = subscribeCartUpdated(() => {
      void loadCartCount();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isLoggedIn, activeUserId]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        if (!isMounted) {
          return;
        }

        const topLevelCategories = categories.filter(
          (item) => item.parentId == null,
        );
        setApiCategoryItems(
          topLevelCategories.map((item) => ({
            label: item.name,
            to: `/${toCategorySlug(item.name)}`,
          })),
        );
      } catch {
        if (!isMounted) {
          return;
        }
        setApiCategoryItems([]);
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    dispatch(authActions.logoutRequested());
  };

  return (
    <header className={styles.header}>
      <div className={styles.mainRow}>
        <div className={styles.brandArea}>
          <Link to={brand.to} className={styles.brand}>
            {brand.label}
          </Link>
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
              <span>{categoryLink?.label ?? UI_TEXT.header.categoryLabel}</span>
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
        </div>

        {search ? (
          <div className={styles.searchArea}>
            <div className={styles.searchBar}>
              <input
                placeholder={search.placeholder}
                aria-label={
                  search.ariaLabel ?? HEADER_TEXT.defaultSearchAriaLabel
                }
                value={inputValue}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setSearchValue(nextValue);
                  search.onChange?.(nextValue);
                }}
              />
              <button type="button" aria-label={UI_TEXT.header.searchAriaLabel}>
                <SearchIcon size={18} />
              </button>
            </div>
          </div>
        ) : null}

        <div className={styles.actions}>
          <div
            className={styles.accountMenu}
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            {user ? (
              <>
                <button type="button" className={styles.accountButton}>
                  <span className={styles.accountIcon}>
                    <UserIcon size={18} />
                  </span>
                  <span>{user.fullName || UI_TEXT.header.login}</span>
                </button>
                <div
                  className={`${styles.accountDropdown} ${isMenuOpen ? styles.accountDropdownOpen : ""}`}
                >
                  <Link
                    to="/account"
                    className={styles.accountItem}
                    onClick={closeMenu}
                  >
                    {UI_TEXT.header.accountSettings}
                  </Link>
                  <Link
                    to="/orders"
                    className={styles.accountItem}
                    onClick={closeMenu}
                  >
                    {UI_TEXT.header.myOrders}
                  </Link>
                  <Link
                    to={CHAT_ROUTES.buyerList}
                    className={styles.accountItem}
                    onClick={closeMenu}
                  >
                    {UI_TEXT.header.messages}
                    {unreadChatCount > 0 ? (
                      <span className={styles.accountItemBadge}>
                        {unreadChatCount > 99 ? "99+" : unreadChatCount}
                      </span>
                    ) : null}
                  </Link>
                  {user.role === "admin" ? (
                    <Link
                      to="/admin"
                      className={styles.accountItem}
                      onClick={closeMenu}
                    >
                      {UI_TEXT.header.adminConsole}
                    </Link>
                  ) : null}
                  {user.role === "seller" ? (
                    <Link
                      to="/seller"
                      className={styles.accountItem}
                      onClick={closeMenu}
                    >
                      {UI_TEXT.header.sellerHub}
                    </Link>
                  ) : user.role === "user" ? (
                    <Link
                      to="/seller/apply"
                      className={styles.accountItem}
                      onClick={closeMenu}
                    >
                      {UI_TEXT.header.becomeSeller}
                    </Link>
                  ) : null}
                  <div className={styles.accountDivider} />
                  <button
                    type="button"
                    className={`${styles.accountItem} ${styles.accountItemLogout}`}
                    onClick={handleLogout}
                  >
                    {UI_TEXT.header.logout}
                  </button>
                </div>
              </>
            ) : (
              <Link className={styles.loginLink} to="/login">
                <span className={styles.accountIcon}>
                  <UserIcon size={18} />
                </span>
                <span>{UI_TEXT.header.login}</span>
              </Link>
            )}
          </div>

          {isLoggedIn ? (
            <button
              type="button"
              className={styles.chatButton}
              onClick={() => {
                void navigate(CHAT_ROUTES.buyerList);
              }}
              aria-label={UI_TEXT.header.messages}
            >
              <span className={styles.chatIcon}>
                <ChatIcon size={18} />
                {unreadChatCount > 0 ? (
                  <span className={styles.cartBadge}>
                    {unreadChatCount > 99 ? "99+" : unreadChatCount}
                  </span>
                ) : null}
              </span>
              <span>{UI_TEXT.header.messages}</span>
            </button>
          ) : null}

          <button
            type="button"
            className={styles.cartButton}
            onClick={() => {
              if (isLoggedIn) {
                void navigate("/cart");
              } else {
                void navigate("/login", { state: { from: "/cart" } });
              }
            }}
          >
            <span className={styles.cartIcon}>
              <CartIcon size={18} />
              {resolvedCartCount > 0 ? (
                <span className={styles.cartBadge}>
                  {resolvedCartCount > 99 ? "99+" : resolvedCartCount}
                </span>
              ) : null}
            </span>
            <span>{UI_TEXT.header.cartLabel}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
