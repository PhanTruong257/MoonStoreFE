import { http } from "@/app/api/http";

export type SellerProfile = {
  id: number;
  userId: number;
  shopName: string;
  description: string | null;
  status: string;
  rejectReason: string | null;
};

export type CreateSellerPayload = {
  shopName: string;
  description?: string;
};

export type CreateSellerResponse = {
  seller: SellerProfile;
};

export type SellerProfileMeResponse = {
  seller: SellerProfile | null;
};

export type UpdateSellerProfilePayload = {
  shopName?: string;
  description?: string;
};

export type SellerProductOptionInput = {
  name: string;
  priceDelta?: number;
};

export type SellerProductOptionGroupInput = {
  name: string;
  required?: boolean;
  multiSelect?: boolean;
  options: SellerProductOptionInput[];
};

export type CreateProductPayload = {
  name: string;
  description?: string;
  categoryId: number;
  brandId: number;
  basePrice: number;
  stock: number;
  imageUrl: string;
  status?: string;
  optionGroups?: SellerProductOptionGroupInput[];
};

export type SellerProductOption = {
  id: number;
  name: string;
  priceDelta: number;
  position: number;
};

export type SellerProductOptionGroup = {
  id: number;
  name: string;
  position: number;
  required: boolean;
  multiSelect: boolean;
  options: SellerProductOption[];
};

export type SellerProduct = {
  id: number;
  sellerId: number;
  name: string;
  description: string | null;
  status: string;
  categoryId: number;
  brandId: number;
  basePrice: number;
  stock: number;
  imageUrl: string;
  optionGroups: SellerProductOptionGroup[];
};

export type CreateProductResponse = {
  product: SellerProduct;
};

export type SellerProductListItem = {
  id: number;
  name: string;
  description: string | null;
  status: string;
  categoryId: number;
  brandId: number;
  basePrice: number;
  stock: number;
  imageUrl: string;
};

export type SellerOrderItemSelectedOption = {
  groupName: string;
  optionName: string;
  priceDelta: number;
};

export type SellerOrderItem = {
  id: number;
  productId: number;
  productName: string;
  basePriceAtTime: number;
  optionsTotalAtTime: number;
  unitPriceAtTime: number;
  imageUrl: string;
  quantity: number;
  selectedOptions: SellerOrderItemSelectedOption[];
};

export type SellerOrderBuyer = {
  id: number;
  fullName: string;
  phone: string;
};

export type SellerOrderGroup = {
  id: number;
  orderId: number;
  status: string;
  subtotal: number;
  shippingFee: number;
  createdAt: string;
  buyer: SellerOrderBuyer;
  items: SellerOrderItem[];
};

export type SellerOrderStatusLog = {
  id: number;
  status: string;
  note: string | null;
  createdAt: string;
};

export type SellerOrderDetail = SellerOrderGroup & {
  shippingAddress: Record<string, unknown> | null;
  paymentMethod: string;
  paymentStatus: string;
  qrPaymentId: number | null;
  statusLogs: SellerOrderStatusLog[];
};

export type SellerStats = {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  revenue: number;
};

export type UpdateOrderGroupStatusPayload = {
  status: string;
  note?: string;
};

export type UpdateOrderGroupStatusResponse = {
  groupId: number;
  status: string;
};

export const createSellerProfile = async (payload: CreateSellerPayload) => {
  const response = await http.post<CreateSellerResponse>(
    "/sellers/register",
    payload,
  );
  return response.data;
};

export const fetchMySellerProfile = async () => {
  const response = await http.get<SellerProfileMeResponse>(
    "/sellers/me/profile",
  );
  return response.data.seller;
};

export const updateMySellerProfile = async (
  payload: UpdateSellerProfilePayload,
) => {
  const response = await http.patch<SellerProfileMeResponse>(
    "/sellers/me/profile",
    payload,
  );
  return response.data.seller;
};

export const createProduct = async (payload: CreateProductPayload) => {
  const response = await http.post<CreateProductResponse>(
    "/sellers/products",
    payload,
  );
  return response.data;
};

export type UpdateSellerProductPayload = Partial<
  Omit<CreateProductPayload, "userId">
>;

export const fetchSellerProductDetail = async (productId: number) => {
  const response = await http.get<CreateProductResponse>(
    `/sellers/products/${productId}/detail`,
  );
  return response.data;
};

export const updateSellerProduct = async (
  productId: number,
  payload: UpdateSellerProductPayload,
) => {
  const response = await http.patch<CreateProductResponse>(
    `/sellers/products/${productId}`,
    payload,
  );
  return response.data;
};

export const deleteSellerProduct = async (productId: number) => {
  const response = await http.delete<{ id: number; status: string }>(
    `/sellers/products/${productId}`,
  );
  return response.data;
};

export const fetchSellerProducts = async () => {
  const response = await http.get<{ products: SellerProductListItem[] }>(
    "/sellers/me/products",
  );
  return response.data.products;
};

export const fetchSellerOrders = async () => {
  const response = await http.get<{ groups: SellerOrderGroup[] }>(
    "/sellers/me/orders",
  );
  return response.data.groups;
};

export const fetchSellerOrderDetail = async (groupId: number) => {
  const response = await http.get<{ group: SellerOrderDetail }>(
    `/sellers/me/orders/${groupId}`,
  );
  return response.data.group;
};

export const fetchSellerStats = async () => {
  const response = await http.get<SellerStats>("/sellers/me/stats");
  return response.data;
};

export const updateOrderGroupStatus = async (
  groupId: number,
  payload: UpdateOrderGroupStatusPayload,
) => {
  const response = await http.patch<UpdateOrderGroupStatusResponse>(
    `/orders/groups/${groupId}/status`,
    payload,
  );
  return response.data;
};
