import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  flashSaleDeadline,
  homeCategories,
  homeProducts,
} from "@/pages/home/mock-data";
import type { HomeCategory, HomeProduct } from "@/pages/home/mock-data";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type FlashProduct = HomeProduct & { productIdNumber?: number };

type FlashSaleInitPayload = {
  categories: HomeCategory[];
  products: FlashProduct[];
};

type AddToCartPayload = {
  productId: string;
  productIdNumber?: number;
  productName: string;
};

type FlashSaleState = {
  activeCategory: string;
  flashStart: number;
  showAll: boolean;
  countdown: Countdown;
  categories: HomeCategory[];
  products: FlashProduct[];
  wishlistMap: Record<string, boolean>;
  cartItems: Record<string, number>;
  isLoading: boolean;
  error: string | null;
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

const initialState: FlashSaleState = {
  activeCategory: "all",
  flashStart: 0,
  showAll: false,
  countdown: getCountdown(flashSaleDeadline),
  categories: homeCategories,
  products: homeProducts,
  wishlistMap: {},
  cartItems: {},
  isLoading: false,
  error: null,
};

const flashSaleSlice = createSlice({
  name: "flashSale",
  initialState,
  reducers: {
    flashSaleInitRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    flashSaleInitSucceeded: (
      state,
      action: PayloadAction<FlashSaleInitPayload>,
    ) => {
      state.isLoading = false;
      state.error = null;
      state.categories =
        action.payload.categories.length > 0
          ? action.payload.categories
          : state.categories;
      state.products =
        action.payload.products.length > 0
          ? action.payload.products
          : state.products;
      state.flashStart = 0;
    },
    flashSaleInitFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    flashSaleSetActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
      state.flashStart = 0;
    },
    flashSaleNext: (state) => {
      state.flashStart += 1;
    },
    flashSalePrevious: (state) => {
      state.flashStart = state.flashStart > 0 ? state.flashStart - 1 : 0;
    },
    flashSaleSyncStart: (state, action: PayloadAction<number>) => {
      state.flashStart = action.payload;
    },
    flashSaleToggleView: (state) => {
      state.showAll = !state.showAll;
    },
    flashSaleToggleWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.wishlistMap[productId] = !state.wishlistMap[productId];
    },
    flashSaleSetCountdown: (state, action: PayloadAction<Countdown>) => {
      state.countdown = action.payload;
    },
    flashSaleHydrateLocal: (
      state,
      action: PayloadAction<{
        wishlistMap: Record<string, boolean>;
        cartItems: Record<string, number>;
      }>,
    ) => {
      state.wishlistMap = action.payload.wishlistMap;
      state.cartItems = action.payload.cartItems;
    },
    flashSaleAddToCartRequested: (
      state,
      action: PayloadAction<AddToCartPayload>,
    ) => {
      void state;
      void action.payload;
    },
    flashSaleAddToCartSucceeded: (
      state,
      action: PayloadAction<{ productId: string }>,
    ) => {
      const { productId } = action.payload;
      state.cartItems[productId] = (state.cartItems[productId] ?? 0) + 1;
    },
    flashSaleAddToCartFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const flashSaleReducer = flashSaleSlice.reducer;
export const flashSaleActions = flashSaleSlice.actions;
export { getCountdown };
