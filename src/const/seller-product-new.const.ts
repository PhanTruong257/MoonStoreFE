import { PRODUCT_STATUS } from "@/const/product.const";

export const SELLER_PRODUCT_NEW_DEFAULTS = {
  CATEGORY_ID: 1,
  BRAND_ID: 1,
  BASE_PRICE: 0,
  STOCK: 10,
  IMAGE_URL: "/images/products/product-1.jpg",
  STATUS: PRODUCT_STATUS.ACTIVE,
} as const;

export const SELLER_PRODUCT_STATUS_OPTIONS = [
  { label: "Active", value: PRODUCT_STATUS.ACTIVE },
  { label: "Draft", value: PRODUCT_STATUS.DRAFT },
];

export const OPTION_GROUPS_JSON_PLACEHOLDER =
  '[{"name":"Size","required":true,"multiSelect":false,"options":[{"name":"S","priceDelta":0},{"name":"M","priceDelta":0}]}]';
