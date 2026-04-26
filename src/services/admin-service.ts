import { http } from "@/app/api/http";

export type AdminUser = {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
};

export type AdminSeller = {
  id: number;
  userId: number;
  shopName: string;
  description: string | null;
  status: string;
  rejectReason: string | null;
  user: {
    id: number;
    email: string;
    fullName: string;
    phone: string;
    role: string;
  };
};

export type AdminStats = {
  totalUsers: number;
  totalSellers: number;
  pendingSellers: number;
  totalAdmins: number;
};

export const fetchAdminStats = async () => {
  const response = await http.get<AdminStats>("/admin/stats");
  return response.data;
};

export const fetchAdminUsers = async (role?: string) => {
  const response = await http.get<{ users: AdminUser[] }>("/admin/users", {
    params: role ? { role } : undefined,
  });
  return response.data.users;
};

export const promoteUserToAdmin = async (userId: number) => {
  const response = await http.patch<{ user: AdminUser }>(
    `/admin/users/${userId}/promote-admin`,
  );
  return response.data.user;
};

export const fetchAdminSellers = async (status?: string) => {
  const response = await http.get<{ sellers: AdminSeller[] }>(
    "/admin/sellers",
    {
      params: status ? { status } : undefined,
    },
  );
  return response.data.sellers;
};

export const approveSeller = async (sellerId: number) => {
  const response = await http.patch<{ seller: AdminSeller }>(
    `/admin/sellers/${sellerId}/approve`,
  );
  return response.data.seller;
};

export const rejectSeller = async (sellerId: number, reason?: string) => {
  const response = await http.patch<{ seller: AdminSeller }>(
    `/admin/sellers/${sellerId}/reject`,
    { reason },
  );
  return response.data.seller;
};

export const setUserStatus = async (
  userId: number,
  next: "disable" | "enable",
) => {
  const response = await http.patch<{ user: AdminUser }>(
    `/admin/users/${userId}/${next}`,
  );
  return response.data.user;
};

export const setSellerStatus = async (
  sellerId: number,
  next: "disable" | "enable",
) => {
  const response = await http.patch<{ seller: AdminSeller }>(
    `/admin/sellers/${sellerId}/${next}`,
  );
  return response.data.seller;
};

// === Categories ===

export type AdminCategory = {
  id: number;
  name: string;
  parentId: number | null;
  productCount: number;
  childCount: number;
};

export type CreateAdminCategoryPayload = {
  name: string;
  parentId?: number | null;
};

export type UpdateAdminCategoryPayload = {
  name?: string;
  parentId?: number | null;
};

export const fetchAdminCategories = async () => {
  const response = await http.get<{ categories: AdminCategory[] }>(
    "/admin/categories",
  );
  return response.data.categories;
};

export const createAdminCategory = async (
  payload: CreateAdminCategoryPayload,
) => {
  const response = await http.post<{ category: AdminCategory }>(
    "/admin/categories",
    payload,
  );
  return response.data.category;
};

export const updateAdminCategory = async (
  id: number,
  payload: UpdateAdminCategoryPayload,
) => {
  const response = await http.patch<{ category: AdminCategory }>(
    `/admin/categories/${id}`,
    payload,
  );
  return response.data.category;
};

export const deleteAdminCategory = async (id: number) => {
  const response = await http.delete<{ id: number }>(
    `/admin/categories/${id}`,
  );
  return response.data;
};

// === Brands ===

export type AdminBrand = {
  id: number;
  name: string;
  productCount: number;
};

export type CreateAdminBrandPayload = {
  name: string;
};

export const fetchAdminBrands = async () => {
  const response = await http.get<{ brands: AdminBrand[] }>("/admin/brands");
  return response.data.brands;
};

export const createAdminBrand = async (payload: CreateAdminBrandPayload) => {
  const response = await http.post<{ brand: AdminBrand }>(
    "/admin/brands",
    payload,
  );
  return response.data.brand;
};

export const updateAdminBrand = async (
  id: number,
  payload: { name?: string },
) => {
  const response = await http.patch<{ brand: AdminBrand }>(
    `/admin/brands/${id}`,
    payload,
  );
  return response.data.brand;
};

export const deleteAdminBrand = async (id: number) => {
  const response = await http.delete<{ id: number }>(`/admin/brands/${id}`);
  return response.data;
};

// === Vouchers ===

export type AdminVoucher = {
  id: number;
  code: string;
  discountType: string;
  value: number;
  maxDiscount: number | null;
  expiredAt: string;
  usageCount: number;
};

export type CreateAdminVoucherPayload = {
  code: string;
  discountType: string;
  value: number;
  maxDiscount?: number | null;
  expiredAt: string;
};

export type UpdateAdminVoucherPayload = Partial<CreateAdminVoucherPayload>;

export type AdminVoucherUsage = {
  id: number;
  userId: number;
  orderId: number;
  userEmail: string;
  userFullName: string;
};

export const fetchAdminVouchers = async () => {
  const response = await http.get<{ vouchers: AdminVoucher[] }>(
    "/admin/vouchers",
  );
  return response.data.vouchers;
};

export const createAdminVoucher = async (
  payload: CreateAdminVoucherPayload,
) => {
  const response = await http.post<{ voucher: AdminVoucher }>(
    "/admin/vouchers",
    payload,
  );
  return response.data.voucher;
};

export const updateAdminVoucher = async (
  id: number,
  payload: UpdateAdminVoucherPayload,
) => {
  const response = await http.patch<{ voucher: AdminVoucher }>(
    `/admin/vouchers/${id}`,
    payload,
  );
  return response.data.voucher;
};

export const deleteAdminVoucher = async (id: number) => {
  const response = await http.delete<{ id: number }>(`/admin/vouchers/${id}`);
  return response.data;
};

export const fetchAdminVoucherUsages = async (id: number) => {
  const response = await http.get<{ usages: AdminVoucherUsage[] }>(
    `/admin/vouchers/${id}/usages`,
  );
  return response.data.usages;
};

// === Orders ===

export type AdminOrderListItem = {
  id: number;
  userId: number;
  userFullName: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  groupCount: number;
};

export type AdminOrderItem = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPriceAtTime: number;
  imageUrl: string;
};

export type AdminOrderGroup = {
  id: number;
  sellerId: number;
  sellerShopName: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  items: AdminOrderItem[];
};

export type AdminOrderDetail = {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  userPhone: string;
  voucherId: number | null;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  shippingAddress: Record<string, unknown> | null;
  createdAt: string;
  groups: AdminOrderGroup[];
};

export type AdminOrderListFilters = {
  status?: string;
  paymentStatus?: string;
  sellerId?: number;
  userId?: number;
};

export const fetchAdminOrders = async (filters: AdminOrderListFilters) => {
  const response = await http.get<{ orders: AdminOrderListItem[] }>(
    "/admin/orders",
    { params: filters },
  );
  return response.data.orders;
};

export const fetchAdminOrderDetail = async (id: number) => {
  const response = await http.get<{ order: AdminOrderDetail }>(
    `/admin/orders/${id}`,
  );
  return response.data.order;
};
