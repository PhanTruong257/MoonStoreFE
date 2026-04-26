import { formatDateTime, formatMoney } from "@/app/utils/format";

export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPING: "SHIPPING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_COLORS: Record<string, string> = {
  [ORDER_STATUS.PENDING]: "gold",
  [ORDER_STATUS.CONFIRMED]: "blue",
  [ORDER_STATUS.SHIPPING]: "geekblue",
  [ORDER_STATUS.DELIVERED]: "green",
  [ORDER_STATUS.CANCELLED]: "red",
};

export const ORDER_STATUS_FILTER_ALL = "ALL";

export const ORDER_STATUS_FILTER_OPTIONS = [
  { label: "All", value: ORDER_STATUS_FILTER_ALL },
  { label: "Pending", value: ORDER_STATUS.PENDING },
  { label: "Confirmed", value: ORDER_STATUS.CONFIRMED },
  { label: "Shipping", value: ORDER_STATUS.SHIPPING },
  { label: "Delivered", value: ORDER_STATUS.DELIVERED },
  { label: "Cancelled", value: ORDER_STATUS.CANCELLED },
];

/** Reuse central format helpers; keep aliases for backward compatibility. */
export const formatOrdersCurrency = formatMoney;
export const formatOrdersDateTime = formatDateTime;
