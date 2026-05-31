import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { RootState } from "@/app/app-store";
import { dispatchCartUpdated } from "@/app/utils/cart-event";
import {
  readJsonFromStorage,
  writeJsonToStorage,
} from "@/app/utils/storage";
import { CART_MAX_QUANTITY } from "@/const/cart.const";
import { STORAGE_KEYS } from "@/const/storage.const";
import type { AuthState } from "@/features/auth/auth-slice";
import { getStoredUser } from "@/features/auth/auth-storage";
import {
  fetchMyCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart-service";

export type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedOptions: Array<{
    groupName: string;
    optionName: string;
    priceDelta: number;
  }>;
};

const readStoredSelectedIds = (): number[] => {
  const data = readJsonFromStorage<number[]>(STORAGE_KEYS.CART_SELECTED_IDS, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((value): value is number => typeof value === "number");
};

export const useCartPageData = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => new Set(readStoredSelectedIds()),
  );
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const activeUserId = user?.id ?? getStoredUser()?.id;

  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      if (!activeUserId) {
        if (isMounted) setItems([]);
        return;
      }
      try {
        const cart = await fetchMyCart();
        if (!isMounted) return;

        const nextItems: CartItem[] = cart.items.map((item) => ({
          id: item.id,
          productId: item.product.id,
          name: item.product.name,
          price: Number(item.unitPrice),
          quantity: item.quantity,
          image: item.product.imageUrl,
          selectedOptions: item.selectedOptions.map((opt) => ({
            groupName: opt.groupName,
            optionName: opt.optionName,
            priceDelta: opt.priceDelta,
          })),
        }));
        setItems(nextItems);

        const validIds = new Set(nextItems.map((item) => item.id));
        setSelectedIds((prev) => {
          const next = new Set<number>();
          prev.forEach((id) => {
            if (validIds.has(id)) next.add(id);
          });
          return next;
        });

        const qtyMap = nextItems.reduce<Record<string, number>>((acc, item) => {
          acc[String(item.id)] = item.quantity;
          return acc;
        }, {});
        writeJsonToStorage(STORAGE_KEYS.CART_ITEMS, qtyMap);
      } catch {
        if (isMounted) setItems([]);
      }
    };

    void loadCart();
    return () => {
      isMounted = false;
    };
  }, [activeUserId]);

  useEffect(() => {
    writeJsonToStorage(STORAGE_KEYS.CART_SELECTED_IDS, Array.from(selectedIds));
  }, [selectedIds]);

  const subTotal = useMemo(
    () =>
      items
        .filter((item) => selectedIds.has(item.id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items, selectedIds],
  );

  const selectedCount = useMemo(
    () => items.filter((item) => selectedIds.has(item.id)).length,
    [items, selectedIds],
  );

  const allSelected = items.length > 0 && selectedCount === items.length;

  const toggleSelectItem = useCallback((itemId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === items.length) {
        return new Set();
      }
      return new Set(items.map((item) => item.id));
    });
  }, [items]);

  const changeQuantity = useCallback((itemId: number, nextQuantity: number) => {
    const clamped = Math.max(1, Math.min(CART_MAX_QUANTITY, nextQuantity));
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: clamped } : item,
      ),
    );
    void updateCartItem(itemId, clamped).catch(() => {
      // silent: UI already updated
    });
  }, []);

  const incrementQuantity = useCallback(
    (itemId: number) => {
      const current = items.find((item) => item.id === itemId);
      if (!current) return;
      changeQuantity(itemId, current.quantity + 1);
    },
    [items, changeQuantity],
  );

  const decrementQuantity = useCallback(
    (itemId: number) => {
      const current = items.find((item) => item.id === itemId);
      if (!current) return;
      changeQuantity(itemId, current.quantity - 1);
    },
    [items, changeQuantity],
  );

  const removeItem = useCallback((itemId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedIds((prev) => {
      if (!prev.has(itemId)) return prev;
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
    void removeCartItem(itemId)
      .then(() => dispatchCartUpdated())
      .catch(() => {
        // silent
      });
  }, []);

  const removeSelected = useCallback(() => {
    const idsToRemove = Array.from(selectedIds);
    if (idsToRemove.length === 0) return;
    setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
    void Promise.allSettled(idsToRemove.map((id) => removeCartItem(id))).then(
      () => {
        dispatchCartUpdated();
      },
    );
  }, [selectedIds]);

  const goToCheckout = useCallback(() => {
    if (selectedCount === 0) return;
    writeJsonToStorage(
      STORAGE_KEYS.CART_SELECTED_IDS,
      Array.from(selectedIds),
    );
    void navigate("/checkout");
  }, [navigate, selectedCount, selectedIds]);

  return {
    items,
    selectedIds,
    selectedCount,
    allSelected,
    subTotal,
    isEmpty: items.length === 0,
    toggleSelectItem,
    toggleSelectAll,
    incrementQuantity,
    decrementQuantity,
    changeQuantity,
    removeItem,
    removeSelected,
    goToCheckout,
  };
};
