/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Link, useNavigate } from "react-router-dom";

import styles from "./product-detail-page.module.scss";
import { useProductDetailData } from "./use-product-detail-data";

import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
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
    selectedOptions,
    selectedSku,
    addSelectedToCart,
    decreaseQuantity,
    increaseQuantity,
    setSelectedOption,
    setSelectedImage,
    toggleWishlist,
  } = useProductDetailData();

  const navigate = useNavigate();
  const effectivePrice = selectedSku
    ? Number(selectedSku.price)
    : (product?.price ?? 0);
  const fallbackOldPrice = Math.round(effectivePrice * 1.15);
  const oldPrice = product?.oldPrice ?? fallbackOldPrice;
  const discountPercent =
    oldPrice > 0
      ? Math.round(((oldPrice - effectivePrice) / oldPrice) * 100)
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
          <div className={styles.breadcrumb}>
            <span>Home</span>
            <span>/</span>
            <span>Product not found</span>
          </div>
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
          <div className={styles.breadcrumb}>
            <span>Home</span>
            <span>/</span>
            <span>Loading product...</span>
          </div>
        </section>
      </main>
    );
  }

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
        <div className={styles.breadcrumb}>
          <span>Trang chu</span>
          <span>/</span>
          <span>{product.categoryName ?? "Danh muc"}</span>
          <span>/</span>
          <span>{product.name}</span>
        </div>

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
                <strong>{formatMoney(effectivePrice)}</strong>
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
                  {formatMoney(Math.max(effectivePrice / 8, 0))}/thang
                </strong>
              </div>
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.optionsPanel}>
              {(product.optionGroups ?? []).map((group) => {
                const isColor = group.name.toLowerCase() === "color";
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const selectedValue = selectedOptions[group.name];

                return (
                  <div key={group.name} className={styles.optionGroup}>
                    <div className={styles.optionLabel}>
                      <strong>{group.name}</strong>
                      {selectedValue ? <span>{selectedValue}</span> : null}
                    </div>
                    <div className={styles.optionWrap}>
                      {group.options.map((option) => {
                        const isSelected = option.value === selectedValue;
                        const buttonClass = isColor
                          ? `${styles.optionButton} ${styles.optionButtonSwatch} ${isSelected ? styles.optionSwatchActive : ""}`
                          : `${styles.optionButton} ${isSelected ? styles.optionActive : ""}`;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            className={buttonClass}
                            onClick={() =>
                              setSelectedOption(group.name, option.value)
                            }
                            aria-label={`Select ${option.value} ${group.name}`}
                          >
                            {isColor ? (
                              <span
                                className={styles.optionSwatch}
                                style={{
                                  background: option.swatch ?? "#8abdcf",
                                }}
                              />
                            ) : (
                              option.value
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.buyRow}>
              <div className={styles.quantityBox}>
                <button type="button" onClick={decreaseQuantity}>
                  -
                </button>
                <strong>{quantity}</strong>
                <button type="button" onClick={increaseQuantity}>
                  +
                </button>
              </div>

              <button
                type="button"
                className={styles.buyNowButton}
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
                className={styles.buyNowButton}
                onClick={() => {
                  void addSelectedToCart();
                }}
              >
                Add To Cart
              </button>

              <button
                type="button"
                className={styles.wishButton}
                onClick={toggleWishlist}
              >
                {isWishlisted ? "Saved" : "Wish"}
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
                <article key={item.id} className={styles.relatedCard}>
                  <div className={styles.relatedImageWrap}>
                    <span>-{discount}%</span>
                    <img src={item.image} alt={item.name} />
                    <button type="button">Wish</button>
                  </div>

                  <Link to={`/product/${item.id}`}>
                    <h3>{item.name}</h3>
                  </Link>

                  <p>
                    <strong>{`$${item.price}`}</strong>
                    <del>{`$${item.oldPrice}`}</del>
                  </p>

                  <small>
                    {"*".repeat(item.rating)} ({item.sold})
                  </small>
                </article>
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
