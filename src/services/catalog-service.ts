import { http } from "@/app/api/http";

export type CatalogCategory = {
  id: number;
  name: string;
  parentId?: number | null;
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

export type CatalogProductListResponse = {
  products: CatalogProduct[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CatalogProductListParams = {
  categoryId?: number;
  page?: number;
  limit?: number;
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
  const response =
    await http.get<CatalogProductListResponse>("/catalog/products");
  return response.data.products;
};

export const fetchProductList = async (params: CatalogProductListParams) => {
  const response = await http.get<CatalogProductListResponse>(
    "/catalog/products",
    {
      params: {
        categoryId: params.categoryId,
        page: params.page ?? 1,
        limit: params.limit ?? 8,
      },
    },
  );

  return response.data;
};

export const fetchProductDetail = async (productId: number) => {
  const response = await http.get<{ product: CatalogProductDetail }>(
    `/catalog/products/${productId}`,
  );
  return response.data.product;
};
