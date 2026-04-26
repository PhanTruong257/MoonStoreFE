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
  const raw = localStorage.getItem(buildKey(userId));
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as SellerProductItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(buildKey(userId));
    return [];
  }
};

export const saveSellerProducts = (
  userId: number,
  items: SellerProductItem[],
) => {
  localStorage.setItem(buildKey(userId), JSON.stringify(items));
};
