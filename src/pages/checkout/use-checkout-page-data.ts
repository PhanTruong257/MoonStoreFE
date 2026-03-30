import { useMemo, useState } from "react";

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type BillingField =
  | "firstName"
  | "companyName"
  | "streetAddress"
  | "apartment"
  | "city"
  | "phone"
  | "email";

type BillingForm = Record<BillingField, string>;

const checkoutItems: CheckoutItem[] = [
  {
    id: "checkout-1",
    name: "LCD Monitor",
    price: 650,
    quantity: 1,
    image: "/images/products/product-3.jpg",
  },
  {
    id: "checkout-2",
    name: "H1 Gamepad",
    price: 550,
    quantity: 2,
    image: "/images/products/product-1.jpg",
  },
];

const SHIPPING_FEE = 0;

const initialBillingForm: BillingForm = {
  firstName: "",
  companyName: "",
  streetAddress: "",
  apartment: "",
  city: "",
  phone: "",
  email: "",
};

export const useCheckoutPageData = () => {
  const [billing, setBilling] = useState<BillingForm>(initialBillingForm);
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cod">("cod");
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [saveInfo, setSaveInfo] = useState(true);
  const [orderMessage, setOrderMessage] = useState("");

  const subTotal = useMemo(() => {
    return checkoutItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, []);

  const discountAmount = useMemo(() => {
    return Math.round((subTotal * discountPercent) / 100);
  }, [discountPercent, subTotal]);

  const total = subTotal - discountAmount + SHIPPING_FEE;

  const setBillingField = (field: BillingField, value: string) => {
    setBilling((prev) => ({ ...prev, [field]: value }));
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

  const placeOrder = () => {
    if (
      !billing.firstName ||
      !billing.streetAddress ||
      !billing.city ||
      !billing.phone ||
      !billing.email
    ) {
      setOrderMessage("Please fill all required billing fields.");
      return;
    }

    setOrderMessage(
      paymentMethod === "cod"
        ? "Order placed successfully. Payment method: Cash on delivery."
        : "Order placed successfully. Payment method: Bank transfer.",
    );
  };

  return {
    billing,
    checkoutItems,
    couponCode,
    couponMessage,
    discountAmount,
    paymentMethod,
    saveInfo,
    shippingFee: SHIPPING_FEE,
    subTotal,
    total,
    orderMessage,
    applyCoupon,
    placeOrder,
    setBillingField,
    setCouponCode,
    setPaymentMethod,
    setSaveInfo,
  };
};
