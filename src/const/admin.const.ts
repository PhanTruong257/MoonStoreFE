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
} as const;

export const ADMIN_FILTER_ALL = "all";

export const ADMIN_USER_ROLE_OPTIONS = [
  ADMIN_FILTER_ALL,
  USER_ROLE.USER,
  USER_ROLE.SELLER,
  USER_ROLE.ADMIN,
] as const;

export type AdminUserRoleFilter =
  (typeof ADMIN_USER_ROLE_OPTIONS)[number];

export const ADMIN_SELLER_STATUS_OPTIONS = [
  SELLER_APPLICATION_STATUS.PENDING,
  SELLER_APPLICATION_STATUS.ACTIVE,
  SELLER_APPLICATION_STATUS.REJECTED,
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
