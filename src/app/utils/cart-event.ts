/**
 * Lightweight cross-component cart sync via window CustomEvent.
 * Used by cart/checkout/product pages to notify the header to refetch
 * cart count without coupling them to the same Redux slice.
 */

export const CART_UPDATED_EVENT = "cart:updated";

export const dispatchCartUpdated = (): void => {
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
};

export const subscribeCartUpdated = (handler: () => void): (() => void) => {
  window.addEventListener(CART_UPDATED_EVENT, handler);
  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, handler);
  };
};
