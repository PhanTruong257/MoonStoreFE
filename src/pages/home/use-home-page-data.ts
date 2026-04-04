import { useEffect, useMemo, useState } from "react";

import { getStoredUser } from "@/features/auth/auth-storage";
import {
  flashSaleDeadline,
  homeBanners,
  homeCategories,
  homeProducts,
} from "@/pages/home/mock-data";
import type { HomeProduct } from "@/pages/home/mock-data";
import { addToCart as addToCartApi } from "@/services/cart-service";
import { fetchCategories, fetchProducts } from "@/services/catalog-service";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const cycleSlice = <T>(list: T[], start: number, count: number): T[] => {
  if (list.length <= count) {
    return list;
  }

  return Array.from({ length: count }, (_, index) => {
    return list[(start + index) % list.length];
  });
};

const getCountdown = (deadline: string): Countdown => {
  const distance = Math.max(new Date(deadline).getTime() - Date.now(), 0);

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
};

const CART_STORAGE_KEY = "cart_items";
const WISHLIST_STORAGE_KEY = "wishlist_items";

type CartItems = Record<string, number>;
type HomeProductView = HomeProduct & { defaultSkuId?: number };

const readCartItems = (): CartItems => {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as CartItems;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return {};
  }
};

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

export const useHomePageData = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [categoryStart, setCategoryStart] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [flashStart, setFlashStart] = useState(0);
  const [bestSellingStart, setBestSellingStart] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllFlash, setShowAllFlash] = useState(false);
  const [products, setProducts] = useState<HomeProductView[]>(homeProducts);
  const [categories, setCategories] = useState(homeCategories);
  const [cartItems, setCartItems] = useState<CartItems>(() => readCartItems());
  const [wishlistMap, setWishlistMap] = useState<Record<string, boolean>>(() =>
    readWishlist(),
  );
  const [countdown, setCountdown] = useState<Countdown>(() =>
    getCountdown(flashSaleDeadline),
  );

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      try {
        const [categoryList, productList] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);

        if (!isMounted) {
          return;
        }

        const mappedCategories = [
          { id: "all", label: "All" },
          ...categoryList.map((item) => ({
            id: String(item.id),
            label: item.name,
          })),
        ];

        const mappedProducts: HomeProductView[] = productList.map((item) => {
          const price = Number(item.defaultSku?.price ?? 0);
          return {
            id: String(item.id),
            name: item.name,
            price,
            oldPrice: Math.round(price * 1.2),
            categoryId: String(item.categoryId),
            image:
              item.defaultSku?.imageUrl ?? "/images/products/product-1.jpg",
            rating: 4,
            sold: Math.max(10, (item.defaultSku?.stock ?? 0) / 2),
            defaultSkuId: item.defaultSku?.id,
          };
        });

        if (mappedCategories.length > 1) {
          setCategories(mappedCategories);
        }

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

  const flashSaleProducts = useMemo(() => {
    const byCategory =
      activeCategory === "all"
        ? products
        : products.filter((item) => item.categoryId === activeCategory);

    if (!searchQuery.trim()) {
      return byCategory;
    }

    const query = searchQuery.trim().toLowerCase();
    return byCategory.filter((item) => item.name.toLowerCase().includes(query));
  }, [activeCategory, products, searchQuery]);

  const bestSellingProducts = useMemo(() => {
    return [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);
  }, [products]);

  const productSpotlight = useMemo(() => {
    return products.slice(2, 10);
  }, [products]);

  const visibleCategories = useMemo(() => {
    return cycleSlice(categories, categoryStart, 6);
  }, [categoryStart, categories]);

  const visibleFlashProducts = useMemo(() => {
    return showAllFlash
      ? flashSaleProducts
      : cycleSlice(flashSaleProducts, flashStart, 5);
  }, [flashSaleProducts, flashStart, showAllFlash]);

  const visibleBestSellingProducts = useMemo(() => {
    return cycleSlice(bestSellingProducts, bestSellingStart, 4);
  }, [bestSellingProducts, bestSellingStart]);

  const cartCount = useMemo(() => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  }, [cartItems]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCountdown(getCountdown(flashSaleDeadline));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

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

  const addToCart = async (
    productId: string,
    skuId: number | undefined,
    productName: string,
  ) => {
    const user = getStoredUser();

    try {
      await addToCartApi({
        userId: user?.id,
        skuId,
        productName,
        quantity: 1,
      });

      setCartItems((prev) => ({
        ...prev,
        [productId]: (prev[productId] ?? 0) + 1,
      }));

      window.dispatchEvent(new CustomEvent("cart:updated"));

      return true;
    } catch {
      return false;
    }
  };

  const toggleFlashView = () => {
    setShowAllFlash((prev) => !prev);
  };

  const previousHero = () => {
    setHeroIndex((prev) => (prev === 0 ? homeBanners.length - 1 : prev - 1));
  };

  const nextHero = () => {
    setHeroIndex((prev) => (prev + 1) % homeBanners.length);
  };

  const previousFlash = () => {
    setFlashStart((prev) =>
      flashSaleProducts.length === 0
        ? 0
        : prev === 0
          ? flashSaleProducts.length - 1
          : prev - 1,
    );
  };

  const nextFlash = () => {
    setFlashStart((prev) =>
      flashSaleProducts.length === 0
        ? 0
        : (prev + 1) % flashSaleProducts.length,
    );
  };

  const previousCategory = () => {
    if (categories.length === 0) {
      return;
    }
    setCategoryStart((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const nextCategory = () => {
    if (categories.length === 0) {
      return;
    }
    setCategoryStart((prev) => (prev + 1) % categories.length);
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
    activeCategory,
    bestSellingProducts,
    cartCount,
    countdown,
    flashSaleProducts,
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
  };
};
