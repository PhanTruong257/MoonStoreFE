 
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "@/app/app-store";
import { toCategorySlug } from "@/app/utils/category-slug";
import { HEADER_TEXT } from "@/const/header.const";
import type { AuthState } from "@/features/auth/auth-slice";
import { authActions } from "@/features/auth/auth-slice";
import { getStoredUser } from "@/features/auth/auth-storage";
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
  const keywords = search?.keywords ?? [
    "iphone 17",
    "laptop",
    "samsung",
    "iphone 16",
    "macbook",
    "ipad",
    "macbook neo",
    "may lanh",
  ];
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

    const handleCartUpdated = () => {
      void loadCartCount();
    };

    void loadCartCount();
    window.addEventListener("cart:updated", handleCartUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("cart:updated", handleCartUpdated);
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
              <span>{categoryLink?.label ?? "Category"}</span>
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
              <button type="button" aria-label="Search">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    d="M11 4a7 7 0 1 0 4.9 12.1l3.5 3.5 1.4-1.4-3.5-3.5A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.searchHints}>
              {keywords.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => {
                    setSearchValue(keyword);
                    search.onChange?.(keyword);
                  }}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className={styles.actions}>
          <div className={styles.accountMenu}>
            {user ? (
              <>
                <button
                  type="button"
                  className={styles.accountButton}
                  onClick={toggleMenu}
                >
                  <span className={styles.accountIcon}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span>{user.fullName || "Tai khoan"}</span>
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
                    <Link
                      to="/orders"
                      className={styles.accountItem}
                      onClick={closeMenu}
                    >
                      My orders
                    </Link>
                    {user.role === "admin" ? (
                      <Link
                        to="/admin"
                        className={styles.accountItem}
                        onClick={closeMenu}
                      >
                        Admin console
                      </Link>
                    ) : null}
                    {user.role === "seller" ? (
                      <Link
                        to="/seller"
                        className={styles.accountItem}
                        onClick={closeMenu}
                      >
                        Seller hub
                      </Link>
                    ) : user.role === "user" ? (
                      <Link
                        to="/seller/apply"
                        className={styles.accountItem}
                        onClick={closeMenu}
                      >
                        Become a seller
                      </Link>
                    ) : null}
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
                <span className={styles.accountIcon}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span>Dang nhap</span>
              </Link>
            )}
          </div>

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
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7 6h14l-2 8H8L6.2 3H3v2h2l2.2 11h12.6l2.4-10H7V6zm1 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
                  fill="currentColor"
                />
              </svg>
              {resolvedCartCount > 0 ? (
                <span className={styles.cartBadge}>
                  {resolvedCartCount > 99 ? "99+" : resolvedCartCount}
                </span>
              ) : null}
            </span>
            <span>Gio hang</span>
          </button>
        </div>
      </div>
    </header>
  );
};
