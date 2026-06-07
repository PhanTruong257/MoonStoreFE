
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rate } from "antd";

import { toCategorySlug } from "@/app/utils/category-slug";
import {
  addCompareItem,
  isInCompare,
  subscribeCompareUpdated,
} from "@/app/utils/compare-store";
import { formatMoneyShort } from "@/app/utils/format";
import { ProductCard } from "@/component/product-card/product-card";
import styles from "@/features/home/product-list/product-list-section.module.scss";
import { useProductList } from "@/features/home/product-list/use-product-list";
import { UI_TEXT } from "@/const/ui-text";

const t = UI_TEXT.home.productList;

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
  const [, setCompareVersion] = useState(0);
  useEffect(() => {
    const unsub = subscribeCompareUpdated(() => setCompareVersion((v) => v + 1));
    return unsub;
  }, []);

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
                compareLabel={isInCompare(product.id) ? "✓ Đang so sánh" : "So sánh"}
                onCompare={() => {
                  addCompareItem({
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    rating: product.rating,
                  });
                }}
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
                    <div className={styles.metaRow}>
                      {product.rating > 0 ? (
                        <Rate
                          disabled
                          allowHalf
                          value={product.rating}
                          style={{ fontSize: 12, color: "#f59e0b" }}
                        />
                      ) : null}
                      {product.sold > 0 ? (
                        <small>Đã bán {product.sold}</small>
                      ) : null}
                    </div>
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
        <p className={styles.emptyState}>{t.empty}</p>
      ) : null}

      <div className={styles.paginationRow}>
        <button
          type="button"
          className={styles.paginationButton}
          onClick={previousPage}
          disabled={isLoading || page <= 1}
        >
          {t.prev}
        </button>

        <div className={styles.paginationNumbers}>
          {(() => {
            const pages: (number | string)[] = [];
            const range = 2;
            const showPages = [1];

            // Add pages around current page
            for (let i = Math.max(2, page - range); i <= Math.min(totalPages - 1, page + range); i++) {
              showPages.push(i);
            }

            // Add last page
            if (totalPages > 1) showPages.push(totalPages);

            let prevPage = 0;
            for (const pageNum of showPages) {
              if (pageNum !== prevPage + 1 && prevPage > 0) {
                pages.push("...");
              }
              pages.push(pageNum);
              prevPage = pageNum as number;
            }

            return pages.map((pageNum, idx) => {
              if (pageNum === "...") {
                return (
                  <span key={`ellipsis-${idx}`} className={styles.paginationEllipsis}>
                    {pageNum}
                  </span>
                );
              }
              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`${styles.paginationNumberButton} ${
                    page === pageNum ? styles.paginationNumberButtonActive : ""
                  }`}
                  onClick={() => goToPage(pageNum as number)}
                  disabled={isLoading}
                >
                  {pageNum}
                </button>
              );
            });
          })()}
        </div>

        <span className={styles.paginationInfo}>
          {t.pageInfo(page, totalPages, total)}
        </span>

        <button
          type="button"
          className={styles.paginationButton}
          onClick={nextPage}
          disabled={isLoading || page >= totalPages}
        >
          {t.next}
        </button>
      </div>
    </section>
  );
};
