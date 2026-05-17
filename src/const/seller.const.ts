export const SELLER_ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPING: "SHIPPING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type SellerOrderStatus =
  (typeof SELLER_ORDER_STATUS)[keyof typeof SELLER_ORDER_STATUS];

export const SELLER_ORDER_STATUS_FLOW: SellerOrderStatus[] = [
  SELLER_ORDER_STATUS.PENDING,
  SELLER_ORDER_STATUS.CONFIRMED,
  SELLER_ORDER_STATUS.SHIPPING,
  SELLER_ORDER_STATUS.DELIVERED,
];

export const SELLER_ORDER_STATUS_COLORS: Record<string, string> = {
  [SELLER_ORDER_STATUS.PENDING]: "gold",
  [SELLER_ORDER_STATUS.CONFIRMED]: "blue",
  [SELLER_ORDER_STATUS.SHIPPING]: "cyan",
  [SELLER_ORDER_STATUS.DELIVERED]: "green",
  [SELLER_ORDER_STATUS.CANCELLED]: "red",
};

export const SELLER_ORDER_STATUS_FILTER_OPTIONS = [
  { label: "All status", value: "ALL" },
  { label: "Pending", value: SELLER_ORDER_STATUS.PENDING },
  { label: "Confirmed", value: SELLER_ORDER_STATUS.CONFIRMED },
  { label: "Shipping", value: SELLER_ORDER_STATUS.SHIPPING },
  { label: "Delivered", value: SELLER_ORDER_STATUS.DELIVERED },
  { label: "Cancelled", value: SELLER_ORDER_STATUS.CANCELLED },
];

export const SELLER_PRODUCT_STATUS = {
  ACTIVE: "active",
  DRAFT: "draft",
} as const;

export const SELLER_PRODUCT_STATUS_FILTER_OPTIONS = [
  { label: "All status", value: "ALL" },
  { label: "Active", value: SELLER_PRODUCT_STATUS.ACTIVE },
  { label: "Draft", value: SELLER_PRODUCT_STATUS.DRAFT },
];

export const SELLER_ROUTES = {
  dashboard: "/seller",
  orders: "/seller/orders",
  orderDetail: (groupId: number | string) => `/seller/orders/${groupId}`,
  products: "/seller/products",
  productNew: "/seller/products/new",
  wallet: "/seller/wallet",
  chat: "/seller/chat",
} as const;

export const WITHDRAWAL_STATUS_COLORS: Record<string, string> = {
  PENDING: "gold",
  APPROVED: "green",
  REJECTED: "red",
};

export const CURRENCY_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export const formatSellerCurrency = (value: number) =>
  CURRENCY_FORMATTER.format(value);

export const formatSellerDateTime = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN");

export const getNextOrderStatus = (current: string): string | null => {
  const idx = SELLER_ORDER_STATUS_FLOW.indexOf(current as SellerOrderStatus);
  if (idx < 0 || idx === SELLER_ORDER_STATUS_FLOW.length - 1) {
    return null;
  }
  return SELLER_ORDER_STATUS_FLOW[idx + 1];
};
