 
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import { dispatchCartUpdated } from "@/app/utils/cart-event";
import { toCategorySlug } from "@/app/utils/category-slug";
import { ProductCard } from "@/component/product-card/product-card";
import { getStoredUser } from "@/features/auth/auth-storage";
import styles from "@/features/home/product-list/product-list-section.module.scss";
import { useProductList } from "@/features/home/product-list/use-product-list";
import { addToCart } from "@/services/cart-service";

type ProductListSectionProps = {
  initialCategorySlug?: string;
  searchQuery: string;
  onProductClick: (
    event: MouseEvent<HTMLAnchorElement>,
    productId: string,
  ) => Promise<void>;
};

const formatMoney = (value: number) => `$${value.toFixed(0)}`;

export const ProductListSection = ({
  initialCategorySlug,
  onProductClick,
  searchQuery,
}: ProductListSectionProps) => {
  const navigate = useNavigate();
  const {
    categories,
    error,
    isLoading,
    items,
    nextPage,
    page,
    previousPage,
    goToPage,
    selectedCategoryId,
    setCategory,
    total,
    totalPages,
  } = useProductList(searchQuery, initialCategorySlug);

  const hasItems = items.length > 0;
  const handleAddToCart = async (
    productId: string,
    productIdNumber: number | undefined,
  ) => {
    if (!productIdNumber) {
      void navigate(`/product/${productId}`);
      return;
    }

    const user = getStoredUser();

    try {
      await addToCart({
        userId: user?.id,
        productId: productIdNumber,
        quantity: 1,
      });
      dispatchCartUpdated();
    } catch {
      // Ignore add errors for now.
    }
  };

  return (
    <section className={`page-section ${styles.sectionShell}`}>
      <div className={styles.categoryRow}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={selectedCategoryId === category.id}
            className={`${styles.categoryButton} ${
              selectedCategoryId === category.id
                ? styles.categoryButtonActive
                : ""
            }`}
            onClick={() => {
              if (selectedCategoryId === category.id) {
                return;
              }

              setCategory(category.id);
              if (category.id === "all") {
                void navigate("/categories");
                return;
              }

              const categorySlug =
                category.slug || toCategorySlug(category.label);
              void navigate(`/${categorySlug}`);
            }}
            disabled={isLoading && selectedCategoryId !== category.id}
          >
            {category.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.loadingRow} aria-live="polite" aria-busy="true">
          <span className={styles.loadingBar} />
          <span className={styles.loadingBarShort} />
        </div>
      ) : null}
      {error ? <p className={styles.message}>{error}</p> : null}

      {isLoading ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 8 }, (_, index) => (
            <div key={`skeleton-${index}`} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonLineShort} />
              <div className={styles.skeletonLineLong} />
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading ? (
        <div className={styles.productGrid}>
          {items.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.image}
              to={`/product/${product.id}`}
              onLinkClick={(event) => {
                void onProductClick(event, product.id);
              }}
              renderPrice={
                <p className={styles.priceRow}>
                  <span>{formatMoney(product.price)}</span>
                  <del>{formatMoney(product.oldPrice)}</del>
                </p>
              }
              renderMeta={
                <p className={styles.metaRow}>
                  <span>{"*".repeat(product.rating)}</span>
                  <small>({product.sold})</small>
                </p>
              }
              actionLabel="Add To Cart"
              onAction={() => {
                void handleAddToCart(product.id, product.productIdNumber);
              }}
              className={styles.productCard}
              imageWrapClassName={styles.imageWrap}
              actionClassName={styles.addToCartButton}
            />
          ))}
        </div>
      ) : null}

      {!isLoading && !error && !hasItems ? (
        <p className={styles.emptyState}>
          No products matched this category or keyword.
        </p>
      ) : null}

      <div className={styles.paginationRow}>
        <button
          type="button"
          className={styles.paginationButton}
          onClick={previousPage}
          disabled={isLoading || page <= 1}
        >
          Previous
        </button>

        <div className={styles.paginationNumbers}>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                type="button"
                className={`${styles.paginationNumberButton} ${
                  page === pageNumber ? styles.paginationNumberButtonActive : ""
                }`}
                onClick={() => goToPage(pageNumber)}
                disabled={isLoading}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        <span className={styles.paginationInfo}>
          Page {page}/{totalPages} - {total} products
        </span>

        <button
          type="button"
          className={styles.paginationButton}
          onClick={nextPage}
          disabled={isLoading || page >= totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
};
