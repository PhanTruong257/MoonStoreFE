import { useEffect, useMemo, useState } from "react";

import { getStoredUser } from "@/features/auth/auth-storage";
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
};

const CART_STORAGE_KEY = "cart_items";

const SHIPPING_FEE = 0;

export const useCartPageData = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const user = getStoredUser();
    if (!user) {
      return;
    }

    const loadCart = async () => {
      try {
        const cart = await fetchCartByUser(user.id);
        if (!isMounted) {
          return;
        }

        const nextItems = cart.items.map((item) => ({
          id: item.id,
          name: item.sku.product.name,
          price: Number(item.sku.price),
          quantity: item.quantity,
          image: item.sku.imageUrl,
        }));

        setItems(nextItems);

        const map = nextItems.reduce<Record<string, number>>((acc, item) => {
          acc[String(item.id)] = item.quantity;
          return acc;
        }, {});
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(map));
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
  }, []);

  const subTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    return Math.round((subTotal * discountPercent) / 100);
  }, [discountPercent, subTotal]);

  const total = subTotal - discountAmount + SHIPPING_FEE;

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
    const code = couponCode.trim().toUpperCase();

    if (code === "MOON10") {
      setDiscountPercent(10);
      setCouponMessage("Coupon applied: 10% off");
      return;
    }

    if (code === "MOON20") {
      setDiscountPercent(20);
      setCouponMessage("Coupon applied: 20% off");
      return;
    }

    setDiscountPercent(0);
    setCouponMessage("Invalid coupon code");
  };

  return {
    couponCode,
    couponMessage,
    discountAmount,
    discountPercent,
    items,
    shippingFee: SHIPPING_FEE,
    subTotal,
    total,
    applyCoupon,
    removeItem,
    setCouponCode,
    updateQuantity,
  };
};
