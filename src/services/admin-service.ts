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

export type GrantUserRolePayload = {
  role: "seller" | "shipper";
  shopName?: string;
};

export const grantUserRole = async (
  userId: number,
  payload: GrantUserRolePayload,
) => {
  const response = await http.patch<{ user: AdminUser }>(
    `/admin/users/${userId}/grant-role`,
    payload,
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

// === Commission ===

export const fetchCommissionRate = async () => {
  const response = await http.get<{ commissionRate: number }>(
    "/admin/config/commission",
  );
  return response.data;
};

export const setCommissionRate = async (rate: number) => {
  const response = await http.patch<{ commissionRate: number }>(
    "/admin/config/commission",
    { rate },
  );
  return response.data;
};

// === Refund Requests ===

export type AdminRefundRequest = {
  id: number;
  orderId: number;
  userId: number;
  reason: string;
  amount: number;
  status: string;
  note: string | null;
  processedAt: string | null;
  createdAt: string;
  user: { id: number; email: string; fullName: string };
  order: { id: number; finalAmount: number };
};

export const fetchAdminRefundRequests = async (status?: string) => {
  const response = await http.get<{ refundRequests: AdminRefundRequest[] }>(
    "/admin/refund-requests",
    { params: status ? { status } : undefined },
  );
  return response.data.refundRequests;
};

export const approveRefundRequest = async (id: number, note?: string) => {
  const response = await http.patch<{ id: number; status: string }>(
    `/admin/refund-requests/${id}/approve`,
    { note },
  );
  return response.data;
};

export const rejectRefundRequest = async (id: number, note?: string) => {
  const response = await http.patch<{ id: number; status: string }>(
    `/admin/refund-requests/${id}/reject`,
    { note },
  );
  return response.data;
};

// === Withdrawals ===

export type AdminWithdrawal = {
  id: number;
  amount: number;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  status: string;
  note: string | null;
  processedAt: string | null;
  createdAt: string;
  seller: { id: number; shopName: string };
};

export const fetchAdminWithdrawals = async (status?: string) => {
  const response = await http.get<{ withdrawals: AdminWithdrawal[] }>(
    "/admin/withdrawals",
    { params: status ? { status } : undefined },
  );
  return response.data.withdrawals;
};

export const approveWithdrawal = async (id: number, note?: string) => {
  const response = await http.patch<{ id: number; status: string }>(
    `/admin/withdrawals/${id}/approve`,
    { note },
  );
  return response.data;
};

export const rejectWithdrawal = async (id: number, note?: string) => {
  const response = await http.patch<{ id: number; status: string }>(
    `/admin/withdrawals/${id}/reject`,
    { note },
  );
  return response.data;
};

// === Revenue ===

export type AdminRevenueReport = {
  platformRevenue: number;
  totalTransactions: number;
  pendingRefunds: number;
  pendingWithdrawals: number;
};

export const fetchAdminRevenueReport = async () => {
  const response = await http.get<AdminRevenueReport>("/admin/revenue");
  return response.data;
};

// === Analytics (NL2SQL) ===

export type AnalyticsRevenuePoint = { period: string; revenue: number; orders: number };
export type AnalyticsTopProduct = { name: string; quantity: number; revenue: number };
export type AnalyticsStatusItem = { status: string; count: number };
export type AnalyticsUserGrowthPoint = { period: string; newUsers: number };

export type AdminAnalyticsDashboard = {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    activeSellers: number;
    activeProducts: number;
  };
  revenue: { series: AnalyticsRevenuePoint[] };
  topProducts: { items: AnalyticsTopProduct[] };
  statusBreakdown: { items: AnalyticsStatusItem[] };
  userGrowth: { series: AnalyticsUserGrowthPoint[] };
  returnRefund: {
    returns: number;
    refunds: number;
    totalOrders: number;
    returnRefundRatePercent: number;
  };
};

export type AnalyticsAskHistoryItem = { role: "user" | "assistant"; content: string };
export type AnalyticsAskResult = { tool: string; result: Record<string, unknown> };
export type AdminAnalyticsAskResponse = { text: string; data: AnalyticsAskResult[] };

export const fetchAdminAnalyticsDashboard = async () => {
  const response = await http.get<AdminAnalyticsDashboard>(
    "/admin/analytics/dashboard",
  );
  return response.data;
};

export const askAdminAnalytics = async (
  question: string,
  history: AnalyticsAskHistoryItem[],
) => {
  const response = await http.post<AdminAnalyticsAskResponse>(
    "/admin/analytics/ask",
    { question, history },
  );
  return response.data;
};
