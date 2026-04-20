import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import {
  flashSaleActions,
  getCountdown,
} from "@/features/home/flash-sale/flash-sale.slice";
import { flashSaleDeadline } from "@/pages/home/mock-data";

const CART_STORAGE_KEY = "cart_items";
const WISHLIST_STORAGE_KEY = "wishlist_items";

const cycleSlice = <T>(list: T[], start: number, count: number): T[] => {
  if (list.length <= count) {
    return list;
  }

  return Array.from({ length: count }, (_, index) => {
    return list[(start + index) % list.length];
  });
};

const readCartItems = (): Record<string, number> => {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, number>;
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

export const useFlashSale = (
  searchQuery: string,
  selectedCategoryId: string,
) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    activeCategory,
    cartItems,
    categories,
    countdown,
    flashStart,
    products,
    showAll,
    wishlistMap,
  } = useSelector((state: RootState) => state.flashSale);

  useEffect(() => {
    dispatch(flashSaleActions.flashSaleInitRequested());
    dispatch(
      flashSaleActions.flashSaleHydrateLocal({
        wishlistMap: readWishlist(),
        cartItems: readCartItems(),
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(flashSaleActions.flashSaleSetActiveCategory(selectedCategoryId));
  }, [dispatch, selectedCategoryId]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      dispatch(
        flashSaleActions.flashSaleSetCountdown(getCountdown(flashSaleDeadline)),
      );
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    window.dispatchEvent(new CustomEvent("cart:updated"));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistMap));
  }, [wishlistMap]);

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

  useEffect(() => {
    if (flashSaleProducts.length === 0) {
      dispatch(flashSaleActions.flashSaleSyncStart(0));
      return;
    }
    if (flashStart >= flashSaleProducts.length) {
      dispatch(flashSaleActions.flashSaleSyncStart(0));
    }
  }, [dispatch, flashSaleProducts.length, flashStart]);

  const visibleFlashProducts = useMemo(() => {
    return showAll
      ? flashSaleProducts
      : cycleSlice(flashSaleProducts, flashStart, 5);
  }, [flashSaleProducts, flashStart, showAll]);

  const cartCount = useMemo(() => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  }, [cartItems]);

  return {
    activeCategory,
    cartCount,
    categories,
    countdown,
    showAll,
    visibleFlashProducts,
    wishlistMap,
    setActiveCategory: (categoryId: string) =>
      dispatch(flashSaleActions.flashSaleSetActiveCategory(categoryId)),
    previousFlash: () => {
      if (flashSaleProducts.length === 0) {
        dispatch(flashSaleActions.flashSaleSyncStart(0));
        return;
      }
      dispatch(flashSaleActions.flashSalePrevious());
      const nextStart =
        flashStart === 0 ? flashSaleProducts.length - 1 : flashStart - 1;
      dispatch(flashSaleActions.flashSaleSyncStart(nextStart));
    },
    nextFlash: () => {
      if (flashSaleProducts.length === 0) {
        dispatch(flashSaleActions.flashSaleSyncStart(0));
        return;
      }
      const nextStart = (flashStart + 1) % flashSaleProducts.length;
      dispatch(flashSaleActions.flashSaleNext());
      dispatch(flashSaleActions.flashSaleSyncStart(nextStart));
    },
    toggleFlashView: () => dispatch(flashSaleActions.flashSaleToggleView()),
    toggleWishlist: (productId: string) =>
      dispatch(flashSaleActions.flashSaleToggleWishlist(productId)),
    addToCart: (
      productId: string,
      skuId: number | undefined,
      productName: string,
    ) =>
      dispatch(
        flashSaleActions.flashSaleAddToCartRequested({
          productId,
          skuId,
          productName,
        }),
      ),
  };
};
