import { PRODUCT_STATUS } from "@/const/product.const";
import { UI_TEXT } from "./ui-text";

export const SELLER_PRODUCT_NEW_DEFAULTS = {
  CATEGORY_ID: 1,
  BRAND_ID: 1,
  BASE_PRICE: 0,
  STOCK: 10,
  IMAGE_URL: "",
  STATUS: PRODUCT_STATUS.ACTIVE,
} as const;

export const SELLER_PRODUCT_STATUS_OPTIONS =
  UI_TEXT.statusOptions.productStatusOptions;
