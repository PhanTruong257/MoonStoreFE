export const VOUCHER_DISCOUNT_TYPE = {
  PERCENT: "percent",
  FIXED: "fixed",
} as const;

export type VoucherDiscountType =
  (typeof VOUCHER_DISCOUNT_TYPE)[keyof typeof VOUCHER_DISCOUNT_TYPE];

export const VOUCHER_DISCOUNT_TYPE_OPTIONS = [
  { label: "Percent (%)", value: VOUCHER_DISCOUNT_TYPE.PERCENT },
  { label: "Fixed amount", value: VOUCHER_DISCOUNT_TYPE.FIXED },
];
