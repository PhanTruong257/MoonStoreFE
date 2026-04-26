import { http } from "@/app/api/http";

export type CreateOrderPayload = {
  voucherCode?: string;
  shippingFee?: number;
  paymentMethod?: string;
  shippingAddress?: Record<string, unknown>;
};

export type CreateOrderResponse = {
  orderId: number;
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const response = await http.post<CreateOrderResponse>("/orders", payload);
  return response.data;
};
