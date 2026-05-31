import type { MouseEvent } from "react";
import { Rate } from "antd";

import { formatMoneyShort } from "@/app/utils/format";
import { ProductCard } from "@/component/product-card/product-card";
import styles from "@/features/home/flash-sale/flash-sale-section.module.scss";
import { useFlashSale } from "@/features/home/flash-sale/use-flash-sale";
import { UI_TEXT } from "@/const/ui-text";

const t = UI_TEXT.home.flashSale;

type FlashSaleSectionProps = {
  searchQuery: string;
  selectedCategoryId: string;
  onProductClick: (
    event: MouseEvent<HTMLAnchorElement>,
    productId: string,
  ) => Promise<void>;
};

const formatMoney = formatMoneyShort;

const formatCountdownPart = (value: number) =>
  value.toString().padStart(2, "0");

export const FlashSaleSection = ({
  onProductClick,
  searchQuery,
  selectedCategoryId,
}: FlashSaleSectionProps) => {
  const {
    activeCategory,
    cartCount,
    categories,
    countdown,
    nextFlash,
    previousFlash,
    setActiveCategory,
    showAll,
    toggleFlashView,
    toggleWishlist,
    visibleFlashProducts,
    wishlistMap,
    addToCart,
  } = useFlashSale(searchQuery, selectedCategoryId);

  return (
    <section className="page-section">
      <header className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionLabel}>{t.label}</p>
          <h2>{t.title}</h2>
        </div>

        <div className={styles.countdownWrap}>
          <span>
            <strong>{formatCountdownPart(countdown.days)}</strong>
            <small>{t.days}</small>
          </span>
          <span>
            <strong>{formatCountdownPart(countdown.hours)}</strong>
            <small>{t.hours}</small>
          </span>
          <span>
            <strong>{formatCountdownPart(countdown.minutes)}</strong>
            <small>{t.minutes}</small>
          </span>
          <span>
            <strong>{formatCountdownPart(countdown.seconds)}</strong>
            <small>{t.seconds}</small>
          </span>
        </div>
      </header>

      <div className={styles.filterRow}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={
              activeCategory === category.id ? styles.filterActive : ""
            }
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}

        <div className={styles.arrowControls}>
          <button type="button" onClick={previousFlash}>
            &lt;
          </button>
          <button type="button" onClick={nextFlash}>
            &gt;
          </button>
        </div>
      </div>

      <div className={styles.productGrid}>
        {visibleFlashProducts.map((product) => {
          const discount = Math.round(
            ((product.oldPrice - product.price) / product.oldPrice) * 100,
          );

          return (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.image}
              to={`/product/${product.id}`}
              onLinkClick={(event) => {
                void onProductClick(event, product.id);
              }}
              discountLabel={`-${discount}%`}
              wishlistLabel={wishlistMap[product.id] ? t.saved : t.wish}
              onWishlist={() => toggleWishlist(product.id)}
              renderPrice={
                <p className={styles.priceRow}>
                  <span>{formatMoney(product.price)}</span>
                  <del>{formatMoney(product.oldPrice)}</del>
                </p>
              }
              renderMeta={
                <p className={styles.metaRow}>
                  <Rate disabled allowHalf value={product.rating} style={{ fontSize: 12, color: "#f59e0b" }} />
                  {product.sold > 0 ? <small>Đã bán {product.sold}</small> : null}
                </p>
              }
              actionLabel={t.addToCart}
              onAction={() => {
                addToCart(product.id, product.productIdNumber, product.name);
              }}
              className={styles.productCard}
              imageWrapClassName={styles.imageWrap}
              discountClassName={styles.discountTag}
              wishlistClassName={styles.wishlistButton}
              actionClassName={styles.addToCartButton}
            />
          );
        })}
      </div>

      <div className={styles.centerRow}>
        <button
          type="button"
          className={styles.viewAllButton}
          onClick={toggleFlashView}
        >
          {showAll ? t.showLess : t.viewAll} ({t.inCart(cartCount)})
        </button>
      </div>
    </section>
  );
};
