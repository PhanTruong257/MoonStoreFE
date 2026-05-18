
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import { toCategorySlug } from "@/app/utils/category-slug";
import { formatMoneyShort } from "@/app/utils/format";
import { ProductCard } from "@/component/product-card/product-card";
import styles from "@/features/home/product-list/product-list-section.module.scss";
import { useProductList } from "@/features/home/product-list/use-product-list";

type ProductListSectionProps = {
  initialCategorySlug?: string;
  searchQuery: string;
  onProductClick: (
    event: MouseEvent<HTMLAnchorElement>,
    productId: string,
  ) => Promise<void>;
};

const formatMoney = formatMoneyShort;

const calculateDiscountPercent = (price: number, oldPrice: number) => {
  if (!oldPrice || oldPrice <= price) {
    return 0;
  }
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

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
          {items.map((product) => {
            const discountPercent = calculateDiscountPercent(
              product.price,
              product.oldPrice,
            );
            const savings = product.oldPrice - product.price;
            return (
              <ProductCard
                key={product.id}
                name={product.name}
                image={product.image}
                to={`/product/${product.id}`}
                onLinkClick={(event) => {
                  void onProductClick(event, product.id);
                }}
                discountLabel={
                  discountPercent > 0 ? `Giảm ${discountPercent}%` : undefined
                }
                renderPrice={
                  <div className={styles.priceBlock}>
                    {product.oldPrice > product.price ? (
                      <del className={styles.oldPrice}>
                        {formatMoney(product.oldPrice)}
                      </del>
                    ) : null}
                    <strong className={styles.currentPrice}>
                      {formatMoney(product.price)}
                    </strong>
                    {savings > 0 ? (
                      <span className={styles.savings}>
                        Giảm {formatMoney(savings)}
                      </span>
                    ) : null}
                  </div>
                }
                renderMeta={
                  product.rating > 0 || product.sold > 0 ? (
                    <p className={styles.metaRow}>
                      {product.rating > 0 ? (
                        <span aria-label={`Rating ${product.rating}`}>
                          {"★".repeat(product.rating)}
                          <span className={styles.metaRatingDim}>
                            {"★".repeat(Math.max(0, 5 - product.rating))}
                          </span>
                        </span>
                      ) : null}
                      {product.sold > 0 ? (
                        <small>Đã bán {product.sold}</small>
                      ) : null}
                    </p>
                  ) : null
                }
                className={styles.productCard}
                imageWrapClassName={styles.imageWrap}
                discountClassName={styles.discountTag}
              />
            );
          })}
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
