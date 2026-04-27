/** Single source of truth for localStorage keys used by the app. */
export const STORAGE_KEYS = {
  AUTH_USER: "auth_user",
  CART_ITEMS: "cart_items",
  WISHLIST_ITEMS: "wishlist_items",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
