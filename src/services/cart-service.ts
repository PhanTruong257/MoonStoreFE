import { http } from "@/app/api/http";

export type AddToCartPayload = {
  userId?: number;
  skuId?: number;
  productId?: number;
  productName?: string;
  quantity?: number;
};

export type AddToCartResponse = {
  cartId: number;
  itemId: number;
  skuId: number;
  quantity: number;
};

export const addToCart = async (payload: AddToCartPayload) => {
  const response = await http.post<AddToCartResponse>("/cart/items", payload);
  return response.data;
};
