import { Link } from "react-router-dom";

import styles from "./home-page.module.scss";
import { useHomePageData } from "./use-home-page-data";

import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import {
  arrivalCards,
  homeBanners,
  homeCategories,
  homeFooterSections,
  homeHeaderLinks,
  homeServices,
  homeSideMenu,
} from "@/pages/home/mock-data";

const formatMoney = (value: number) => {
  return `$${value.toFixed(0)}`;
};

const formatCountdownPart = (value: number) =>
  value.toString().padStart(2, "0");

export const HomePage = () => {
  const {
    activeCategory,
    cartCount,
    countdown,
    heroIndex,
    productSpotlight,
    searchQuery,
    showAllFlash,
    visibleBestSellingProducts,
    visibleCategories,
    visibleFlashProducts,
    wishlistMap,
    addToCart,
    nextBestSelling,
    nextCategory,
    nextFlash,
    nextHero,
    previousBestSelling,
    previousCategory,
    previousFlash,
    previousHero,
    setActiveCategory,
    setHeroIndex,
    setSearchQuery,
    toggleFlashView,
    toggleWishlist,
  } = useHomePageData();

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
        search={{
          placeholder: "What are you looking for?",
          value: searchQuery,
          onChange: setSearchQuery,
        }}
      />

      <div className={`main-container ${styles.main}`}>
        <section className={styles.heroSection}>
          <aside className={styles.sideMenu}>
            {homeSideMenu.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSearchQuery(item);
                  setActiveCategory("all");
                }}
              >
                <span>{item}</span>
                <span>&gt;</span>
              </button>
            ))}
          </aside>

          <article className={styles.heroBanner}>
            {homeBanners.map((banner, index) => (
              <div
                key={banner.id}
                className={`${styles.heroSlide} ${index === heroIndex ? styles.heroSlideActive : ""}`}
              >
                <div className={styles.heroText}>
                  <p>{banner.subtitle}</p>
                  <h1>{banner.title}</h1>
                  <Link to={banner.ctaTo}>{banner.ctaLabel}</Link>
                </div>
                <img src={banner.image} alt={banner.title} />
              </div>
            ))}

            <div className={styles.heroControls}>
              <button
                type="button"
                onClick={previousHero}
                aria-label="Previous banner"
              >
                &lt;
              </button>

              <div className={styles.heroDots}>
                {homeBanners.map((banner, index) => (
                  <button
                    key={banner.id}
                    type="button"
                    className={index === heroIndex ? styles.heroDotActive : ""}
                    onClick={() => setHeroIndex(index)}
                    aria-label={`Go to banner ${index + 1}`}
                  />
                ))}
              </div>

              <button type="button" onClick={nextHero} aria-label="Next banner">
                &gt;
              </button>
            </div>
          </article>
        </section>

        <section className="page-section">
          <header className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>Today&apos;s</p>
              <h2>Flash Sales</h2>
            </div>

            <div className={styles.countdownWrap}>
              <span>
                <strong>{formatCountdownPart(countdown.days)}</strong>
                <small>Days</small>
              </span>
              <span>
                <strong>{formatCountdownPart(countdown.hours)}</strong>
                <small>Hours</small>
              </span>
              <span>
                <strong>{formatCountdownPart(countdown.minutes)}</strong>
                <small>Minutes</small>
              </span>
              <span>
                <strong>{formatCountdownPart(countdown.seconds)}</strong>
                <small>Seconds</small>
              </span>
            </div>
          </header>

          <div className={styles.filterRow}>
            {homeCategories.map((category) => (
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
                <article key={product.id} className={styles.productCard}>
                  <div className={styles.imageWrap}>
                    <span className={styles.discountTag}>-{discount}%</span>
                    <img src={product.image} alt={product.name} />
                    <button
                      type="button"
                      className={styles.wishlistButton}
                      onClick={() => toggleWishlist(product.id)}
                    >
                      {wishlistMap[product.id] ? "Saved" : "Wish"}
                    </button>
                  </div>

                  <Link to={`/product/${product.id}`}>
                    <h3>{product.name}</h3>
                  </Link>

                  <p className={styles.priceRow}>
                    <span>{formatMoney(product.price)}</span>
                    <del>{formatMoney(product.oldPrice)}</del>
                  </p>

                  <p className={styles.metaRow}>
                    <span>{"*".repeat(product.rating)}</span>
                    <small>({product.sold})</small>
                  </p>

                  <button
                    type="button"
                    className={styles.addToCartButton}
                    onClick={() => {
                      void addToCart(
                        product.id,
                        "defaultSkuId" in product
                          ? product.defaultSkuId
                          : undefined,
                        product.name,
                      );
                    }}
                  >
                    Add To Cart
                  </button>
                </article>
              );
            })}
          </div>

          <div className={styles.centerRow}>
            <button
              type="button"
              className={styles.viewAllButton}
              onClick={toggleFlashView}
            >
              {showAllFlash ? "Show Less" : "View All Products"} ({cartCount} in
              cart)
            </button>
          </div>
        </section>

        <section className="page-section">
          <header className={styles.sectionHeaderCompact}>
            <div>
              <p className={styles.sectionLabel}>Categories</p>
              <h2>Browse By Category</h2>
            </div>

            <div className={styles.arrowControls}>
              <button type="button" onClick={previousCategory}>
                &lt;
              </button>
              <button type="button" onClick={nextCategory}>
                &gt;
              </button>
            </div>
          </header>

          <div className={styles.categoryGrid}>
            {visibleCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={
                  activeCategory === category.id ? styles.categoryActive : ""
                }
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </section>

        <section className="page-section">
          <header className={styles.sectionHeaderCompact}>
            <div>
              <p className={styles.sectionLabel}>This Month</p>
              <h2>Best Selling Products</h2>
            </div>

            <div className={styles.arrowControls}>
              <button type="button" onClick={previousBestSelling}>
                &lt;
              </button>
              <button type="button" onClick={nextBestSelling}>
                &gt;
              </button>
            </div>
          </header>

          <div className={styles.productGridCompact}>
            {visibleBestSellingProducts.map((product) => (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.imageWrap}>
                  <img src={product.image} alt={product.name} />
                  <button
                    type="button"
                    className={styles.wishlistButton}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    {wishlistMap[product.id] ? "Saved" : "Wish"}
                  </button>
                </div>

                <Link to={`/product/${product.id}`}>
                  <h3>{product.name}</h3>
                </Link>

                <p className={styles.priceRow}>
                  <span>{formatMoney(product.price)}</span>
                  <del>{formatMoney(product.oldPrice)}</del>
                </p>

                <p className={styles.metaRow}>
                  <span>{"*".repeat(product.rating)}</span>
                  <small>({product.sold})</small>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.promoSection}>
          <div>
            <p>Categories</p>
            <h2>Enhance Your Music Experience</h2>
            <button type="button">Buy Now!</button>
          </div>

          <img src="/images/products/product-2.jpg" alt="Music speaker" />
        </section>

        <section className="page-section">
          <header className={styles.sectionHeaderCompact}>
            <div>
              <p className={styles.sectionLabel}>Our Products</p>
              <h2>Explore Our Products</h2>
            </div>
          </header>

          <div className={styles.productGrid}>
            {productSpotlight.map((product) => (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.imageWrap}>
                  {product.isNew ? (
                    <span className={styles.newTag}>NEW</span>
                  ) : null}
                  <img src={product.image} alt={product.name} />
                  <button
                    type="button"
                    className={styles.wishlistButton}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    {wishlistMap[product.id] ? "Saved" : "Wish"}
                  </button>
                </div>

                <Link to={`/product/${product.id}`}>
                  <h3>{product.name}</h3>
                </Link>

                <p className={styles.priceRow}>
                  <span>{formatMoney(product.price)}</span>
                  <del>{formatMoney(product.oldPrice)}</del>
                </p>

                <p className={styles.metaRow}>
                  <span>{"*".repeat(product.rating)}</span>
                  <small>({product.sold})</small>
                </p>
              </article>
            ))}
          </div>

          <div className={styles.centerRow}>
            <button type="button" className={styles.viewAllButton}>
              View All Products
            </button>
          </div>
        </section>

        <section className="page-section">
          <header className={styles.sectionHeaderCompact}>
            <div>
              <p className={styles.sectionLabel}>Featured</p>
              <h2>New Arrival</h2>
            </div>
          </header>

          <div className={styles.arrivalGrid}>
            {arrivalCards.map((card, index) => (
              <article
                key={card.id}
                className={`${styles.arrivalCard} ${index === 0 ? styles.arrivalCardLarge : ""}`}
              >
                <img src={card.image} alt={card.title} />
                <div className={styles.arrivalOverlay}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <Link to="/">Shop Now</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.servicesSection}>
          {homeServices.map((service) => (
            <article key={service.id} className={styles.serviceCard}>
              <span />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </section>
      </div>

      <SiteFooter
        sections={homeFooterSections}
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
