export const SELLER_APPLICATION_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  REJECTED: "rejected",
  DISABLED: "disabled",
} as const;

export type SellerApplicationStatus =
  (typeof SELLER_APPLICATION_STATUS)[keyof typeof SELLER_APPLICATION_STATUS];

export const SELLER_APPLICATION_STATUS_COLORS: Record<string, string> = {
  [SELLER_APPLICATION_STATUS.PENDING]: "gold",
  [SELLER_APPLICATION_STATUS.ACTIVE]: "green",
  [SELLER_APPLICATION_STATUS.REJECTED]: "red",
  [SELLER_APPLICATION_STATUS.DISABLED]: "default",
};
