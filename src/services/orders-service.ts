import { http } from "@/app/api/http";

export type CreateOrderPayload = {
  voucherCode?: string;
  shippingFee?: number;
  paymentMethod?: string;
  shippingAddress?: Record<string, unknown>;
  addressId?: number;
};

export type CreateOrderQrInfo = {
  paymentId: number;
  amount: number;
  bankBin: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  transferContent: string;
  qrUrl: string;
};

export type CreateOrderResponse = {
  orderId: number;
  paymentUrl?: string;
  qrInfo?: CreateOrderQrInfo;
};

export type OrderItemSelectedOption = {
  groupName: string;
  optionName: string;
  priceDelta: number;
};

export type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  basePriceAtTime: number;
  optionsTotalAtTime: number;
  unitPriceAtTime: number;
  imageUrlAtTime: string;
  quantity: number;
  selectedOptions: OrderItemSelectedOption[];
};

export type OrderGroupSummary = {
  id: number;
  sellerId: number;
  status: string;
  subtotal: number;
  shippingFee: number;
  items?: OrderItem[];
};

export type OrderSummary = {
  id: number;
  userId: number;
  voucherId?: number | null;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  shippingAddress: Record<string, unknown> | null;
  createdAt: string;
  groups?: OrderGroupSummary[];
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const response = await http.post<CreateOrderResponse>("/orders", payload);
  return response.data;
};

export const fetchMyOrders = async () => {
  const response = await http.get<{ orders: OrderSummary[] }>("/orders");
  return response.data.orders;
};

export const fetchMyOrderDetail = async (orderId: number) => {
  const response = await http.get<{ order: OrderSummary }>(`/orders/${orderId}`);
  return response.data.order;
};

export const cancelOrderGroup = async (groupId: number) => {
  const response = await http.patch<{ groupId: number; status: string }>(
    `/orders/groups/${groupId}/cancel`,
  );
  return response.data;
};

export const createRefundRequest = async (
  orderId: number,
  payload: { reason: string; amount: number },
) => {
  const response = await http.post<{ refundRequestId: number; status: string }>(
    `/orders/${orderId}/refund-requests`,
    payload,
  );
  return response.data;
};
