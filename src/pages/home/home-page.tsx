import type { MouseEvent } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./home-page.module.scss";

import { ProductListSection } from "@/features/home/product-list/product-list-section";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";
import { fetchProductDetail } from "@/services/catalog-service";

export const HomePage = () => {
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const handleProductClick = async (
    event: MouseEvent<HTMLAnchorElement>,
    productId: string,
  ) => {
    event.preventDefault();

    const numericId = Number(productId);
    if (!Number.isNaN(numericId)) {
      try {
        await fetchProductDetail(numericId);
      } catch {
        // Ignore fetch errors and still navigate to the detail page.
      }
    }

    void navigate(`/product/${productId}`);
  };

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
        <ProductListSection
          initialCategorySlug={categorySlug}
          searchQuery={searchQuery}
          onProductClick={handleProductClick}
        />
      </div>

      <SiteFooter
        sections={homeFooterSections}
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
