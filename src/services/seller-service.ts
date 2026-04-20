import { http } from "@/app/api/http";

export type CreateSellerPayload = {
  userId: number;
  shopName: string;
  description?: string;
};

export type CreateSellerResponse = {
  seller: {
    id: number;
    userId: number;
    shopName: string;
    description: string | null;
    status: string;
  };
};

export type CreateProductPayload = {
  userId: number;
  name: string;
  description?: string;
  categoryId: number;
  brandId: number;
  price: number;
  stock: number;
  imageUrl: string;
  skuCode?: string;
  status?: string;
};

export type CreateProductResponse = {
  product: {
    id: number;
    sellerId: number;
    name: string;
    description: string | null;
    status: string;
    categoryId: number;
    brandId: number;
  };
  sku: {
    id: number;
    productId: number;
    skuCode: string;
    price: number;
    stock: number;
    imageUrl: string;
  };
};

export const createSellerProfile = async (payload: CreateSellerPayload) => {
  const response = await http.post<CreateSellerResponse>(
    "/sellers/register",
    payload,
  );
  return response.data;
};

export const createProduct = async (payload: CreateProductPayload) => {
  const response = await http.post<CreateProductResponse>(
    "/sellers/products",
    payload,
  );
  return response.data;
};
