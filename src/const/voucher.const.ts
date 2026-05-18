import { UI_TEXT } from "./ui-text";

export const VOUCHER_DISCOUNT_TYPE = {
  PERCENT: "percent",
  FIXED: "fixed",
} as const;

export type VoucherDiscountType =
  (typeof VOUCHER_DISCOUNT_TYPE)[keyof typeof VOUCHER_DISCOUNT_TYPE];

export const VOUCHER_DISCOUNT_TYPE_OPTIONS =
  UI_TEXT.statusOptions.voucherType;
