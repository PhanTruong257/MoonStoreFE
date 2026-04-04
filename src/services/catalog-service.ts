import { http } from "@/app/api/http";

export type CatalogCategory = {
  id: number;
  name: string;
};

export type CatalogSku = {
  id: number;
  price: number;
  stock: number;
  imageUrl: string;
  attributes?: Array<{ name: string; value: string }>;
};

export type CatalogOptionGroup = {
  name: string;
  options: Array<{ value: string }>;
};

export type CatalogProduct = {
  id: number;
  name: string;
  description: string | null;
  status: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  defaultSku: CatalogSku | null;
};

export type CatalogProductDetail = {
  id: number;
  name: string;
  description: string | null;
  status: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  skus: CatalogSku[];
  optionGroups?: CatalogOptionGroup[];
};

export const fetchCategories = async () => {
  const response = await http.get<{ categories: CatalogCategory[] }>(
    "/catalog/categories",
  );
  return response.data.categories;
};

export const fetchProducts = async () => {
  const response = await http.get<{ products: CatalogProduct[] }>(
    "/catalog/products",
  );
  return response.data.products;
};

export const fetchProductDetail = async (productId: number) => {
  const response = await http.get<{ product: CatalogProductDetail }>(
    `/catalog/products/${productId}`,
  );
  return response.data.product;
};
