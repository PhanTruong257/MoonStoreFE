import { Image, Rate } from "antd";
import { Link, useNavigate } from "react-router-dom";

import styles from "./product-detail-page.module.scss";
import { useProductDetailData } from "./use-product-detail-data";

import { formatMoney } from "@/app/utils/format";
import { Breadcrumb } from "@/component/breadcrumb/breadcrumb";
import { ChatIcon, HeartIcon, ShopIcon } from "@/component/icons";
import { ProductCard } from "@/component/product-card/product-card";
import { UI_TEXT } from "@/const/ui-text";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { ReviewsPanel } from "@/features/reviews";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const t = UI_TEXT.product;
const h = UI_TEXT.header;

export const ProductDetailPage = () => {
  const {
    isLoading,
    isWishlisted,
    product,
    quantity,
    relatedProducts,
    selectedImage,
    unitPrice,
    missingRequiredGroups,
    isStartingChat,
    addSelectedToCart,
    chatWithSeller,
    decreaseQuantity,
    increaseQuantity,
    isOptionSelected,
    setOption,
    setSelectedImage,
    toggleWishlist,
  } = useProductDetailData();

  const navigate = useNavigate();

  if (!product && !isLoading) {
    return (
      <main className={styles.page}>
        <SiteHeader
          brand={{ label: h.brand, to: "/" }}
          navLinks={homeHeaderLinks}
          search={{ placeholder: h.searchPlaceholder }}
        />

        <section className={styles.main}>
          <Breadcrumb
            className={styles.breadcrumb}
            items={[{ label: UI_TEXT.common.home, to: "/" }, { label: t.notFound }]}
          />
          <div>
            <h1>{t.notFound}</h1>
            <p>{t.notFoundDesc}</p>
            <Link to="/">{t.backToHome}</Link>
          </div>
        </section>

        <SiteFooter
          sections={homeFooterSections}
          copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
        />
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.page}>
        <SiteHeader
          brand={{ label: h.brand, to: "/" }}
          navLinks={homeHeaderLinks}
          search={{ placeholder: h.searchPlaceholder }}
        />
        <section className={styles.main}>
          <Breadcrumb
            className={styles.breadcrumb}
            items={[{ label: UI_TEXT.common.home, to: "/" }, { label: UI_TEXT.common.loading }]}
          />
        </section>
      </main>
    );
  }

  const canAddToCart = missingRequiredGroups.length === 0;

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: h.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: h.searchPlaceholder }}
      />

      <section className={styles.main}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[
            { label: UI_TEXT.common.home, to: "/" },
            { label: product.categoryName ?? t.category },
            { label: product.name },
          ]}
        />

        <div className={styles.content}>
          <section className={styles.galleryArea}>
            <div className={styles.thumbList}>
              {product.gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={index === selectedImage ? styles.thumbActive : ""}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>

            <div className={styles.mainImageWrap}>
              <Image.PreviewGroup
                items={product.gallery}
                preview={{
                  current: selectedImage,
                  onChange: (current) => setSelectedImage(current),
                }}
              >
                <Image
                  src={product.gallery[selectedImage] ?? product.gallery[0]}
                  alt={product.name}
                  rootClassName={styles.mainImageRoot}
                  className={styles.mainImage}
                />
              </Image.PreviewGroup>
            </div>
          </section>

          <aside className={styles.infoArea}>
            <div className={styles.infoHeader}>
              <h1>{product.name}</h1>
              <div className={styles.ratingRow}>
                {product.reviews > 0 ? (
                  <>
                    <strong className={styles.ratingScore}>
                      {product.rating.toFixed(1)}
                    </strong>
                    <Rate
                      disabled
                      allowHalf
                      value={product.rating}
                      className={styles.ratingStars}
                    />
                    <span className={styles.ratingDivider} aria-hidden>
                      |
                    </span>
                    <small>{t.reviewsCount(product.reviews)}</small>
                    <span className={styles.ratingDivider} aria-hidden>
                      |
                    </span>
                  </>
                ) : null}
                <em
                  className={
                    product.inStock ? styles.inStock : styles.outOfStock
                  }
                >
                  {product.inStock ? t.inStock : t.outOfStock}
                </em>
              </div>
            </div>

            <div className={styles.priceCard}>
              <strong className={styles.priceValue}>
                {formatMoney(unitPrice)}
              </strong>
            </div>

            <div className={styles.sellerBar}>
              <div className={styles.sellerInfo}>
                <span className={styles.sellerIcon}>
                  <ShopIcon size={20} />
                </span>
                <div className={styles.sellerMeta}>
                  <small>{t.store}</small>
                  <strong>{product.sellerShopName}</strong>
                </div>
              </div>
              <button
                type="button"
                className={styles.chatSellerButton}
                onClick={() => {
                  void chatWithSeller();
                }}
                disabled={isStartingChat}
                aria-label={t.chatWithShop}
                title={t.chatWithShop}
              >
                <ChatIcon size={16} />
                <span>{isStartingChat ? t.chatOpening : t.chatWithShop}</span>
              </button>
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.optionsPanel}>
              {product.optionGroups.map((group) => {
                const isColor = group.name.toLowerCase() === "color";

                return (
                  <div key={group.id} className={styles.optionGroup}>
                    <div className={styles.optionLabel}>
                      <strong>
                        {group.name}
                        {group.required ? " *" : ""}
                      </strong>
                      {group.multiSelect ? <em>{t.multiSelectHint}</em> : null}
                    </div>
                    <div className={styles.optionWrap}>
                      {group.options.map((option) => {
                        const isSelected = isOptionSelected(group.id, option.id);
                        const buttonClass = isColor
                          ? `${styles.optionButton} ${styles.optionButtonSwatch} ${isSelected ? styles.optionSwatchActive : ""}`
                          : `${styles.optionButton} ${isSelected ? styles.optionActive : ""}`;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            className={buttonClass}
                            onClick={() => setOption(group, option.id)}
                            aria-label={t.selectOption(option.name, group.name)}
                          >
                            {isColor ? (
                              <span
                                className={styles.optionSwatch}
                                style={{ background: option.swatch ?? "#8abdcf" }}
                              />
                            ) : (
                              <span>
                                {option.name}
                                {option.priceDelta !== 0
                                  ? ` (+${formatMoney(option.priceDelta)})`
                                  : ""}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {missingRequiredGroups.length > 0 ? (
              <p className={styles.missingHint}>
                {t.missingHint}{" "}
                {missingRequiredGroups.map((g) => g.name).join(", ")}
              </p>
            ) : null}

            <div className={styles.buyRow}>
              <div className={styles.quantityBox}>
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  aria-label={t.decreaseQty}
                >
                  −
                </button>
                <strong>{quantity}</strong>
                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label={t.increaseQty}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={styles.primaryAction}
                disabled={!canAddToCart}
                onClick={() => {
                  void addSelectedToCart().then((ok) => {
                    if (ok) {
                      void navigate("/cart");
                    }
                  });
                }}
              >
                {t.buyNow}
              </button>

              <button
                type="button"
                className={styles.secondaryAction}
                disabled={!canAddToCart}
                onClick={() => {
                  void addSelectedToCart();
                }}
              >
                {t.addToCart}
              </button>

              <button
                type="button"
                className={`${styles.wishButton} ${isWishlisted ? styles.wishButtonActive : ""}`}
                onClick={toggleWishlist}
                aria-label={isWishlisted ? t.removeFromWishlist : t.addToWishlist}
                title={isWishlisted ? t.savedToWishlist : t.addToWishlist}
              >
                <HeartIcon size={20} filled={isWishlisted} />
              </button>
            </div>

            <div className={styles.policyCard}>
              <article>
                <h3>{t.freeDelivery}</h3>
                <p>{t.freeDeliveryDesc}</p>
              </article>
              <article>
                <h3>{t.returnDelivery}</h3>
                <p>{t.returnDeliveryDesc}</p>
              </article>
            </div>
          </aside>
        </div>

        <ReviewsPanel productId={product.rawId} />

        <section className={styles.relatedSection}>
          <header>
            <p>{t.relatedItems}</p>
          </header>

          <div className={styles.relatedGrid}>
            {relatedProducts.map((item) => {
              const discount = Math.round(
                ((item.oldPrice - item.price) / item.oldPrice) * 100,
              );

              return (
                <ProductCard
                  key={item.id}
                  name={item.name}
                  image={item.image}
                  to={`/product/${item.id}`}
                  discountLabel={`-${discount}%`}
                  wishlistLabel={t.wishButtonLabel}
                  renderPrice={
                    <p>
                      <strong>{formatMoney(item.price)}</strong>
                      <del>{formatMoney(item.oldPrice)}</del>
                    </p>
                  }
                  renderMeta={
                    <small className={styles.relatedMeta}>
                      <Rate
                        disabled
                        value={item.rating}
                        className={styles.relatedStars}
                      />
                      <span>({item.sold})</span>
                    </small>
                  }
                  className={styles.relatedCard}
                  imageWrapClassName={styles.relatedImageWrap}
                />
              );
            })}
          </div>
        </section>
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
      />
    </main>
  );
};
