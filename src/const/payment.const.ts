export const PAYMENT_METHOD = {
  COD: "COD",
  BANK: "BANK",
  VNPAY: "VNPAY",
  QR: "QR",
} as const;

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  REFUNDED: "REFUNDED",
  FAILED: "FAILED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const CHECKOUT_PAYMENT_OPTIONS = {
  COD: "cod",
  BANK: "bank",
  VNPAY: "vnpay",
  QR: "qr",
} as const;

export type CheckoutPaymentOption =
  (typeof CHECKOUT_PAYMENT_OPTIONS)[keyof typeof CHECKOUT_PAYMENT_OPTIONS];

export const checkoutOptionToApiMethod = (
  option: CheckoutPaymentOption,
): PaymentMethod => {
  if (option === CHECKOUT_PAYMENT_OPTIONS.VNPAY) {
    return PAYMENT_METHOD.VNPAY;
  }
  if (option === CHECKOUT_PAYMENT_OPTIONS.QR) {
    return PAYMENT_METHOD.QR;
  }
  if (option === CHECKOUT_PAYMENT_OPTIONS.BANK) {
    return PAYMENT_METHOD.BANK;
  }
  return PAYMENT_METHOD.COD;
};
