import { http } from "@/app/api/http";

export type CatalogCategory = {
  id: number;
  name: string;
  parentId?: number | null;
};

export type CatalogOption = {
  id: number;
  name: string;
  priceDelta: number;
  position: number;
};

export type CatalogOptionGroup = {
  id: number;
  name: string;
  position: number;
  required: boolean;
  multiSelect: boolean;
  options: CatalogOption[];
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
  basePrice: number;
  stock: number;
  imageUrl: string;
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

export type ProductHighlight = {
  label: string;
  value: string;
};

export type CatalogProductDetail = CatalogProduct & {
  averageRating: number;
  totalReviews: number;
  sellerId: number;
  sellerShopName: string;
  highlights: ProductHighlight[] | null;
  optionGroups: CatalogOptionGroup[];
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

export const fetchRelatedProducts = async (productId: number) => {
  const response = await http.get<{ products: CatalogProduct[] }>(
    `/catalog/products/${productId}/related`,
  );
  return response.data.products;
};

export type ShopStorefrontProduct = {
  id: number;
  name: string;
  basePrice: number;
  imageUrl: string;
  stock: number;
};

export type ShopStorefront = {
  id: number;
  shopName: string;
  description: string | null;
  productCount: number;
  products: ShopStorefrontProduct[];
};

export const fetchShopStorefront = async (sellerId: number) => {
  const response = await http.get<{ shop: ShopStorefront }>(
    `/sellers/${sellerId}/storefront`,
  );
  return response.data.shop;
};
