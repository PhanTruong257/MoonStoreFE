import { useEffect, useMemo, useState } from "react";

import { homeBanners, homeProducts } from "@/pages/home/mock-data";
import type { HomeProduct } from "@/pages/home/mock-data";
import { fetchProducts } from "@/services/catalog-service";

const cycleSlice = <T>(list: T[], start: number, count: number): T[] => {
  if (list.length <= count) {
    return list;
  }

  return Array.from({ length: count }, (_, index) => {
    return list[(start + index) % list.length];
  });
};

const WISHLIST_STORAGE_KEY = "wishlist_items";

type HomeProductView = HomeProduct & { productIdNumber?: number };

const readWishlist = (): Record<string, boolean> => {
  const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
    return {};
  }
};

export const useHomePageData = (selectedCategoryId = "all") => {
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
            oldPrice: Math.round(price * 1.2),
            categoryId: String(item.categoryId),
            image: item.imageUrl ?? "/images/products/product-1.jpg",
            rating: 4,
            sold: Math.max(10, (item.stock ?? 0) / 2),
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
      selectedCategoryId === "all"
        ? products
        : products.filter((item) => item.categoryId === selectedCategoryId);

    if (!searchQuery.trim()) {
      return byCategory;
    }

    const query = searchQuery.trim().toLowerCase();
    return byCategory.filter((item) => item.name.toLowerCase().includes(query));
  }, [products, searchQuery, selectedCategoryId]);

  const bestSellingProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => b.sold - a.sold).slice(0, 8);
  }, [filteredProducts]);

  const productSpotlight = useMemo(() => {
    return filteredProducts.slice(0, 8);
  }, [filteredProducts]);

  const visibleBestSellingProducts = useMemo(() => {
    return cycleSlice(bestSellingProducts, bestSellingStart, 4);
  }, [bestSellingProducts, bestSellingStart]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistMap));
  }, [wishlistMap]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % homeBanners.length);
    }, 5000);

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
