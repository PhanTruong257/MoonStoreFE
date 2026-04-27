import { useEffect, useMemo, useState } from "react";

import { cycleSlice } from "@/app/utils/array";
import { readJsonFromStorage, writeJsonToStorage } from "@/app/utils/storage";
import { STORAGE_KEYS } from "@/const/storage.const";
import { homeBanners, homeProducts } from "@/pages/home/mock-data";
import type { HomeProduct } from "@/pages/home/mock-data";
import { fetchProducts } from "@/services/catalog-service";

const ALL_CATEGORY_ID = "all";
const BEST_SELLING_VISIBLE = 4;
const PRODUCT_LIMIT = 8;
const HERO_INTERVAL_MS = 5000;
const FALLBACK_PRODUCT_IMAGE = "/images/products/product-1.jpg";
const PRICE_OLD_RATIO = 1.2;
const SOLD_FALLBACK_MIN = 10;

type HomeProductView = HomeProduct & { productIdNumber?: number };

const readWishlist = () =>
  readJsonFromStorage<Record<string, boolean>>(STORAGE_KEYS.WISHLIST_ITEMS, {});

export const useHomePageData = (selectedCategoryId = ALL_CATEGORY_ID) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [bestSellingStart, setBestSellingStart] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<HomeProductView[]>(homeProducts);
  const [wishlistMap, setWishlistMap] = useState<Record<string, boolean>>(() =>
    readWishlist(),
  );

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      try {
        const productList = await fetchProducts();

        if (!isMounted) {
          return;
        }

        const mappedProducts: HomeProductView[] = productList.map((item) => {
          const price = Number(item.basePrice ?? 0);
          return {
            id: String(item.id),
            name: item.name,
            price,
            oldPrice: Math.round(price * PRICE_OLD_RATIO),
            categoryId: String(item.categoryId),
            image: item.imageUrl ?? FALLBACK_PRODUCT_IMAGE,
            rating: 4,
            sold: Math.max(SOLD_FALLBACK_MIN, (item.stock ?? 0) / 2),
            productIdNumber: item.id,
          };
        });

        if (mappedProducts.length > 0) {
          setProducts(mappedProducts);
        }
      } catch {
        if (!isMounted) {
          return;
        }
      }
    };

    void loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const byCategory =
      selectedCategoryId === ALL_CATEGORY_ID
        ? products
        : products.filter((item) => item.categoryId === selectedCategoryId);

    if (!searchQuery.trim()) {
      return byCategory;
    }

    const query = searchQuery.trim().toLowerCase();
    return byCategory.filter((item) =>
      item.name.toLowerCase().includes(query),
    );
  }, [products, searchQuery, selectedCategoryId]);

  const bestSellingProducts = useMemo(() => {
    return [...filteredProducts]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, PRODUCT_LIMIT);
  }, [filteredProducts]);

  const productSpotlight = useMemo(() => {
    return filteredProducts.slice(0, PRODUCT_LIMIT);
  }, [filteredProducts]);

  const visibleBestSellingProducts = useMemo(() => {
    return cycleSlice(bestSellingProducts, bestSellingStart, BEST_SELLING_VISIBLE);
  }, [bestSellingProducts, bestSellingStart]);

  useEffect(() => {
    writeJsonToStorage(STORAGE_KEYS.WISHLIST_ITEMS, wishlistMap);
  }, [wishlistMap]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % homeBanners.length);
    }, HERO_INTERVAL_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const toggleWishlist = (productId: string) => {
    setWishlistMap((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const previousHero = () => {
    setHeroIndex((prev) => (prev === 0 ? homeBanners.length - 1 : prev - 1));
  };

  const nextHero = () => {
    setHeroIndex((prev) => (prev + 1) % homeBanners.length);
  };

  const previousBestSelling = () => {
    setBestSellingStart((prev) =>
      prev === 0 ? bestSellingProducts.length - 1 : prev - 1,
    );
  };

  const nextBestSelling = () => {
    setBestSellingStart((prev) => (prev + 1) % bestSellingProducts.length);
  };

  return {
    bestSellingProducts,
    heroIndex,
    productSpotlight,
    searchQuery,
    visibleBestSellingProducts,
    wishlistMap,
    nextBestSelling,
    nextHero,
    previousBestSelling,
    previousHero,
    setHeroIndex,
    setSearchQuery,
    toggleWishlist,
  };
};
