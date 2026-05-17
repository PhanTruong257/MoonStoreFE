import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/app/app-store";
import { writeJsonToStorage } from "@/app/utils/storage";
import { STORAGE_KEYS } from "@/const/storage.const";
import type { AuthState } from "@/features/auth/auth-slice";
import { getStoredUser } from "@/features/auth/auth-storage";
import { useVoucher } from "@/features/vouchers";
import {
  fetchCartByUser,
  removeCartItem,
  updateCartItem,
} from "@/services/cart-service";

type CartItem = {
  id: number;
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

const SHIPPING_FEE = 0;

export const useCartPageData = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const voucherState = useVoucher();
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const activeUserId = user?.id ?? getStoredUser()?.id;

  useEffect(() => {
    if (!activeUserId) {
      setItems([]);
      return;
    }

    let isMounted = true;

    const loadCart = async () => {
      try {
        const cart = await fetchCartByUser(activeUserId);
        if (!isMounted) {
          return;
        }

        const nextItems = cart.items.map((item) => ({
          id: item.id,
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

        const map = nextItems.reduce<Record<string, number>>((acc, item) => {
          acc[String(item.id)] = item.quantity;
          return acc;
        }, {});
        writeJsonToStorage(STORAGE_KEYS.CART_ITEMS, map);
      } catch {
        if (!isMounted) {
          return;
        }
        setItems([]);
      }
    };

    void loadCart();

    return () => {
      isMounted = false;
    };
  }, [activeUserId]);

  const subTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const total = Math.max(0, subTotal - voucherState.discountAmount + SHIPPING_FEE);

  const updateQuantity = (itemId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );

    void updateCartItem(itemId, Math.max(1, quantity)).catch(() => {
      // Ignore update errors for now; UI already updated.
    });
  };

  const removeItem = (itemId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    void removeCartItem(itemId).catch(() => {
      // Ignore remove errors for now; UI already updated.
    });
  };

  const applyCoupon = () => {
    voucherState.apply(subTotal);
  };

  return {
    couponCode: voucherState.code,
    couponMessage: voucherState.message,
    discountAmount: voucherState.discountAmount,
    items,
    shippingFee: SHIPPING_FEE,
    subTotal,
    total,
    applyCoupon,
    removeItem,
    setCouponCode: voucherState.setCode,
    updateQuantity,
  };
};
