import { useMemo, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

const initialItems: CartItem[] = [
  {
    id: "cart-1",
    name: "LCD Monitor",
    price: 650,
    quantity: 1,
    image: "/images/products/product-3.jpg",
  },
  {
    id: "cart-2",
    name: "H1 Gamepad",
    price: 550,
    quantity: 2,
    image: "/images/products/product-1.jpg",
  },
];

const SHIPPING_FEE = 0;

export const useCartPageData = () => {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const subTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    return Math.round((subTotal * discountPercent) / 100);
  }, [discountPercent, subTotal]);

  const total = subTotal - discountAmount + SHIPPING_FEE;

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
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
