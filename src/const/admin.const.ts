import { USER_ROLE } from "./role.const";
import { SELLER_APPLICATION_STATUS } from "./seller-status.const";

export const ADMIN_ROUTES = {
  dashboard: "/admin",
  sellers: "/admin/sellers",
  users: "/admin/users",
  orders: "/admin/orders",
  orderDetail: (id: number | string) => `/admin/orders/${id}`,
  categories: "/admin/categories",
  brands: "/admin/brands",
  vouchers: "/admin/vouchers",
  revenue: "/admin/revenue",
  analytics: "/admin/analytics",
  refunds: "/admin/refunds",
  withdrawals: "/admin/withdrawals",
} as const;

export const ADMIN_ANALYTICS_SAMPLE_QUESTIONS = [
  "Doanh thu 6 tháng gần đây thế nào?",
  "Top 5 sản phẩm bán chạy nhất?",
  "Tỉ lệ đơn bị hủy là bao nhiêu?",
  "Có bao nhiêu yêu cầu đổi/trả và hoàn tiền?",
] as const;

export const ADMIN_REFUND_STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"] as const;
export const ADMIN_WITHDRAWAL_STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"] as const;

export const ADMIN_FILTER_ALL = "all";

export const ADMIN_USER_ROLE_OPTIONS = [
  ADMIN_FILTER_ALL,
  USER_ROLE.USER,
  USER_ROLE.SELLER,
  USER_ROLE.SHIPPER,
  USER_ROLE.ADMIN,
] as const;

export type AdminUserRoleFilter =
  (typeof ADMIN_USER_ROLE_OPTIONS)[number];

export const ADMIN_GRANT_ROLE_OPTIONS = [
  { label: "Seller", value: USER_ROLE.SELLER },
  { label: "Shipper", value: USER_ROLE.SHIPPER },
] as const;


export const ADMIN_SELLER_STATUS_OPTIONS = [
  SELLER_APPLICATION_STATUS.PENDING,
  SELLER_APPLICATION_STATUS.ACTIVE,
  SELLER_APPLICATION_STATUS.REJECTED,
  SELLER_APPLICATION_STATUS.DISABLED,
  ADMIN_FILTER_ALL,
] as const;

export type AdminSellerStatusFilter =
  (typeof ADMIN_SELLER_STATUS_OPTIONS)[number];

export const ADMIN_ORDER_STATUS_OPTIONS = [
  ADMIN_FILTER_ALL,
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
] as const;
