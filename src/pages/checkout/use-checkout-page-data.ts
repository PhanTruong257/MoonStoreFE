import { useEffect, useMemo, useState } from "react";

import { dispatchCartUpdated } from "@/app/utils/cart-event";
import { getStoredUser } from "@/features/auth/auth-storage";
import { useVoucher } from "@/features/vouchers";
import { fetchCartByUser } from "@/services/cart-service";
import { createOrder } from "@/services/orders-service";
import { fetchMyAddresses } from "@/services/users-service";
import type { UserAddress } from "@/services/users-service";

type CheckoutItem = {
  id: string;
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

type BillingField =
  | "firstName"
  | "companyName"
  | "streetAddress"
  | "apartment"
  | "city"
  | "phone"
  | "email";

type BillingForm = Record<BillingField, string>;

const SHIPPING_FEE = 0;
const NEW_ADDRESS = "__new__";

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
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billing, setBilling] = useState<BillingForm>(initialBillingForm);
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cod">("cod");
  const [saveInfo, setSaveInfo] = useState(true);
  const [orderMessage, setOrderMessage] = useState("");

  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(NEW_ADDRESS);

  const voucherState = useVoucher();

  useEffect(() => {
    let isMounted = true;
    const user = getStoredUser();

    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const loadCart = async () => {
      try {
        const cart = await fetchCartByUser(user.id);
        if (!isMounted) {
          return;
        }

        setItems(
          cart.items.map((item) => ({
            id: String(item.id),
            name: item.product.name,
            price: Number(item.unitPrice),
            quantity: item.quantity,
            image: item.product.imageUrl,
            selectedOptions: item.selectedOptions.map((opt) => ({
              groupName: opt.groupName,
              optionName: opt.optionName,
              priceDelta: opt.priceDelta,
            })),
          })),
        );
      } catch {
        if (!isMounted) {
          return;
        }
        setItems([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const loadAddresses = async () => {
      try {
        const data = await fetchMyAddresses();
        if (!isMounted) {
          return;
        }
        setSavedAddresses(data);
        const defaultAddr = data.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(String(defaultAddr.id));
        } else if (data.length > 0) {
          setSelectedAddressId(String(data[0].id));
        } else {
          setSelectedAddressId(NEW_ADDRESS);
        }
      } catch {
        if (!isMounted) {
          return;
        }
        setSavedAddresses([]);
      }
    };

    void loadCart();
    void loadAddresses();

    return () => {
      isMounted = false;
    };
  }, []);

  const subTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const total = Math.max(0, subTotal - voucherState.discountAmount + SHIPPING_FEE);

  const setBillingField = (field: BillingField, value: string) => {
    setBilling((prev) => ({ ...prev, [field]: value }));
  };

  const applyCoupon = () => {
    voucherState.apply(subTotal);
  };

  const isUsingSavedAddress =
    selectedAddressId !== NEW_ADDRESS && savedAddresses.length > 0;

  const placeOrder = async () => {
    if (items.length === 0) {
      setOrderMessage("Cart is empty.");
      return;
    }

    if (!isUsingSavedAddress) {
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
    }

    setIsSubmitting(true);
    try {
      await createOrder({
        shippingFee: SHIPPING_FEE,
        voucherCode: voucherState.voucher?.code,
        paymentMethod: paymentMethod === "cod" ? "COD" : "BANK",
        ...(isUsingSavedAddress
          ? { addressId: Number(selectedAddressId) }
          : {
              shippingAddress: {
                ...billing,
                saveInfo,
              },
            }),
      });

      setOrderMessage(
        paymentMethod === "cod"
          ? "Order placed successfully. Payment method: Cash on delivery."
          : "Order placed successfully. Payment method: Bank transfer.",
      );
      setItems([]);
      voucherState.reset();
      dispatchCartUpdated();
    } catch {
      setOrderMessage("Unable to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    billing,
    checkoutItems: items,
    couponCode: voucherState.code,
    couponMessage: voucherState.message,
    discountAmount: voucherState.discountAmount,
    paymentMethod,
    saveInfo,
    shippingFee: SHIPPING_FEE,
    subTotal,
    total,
    orderMessage,
    isLoading,
    isSubmitting,
    savedAddresses,
    selectedAddressId,
    isUsingSavedAddress,
    NEW_ADDRESS,
    setSelectedAddressId,
    applyCoupon,
    placeOrder,
    setBillingField,
    setCouponCode: voucherState.setCode,
    setPaymentMethod,
    setSaveInfo,
  };
};
