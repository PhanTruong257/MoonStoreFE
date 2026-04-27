import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { cycleSlice } from "@/app/utils/array";
import { dispatchCartUpdated } from "@/app/utils/cart-event";
import { readJsonFromStorage, writeJsonToStorage } from "@/app/utils/storage";
import { STORAGE_KEYS } from "@/const/storage.const";
import {
  flashSaleActions,
  getCountdown,
} from "@/features/home/flash-sale/flash-sale.slice";
import { flashSaleDeadline } from "@/pages/home/mock-data";

const FLASH_VISIBLE_COUNT = 5;
const COUNTDOWN_INTERVAL_MS = 1000;
const ALL_CATEGORY_ID = "all";

const readCartItems = () =>
  readJsonFromStorage<Record<string, number>>(STORAGE_KEYS.CART_ITEMS, {});

const readWishlist = () =>
  readJsonFromStorage<Record<string, boolean>>(STORAGE_KEYS.WISHLIST_ITEMS, {});

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
    }, COUNTDOWN_INTERVAL_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, [dispatch]);

  useEffect(() => {
    writeJsonToStorage(STORAGE_KEYS.CART_ITEMS, cartItems);
    dispatchCartUpdated();
  }, [cartItems]);

  useEffect(() => {
    writeJsonToStorage(STORAGE_KEYS.WISHLIST_ITEMS, wishlistMap);
  }, [wishlistMap]);

  const flashSaleProducts = useMemo(() => {
    const byCategory =
      activeCategory === ALL_CATEGORY_ID
        ? products
        : products.filter((item) => item.categoryId === activeCategory);

    if (!searchQuery.trim()) {
      return byCategory;
    }

    const query = searchQuery.trim().toLowerCase();
    return byCategory.filter((item) =>
      item.name.toLowerCase().includes(query),
    );
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
      : cycleSlice(flashSaleProducts, flashStart, FLASH_VISIBLE_COUNT);
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
      productIdNumber: number | undefined,
      productName: string,
    ) =>
      dispatch(
        flashSaleActions.flashSaleAddToCartRequested({
          productId,
          productIdNumber,
          productName,
        }),
      ),
  };
};
