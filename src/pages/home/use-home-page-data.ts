import { useEffect, useMemo, useState } from "react";

import {
  flashSaleDeadline,
  homeBanners,
  homeCategories,
  homeProducts,
} from "@/pages/home/mock-data";

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

export const useHomePageData = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [categoryStart, setCategoryStart] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [flashStart, setFlashStart] = useState(0);
  const [bestSellingStart, setBestSellingStart] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistMap, setWishlistMap] = useState<Record<string, boolean>>({});
  const [countdown, setCountdown] = useState<Countdown>(() =>
    getCountdown(flashSaleDeadline),
  );

  const flashSaleProducts = useMemo(() => {
    return activeCategory === "all"
      ? homeProducts
      : homeProducts.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory]);

  const bestSellingProducts = useMemo(() => {
    return [...homeProducts].sort((a, b) => b.sold - a.sold).slice(0, 8);
  }, []);

  const productSpotlight = useMemo(() => {
    return homeProducts.slice(2, 10);
  }, []);

  const visibleCategories = useMemo(() => {
    return cycleSlice(homeCategories, categoryStart, 6);
  }, [categoryStart]);

  const visibleFlashProducts = useMemo(() => {
    return cycleSlice(flashSaleProducts, flashStart, 5);
  }, [flashSaleProducts, flashStart]);

  const visibleBestSellingProducts = useMemo(() => {
    return cycleSlice(bestSellingProducts, bestSellingStart, 4);
  }, [bestSellingProducts, bestSellingStart]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCountdown(getCountdown(flashSaleDeadline));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

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

  const addToCart = () => {
    setCartCount((prev) => prev + 1);
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
    setCategoryStart((prev) =>
      prev === 0 ? homeCategories.length - 1 : prev - 1,
    );
  };

  const nextCategory = () => {
    setCategoryStart((prev) => (prev + 1) % homeCategories.length);
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
    toggleWishlist,
  };
};
