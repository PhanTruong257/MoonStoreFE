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

export type CartItemResponse = {
  id: number;
  quantity: number;
  sku: {
    id: number;
    price: number;
    stock: number;
    imageUrl: string;
    product: {
      id: number;
      name: string;
    };
  };
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

export const fetchCartByUser = async (userId: number) => {
  const response = await http.get<CartResponse>(`/cart/user/${userId}`);
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
