import { Link, useNavigate } from "react-router-dom";

import styles from "./product-detail-page.module.scss";
import { useProductDetailData } from "./use-product-detail-data";

import { Breadcrumb } from "@/component/breadcrumb/breadcrumb";
import { ProductCard } from "@/component/product-card/product-card";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { ReviewsPanel } from "@/features/reviews";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

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
    addSelectedToCart,
    decreaseQuantity,
    increaseQuantity,
    isOptionSelected,
    setOption,
    setSelectedImage,
    toggleWishlist,
  } = useProductDetailData();

  const navigate = useNavigate();
  const oldPrice = product ? Math.round(unitPrice * 1.15) : 0;
  const discountPercent =
    oldPrice > 0
      ? Math.round(((oldPrice - unitPrice) / oldPrice) * 100)
      : 0;

  if (!product && !isLoading) {
    return (
      <main className={styles.page}>
        <SiteHeader
          brand={{ label: "Exclusive", to: "/" }}
          navLinks={homeHeaderLinks}
          promo={{
            message:
              "Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!",
            linkLabel: "ShopNow",
            to: "/",
          }}
          search={{ placeholder: "What are you looking for?" }}
        />

        <section className={styles.main}>
          <Breadcrumb
            className={styles.breadcrumb}
            items={[{ label: "Home", to: "/" }, { label: "Product not found" }]}
          />
          <div>
            <h1>Product not found</h1>
            <p>We could not find that product. It may be unavailable.</p>
            <Link to="/">Back to home</Link>
          </div>
        </section>

        <SiteFooter
          sections={homeFooterSections}
          copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
        />
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.page}>
        <SiteHeader
          brand={{ label: "Exclusive", to: "/" }}
          navLinks={homeHeaderLinks}
          promo={{
            message:
              "Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!",
            linkLabel: "ShopNow",
            to: "/",
          }}
          search={{ placeholder: "What are you looking for?" }}
        />
        <section className={styles.main}>
          <Breadcrumb
            className={styles.breadcrumb}
            items={[{ label: "Home", to: "/" }, { label: "Loading product..." }]}
          />
        </section>
      </main>
    );
  }

  const canAddToCart = missingRequiredGroups.length === 0;

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: "Exclusive", to: "/" }}
        navLinks={homeHeaderLinks}
        promo={{
          message:
            "Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!",
          linkLabel: "ShopNow",
          to: "/",
        }}
        search={{ placeholder: "What are you looking for?" }}
      />

      <section className={styles.main}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[
            { label: "Trang chu", to: "/" },
            { label: product.categoryName ?? "Danh muc" },
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
              <img
                src={product.gallery[selectedImage] ?? product.gallery[0]}
                alt={product.name}
              />
            </div>
          </section>

          <aside className={styles.infoArea}>
            <div className={styles.infoHeader}>
              <h1>{product.name}</h1>
              <div className={styles.ratingRow}>
                <span>{"*".repeat(product.rating)}</span>
                <small>{product.reviews} danh gia</small>
                <em>{product.inStock ? "Con hang" : "Het hang"}</em>
              </div>
            </div>

            <div className={styles.priceCard}>
              <div className={styles.priceMain}>
                <strong>{formatMoney(unitPrice)}</strong>
                {discountPercent > 0 ? (
                  <span className={styles.priceBadge}>-{discountPercent}%</span>
                ) : null}
              </div>
              <div className={styles.priceMeta}>
                <span>{formatMoney(oldPrice)}</span>
                <small>Gia cu</small>
              </div>
              <div className={styles.installment}>
                Tra gop tu{" "}
                <strong>
                  {formatMoney(Math.max(unitPrice / 8, 0))}/thang
                </strong>
              </div>
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
                      {group.multiSelect ? <em>(chon nhieu)</em> : null}
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
                            aria-label={`Select ${option.name} ${group.name}`}
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
                Vui long chon:{" "}
                {missingRequiredGroups.map((g) => g.name).join(", ")}
              </p>
            ) : null}

            <div className={styles.buyRow}>
              <div className={styles.quantityBox}>
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <strong>{quantity}</strong>
                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
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
                Buy Now
              </button>

              <button
                type="button"
                className={styles.secondaryAction}
                disabled={!canAddToCart}
                onClick={() => {
                  void addSelectedToCart();
                }}
              >
                Add to cart
              </button>

              <button
                type="button"
                className={`${styles.wishButton} ${isWishlisted ? styles.wishButtonActive : ""}`}
                onClick={toggleWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                title={isWishlisted ? "Saved to wishlist" : "Add to wishlist"}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={isWishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <div className={styles.policyCard}>
              <article>
                <h3>Free Delivery</h3>
                <p>Enter your postal code for Delivery Availability</p>
              </article>
              <article>
                <h3>Return Delivery</h3>
                <p>Free 30 Days Delivery Returns. Details</p>
              </article>
            </div>
          </aside>
        </div>

        <ReviewsPanel productId={product.rawId} />

        <section className={styles.relatedSection}>
          <header>
            <p>Related Item</p>
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
                  wishlistLabel="Wish"
                  renderPrice={
                    <p>
                      <strong>{`$${item.price}`}</strong>
                      <del>{`$${item.oldPrice}`}</del>
                    </p>
                  }
                  renderMeta={
                    <small>
                      {"*".repeat(item.rating)} ({item.sold})
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
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
