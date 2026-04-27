import {
  readJsonFromStorage,
  writeJsonToStorage,
} from "@/app/utils/storage";

export type SellerProductItem = {
  id: number;
  name: string;
  status: string;
  basePrice: number;
  stock: number;
  imageUrl: string;
  createdAt: string;
};

const buildKey = (userId: number) => `seller_products_${userId}`;

export const loadSellerProducts = (userId: number): SellerProductItem[] => {
  const items = readJsonFromStorage<SellerProductItem[]>(buildKey(userId), []);
  return Array.isArray(items) ? items : [];
};

export const saveSellerProducts = (
  userId: number,
  items: SellerProductItem[],
) => {
  writeJsonToStorage(buildKey(userId), items);
};
