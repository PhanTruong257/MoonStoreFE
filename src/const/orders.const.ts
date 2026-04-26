export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPING: "SHIPPING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "gold",
  CONFIRMED: "blue",
  SHIPPING: "geekblue",
  DELIVERED: "green",
  CANCELLED: "red",
};

export const ORDER_STATUS_FILTER_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: ORDER_STATUS.PENDING },
  { label: "Confirmed", value: ORDER_STATUS.CONFIRMED },
  { label: "Shipping", value: ORDER_STATUS.SHIPPING },
  { label: "Delivered", value: ORDER_STATUS.DELIVERED },
  { label: "Cancelled", value: ORDER_STATUS.CANCELLED },
];

export const formatOrdersCurrency = (value: number) => `$${value.toFixed(2)}`;

export const formatOrdersDateTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString();
};
