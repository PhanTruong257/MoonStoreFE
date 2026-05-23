import { Empty, Skeleton } from "antd";
import { Link } from "react-router-dom";

import styles from "./shop-page.module.scss";
import { useShopPage } from "./use-shop-page";

import { formatMoney } from "@/app/utils/format";
import { Breadcrumb } from "@/component/breadcrumb/breadcrumb";
import { ProductCard } from "@/component/product-card/product-card";
import { UI_TEXT } from "@/const/ui-text";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const t = UI_TEXT.shop;
const h = UI_TEXT.header;

export const ShopPage = () => {
  const { shop, isLoading, error } = useShopPage();

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton active paragraph={{ rows: 6 }} />;
    }

    if (error || !shop) {
      return (
        <div className={styles.errorText}>
          <p>{error ?? t.notFound}</p>
          <Link to="/">{t.backToHome}</Link>
        </div>
      );
    }

    return (
      <>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[
            { label: UI_TEXT.common.home, to: "/" },
            { label: shop.shopName },
          ]}
        />

        <div className={styles.shopHeader}>
          <div className={styles.avatar}>{shop.shopName.charAt(0)}</div>
          <div className={styles.shopInfo}>
            <h1 className={styles.shopName}>{shop.shopName}</h1>
            {shop.description ? (
              <p className={styles.shopDescription}>{shop.description}</p>
            ) : null}
            <div className={styles.shopMeta}>
              <span className={styles.metaBadge}>
                {t.productCountLabel(shop.productCount)}
              </span>
            </div>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>{t.productsSection}</h2>

        {shop.products.length === 0 ? (
          <Empty description={t.noProducts} className={styles.emptyState} />
        ) : (
          <div className={styles.grid}>
            {shop.products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                image={product.imageUrl}
                to={`/product/${product.id}`}
                renderPrice={
                  <p className={styles.priceRow}>
                    <strong className={styles.price}>
                      {formatMoney(product.basePrice)}
                    </strong>
                  </p>
                }
                className={styles.card}
              />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: h.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: h.searchPlaceholder }}
      />
      <section className={styles.main}>{renderContent()}</section>
      <SiteFooter
        sections={homeFooterSections}
        copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
      />
    </main>
  );
};
