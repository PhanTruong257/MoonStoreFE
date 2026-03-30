import { Link, Navigate } from "react-router-dom";

import styles from "./product-detail-page.module.scss";
import { useProductDetailData } from "./use-product-detail-data";

import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

export const ProductDetailPage = () => {
  const {
    isWishlisted,
    product,
    quantity,
    relatedProducts,
    selectedColor,
    selectedImage,
    selectedSize,
    decreaseQuantity,
    increaseQuantity,
    setSelectedColor,
    setSelectedImage,
    setSelectedSize,
    toggleWishlist,
  } = useProductDetailData();

  if (!product) {
    return <Navigate to="/" replace />;
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
          <span>Account</span>
          <span>/</span>
          <span>Gaming</span>
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
            <h1>{product.name}</h1>

            <div className={styles.ratingRow}>
              <span>{"*".repeat(product.rating)}</span>
              <small>({product.reviews} Reviews)</small>
              <em>{product.inStock ? "In Stock" : "Out of Stock"}</em>
            </div>

            <p className={styles.price}>{formatMoney(product.price)}</p>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.metaRow}>
              <strong>Colours:</strong>
              <div className={styles.colorWrap}>
                {product.colors.map((color, index) => (
                  <button
                    key={color.id}
                    type="button"
                    className={
                      index === selectedColor ? styles.colorActive : ""
                    }
                    onClick={() => setSelectedColor(index)}
                    aria-label={`Select ${color.id} color`}
                  >
                    <span style={{ background: color.hex }} />
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.metaRow}>
              <strong>Size:</strong>
              <div className={styles.sizeWrap}>
                {product.sizes.map((size, index) => (
                  <button
                    key={size}
                    type="button"
                    className={index === selectedSize ? styles.sizeActive : ""}
                    onClick={() => setSelectedSize(index)}
                  >
                    {size}
                  </button>
                ))}
              </div>
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

              <Link to="/cart" className={styles.buyNowButton}>
                Buy Now
              </Link>

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
