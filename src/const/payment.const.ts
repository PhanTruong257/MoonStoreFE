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

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  [PAYMENT_STATUS.PENDING]: "Chờ thanh toán",
  [PAYMENT_STATUS.PAID]: "Đã thanh toán",
  [PAYMENT_STATUS.REFUNDED]: "Đã hoàn tiền",
  [PAYMENT_STATUS.FAILED]: "Thanh toán thất bại",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  [PAYMENT_METHOD.COD]: "Thanh toán khi nhận hàng",
  [PAYMENT_METHOD.BANK]: "Chuyển khoản ngân hàng",
  [PAYMENT_METHOD.VNPAY]: "VNPay",
  [PAYMENT_METHOD.QR]: "Chuyển khoản QR",
};

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
