import { http } from "@/app/api/http";

export type AddToCartPayload = {
  productId: number;
  optionIds?: number[];
  quantity?: number;
};

export type AddToCartResponse = {
  cartId: number;
  itemId: number;
  productId: number;
  quantity: number;
};

export type CartItemSelectedOption = {
  optionId: number;
  groupName: string;
  optionName: string;
  priceDelta: number;
};

export type CartItemProduct = {
  id: number;
  name: string;
  basePrice: number;
  stock: number;
  imageUrl: string;
};

export type CartItemResponse = {
  id: number;
  quantity: number;
  unitPrice: number;
  product: CartItemProduct;
  selectedOptions: CartItemSelectedOption[];
};

export type CartResponse = {
  cartId: number;
  userId: number;
  items: CartItemResponse[];
};

export const addToCart = async (payload: AddToCartPayload) => {
  const response = await http.post<AddToCartResponse>("/cart/items", payload);
  return response.data;
};

export const fetchMyCart = async () => {
  const response = await http.get<CartResponse>("/cart/me");
  return response.data;
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  const response = await http.patch<{ itemId: number; quantity: number }>(
    `/cart/items/${itemId}`,
    { quantity },
  );
  return response.data;
};

export const removeCartItem = async (itemId: number) => {
  const response = await http.delete<{ itemId: number }>(
    `/cart/items/${itemId}`,
  );
  return response.data;
};
