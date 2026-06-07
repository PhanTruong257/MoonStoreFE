import type { MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./home-page.module.scss";

import type { AppDispatch, RootState } from "@/app/app-store";
import { UI_TEXT } from "@/const/ui-text";
import { CategorySection } from "@/features/home/category/category-section";
import { homeCategoryActions } from "@/features/home/category/category.slice";
import { ProductListSection } from "@/features/home/product-list/product-list-section";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks, type HomeCategory } from "@/pages/home/mock-data";
import { toCategorySlug } from "@/app/utils/category-slug";
import { fetchProductDetail } from "@/services/catalog-service";

const th = UI_TEXT.header;

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const { items: categories } = useSelector((state: RootState) => state.homeCategory);

  useEffect(() => {
    console.log("[HomePage] Dispatching categoryInitRequested...");
    dispatch(homeCategoryActions.categoryInitRequested());
  }, [dispatch]);

  const headerCategoryItems = useMemo(() => {
    return categories
      .filter((cat) => cat.id !== "all" && !!(cat as HomeCategory).children?.length)
      .map((cat) => ({
        label: cat.label,
        to: `/${toCategorySlug(cat.label)}`,
      }));
  }, [categories]);

  const handleCategorySelect = (category: { id: string; label: string }) => {
    if (category.id === "all") {
      void navigate("/");
      return;
    }
    const slug = toCategorySlug(category.label);
    void navigate(`/${slug}`);
  };

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
        brand={{ label: th.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{
          placeholder: th.searchPlaceholder,
          value: searchQuery,
          onChange: setSearchQuery,
        }}
        categoryItems={headerCategoryItems}
      />

      <div className={`main-container ${styles.main}`}>
        <CategorySection onCategorySelect={handleCategorySelect} />
        <ProductListSection
          initialCategorySlug={categorySlug}
          searchQuery={searchQuery}
          onProductClick={handleProductClick}
        />
      </div>

      <SiteFooter
        sections={homeFooterSections}
        copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
      />
    </main>
  );
};
