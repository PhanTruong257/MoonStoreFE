import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { RootState } from "@/app/app-store";
import { dispatchCartUpdated } from "@/app/utils/cart-event";
import { extractApiErrorMessage } from "@/app/utils/error-message";
import {
  readJsonFromStorage,
  removeFromStorage,
} from "@/app/utils/storage";
import {
  CHECKOUT_PAYMENT_OPTIONS,
  type CheckoutPaymentOption,
  checkoutOptionToApiMethod,
} from "@/const/payment.const";
import { STORAGE_KEYS } from "@/const/storage.const";
import type { AuthState } from "@/features/auth/auth-slice";
import { getStoredUser } from "@/features/auth/auth-storage";
import { useVoucher } from "@/features/vouchers";
import { fetchMyCart } from "@/services/cart-service";
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

export const useCheckoutPageData = () => {
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const storedUser = getStoredUser();
  const activeUser = user ?? storedUser;
  const activeUserId = activeUser?.id;

  const [billing, setBilling] = useState<BillingForm>({
    firstName: activeUser?.fullName ?? "",
    companyName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    phone: "",
    email: activeUser?.email ?? "",
  });

  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentOption>(
    CHECKOUT_PAYMENT_OPTIONS.QR,
  );
  const [saveInfo, setSaveInfo] = useState(true);
  const [orderMessage, setOrderMessage] = useState("");

  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(NEW_ADDRESS);

  const voucherState = useVoucher();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeUserId) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadCart = async () => {
      try {
        const cart = await fetchMyCart();
        if (!isMounted) {
          return;
        }

        const selectedIds = readJsonFromStorage<number[]>(
          STORAGE_KEYS.CART_SELECTED_IDS,
          [],
        );
        const selectedSet = new Set(
          Array.isArray(selectedIds) ? selectedIds : [],
        );
        const sourceItems =
          selectedSet.size > 0
            ? cart.items.filter((item) => selectedSet.has(item.id))
            : cart.items;

        setItems(
          sourceItems.map((item) => ({
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
  }, [activeUserId]);

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
      const cartItemIds = items
        .map((item) => Number(item.id))
        .filter((id) => Number.isFinite(id));

      const response = await createOrder({
        shippingFee: SHIPPING_FEE,
        voucherCode: voucherState.voucher?.code,
        paymentMethod: checkoutOptionToApiMethod(paymentMethod),
        cartItemIds,
        ...(isUsingSavedAddress
          ? { addressId: Number(selectedAddressId) }
          : {
              shippingAddress: {
                ...billing,
                saveInfo,
              },
            }),
      });

      setItems([]);
      voucherState.reset();
      removeFromStorage(STORAGE_KEYS.CART_SELECTED_IDS);
      dispatchCartUpdated();

      if (
        paymentMethod === CHECKOUT_PAYMENT_OPTIONS.VNPAY &&
        response.paymentUrl
      ) {
        setOrderMessage("Redirecting to VNPay...");
        window.location.href = response.paymentUrl;
        return;
      }

      if (paymentMethod === CHECKOUT_PAYMENT_OPTIONS.QR) {
        setOrderMessage("Order placed. Redirecting to QR payment...");
        void navigate(`/orders/${response.orderId}`);
        return;
      }

      setOrderMessage(
        paymentMethod === CHECKOUT_PAYMENT_OPTIONS.COD
          ? "Order placed successfully. Payment method: Cash on delivery."
          : "Order placed successfully. Payment method: Bank transfer.",
      );
    } catch (error) {
      // Surface the real reason (out of stock, invalid voucher, bad address, ...)
      // instead of a generic message so the user knows what to fix.
      setOrderMessage(
        extractApiErrorMessage(error, "Unable to place order. Please try again."),
      );
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
