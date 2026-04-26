import { call, put, takeLatest } from "redux-saga/effects";

import { getStoredUser } from "@/features/auth/auth-storage";
import {
  flashSaleActions,
  type FlashProduct,
} from "@/features/home/flash-sale/flash-sale.slice";
import { addToCart as addToCartApi } from "@/services/cart-service";
import { fetchCategories, fetchProducts } from "@/services/catalog-service";

function* handleFlashSaleInit() {
  try {
    const [categoryList, productList] = (yield call(() =>
      Promise.all([fetchCategories(), fetchProducts()]),
    )) as [Array<{ id: number; name: string }>, Array<any>];

    const categories = [
      { id: "all", label: "All" },
      ...categoryList.map((item) => ({
        id: String(item.id),
        label: item.name,
      })),
    ];

    const products: FlashProduct[] = productList.map((item) => {
      const price = Number(item.basePrice ?? 0);

      return {
        id: String(item.id),
        name: item.name,
        price,
        oldPrice: Math.round(price * 1.2),
        categoryId: String(item.categoryId),
        image: item.imageUrl ?? "/images/products/product-1.jpg",
        rating: 4,
        sold: Math.max(10, (item.stock ?? 0) / 2),
        productIdNumber: item.id,
      };
    });

    yield put(
      flashSaleActions.flashSaleInitSucceeded({ categories, products }),
    );
  } catch {
    yield put(
      flashSaleActions.flashSaleInitFailed("Unable to load flash sale."),
    );
  }
}

function* handleAddToCart(
  action: ReturnType<typeof flashSaleActions.flashSaleAddToCartRequested>,
) {
  try {
    const user = getStoredUser();
    if (!action.payload.productIdNumber) {
      throw new Error("Missing product id");
    }
    yield call(addToCartApi, {
      userId: user?.id,
      productId: action.payload.productIdNumber,
      quantity: 1,
    });

    yield put(
      flashSaleActions.flashSaleAddToCartSucceeded({
        productId: action.payload.productId,
      }),
    );
  } catch {
    yield put(
      flashSaleActions.flashSaleAddToCartFailed("Unable to add to cart."),
    );
  }
}

export function* flashSaleSaga() {
  yield takeLatest(
    flashSaleActions.flashSaleInitRequested.type,
    handleFlashSaleInit,
  );
  yield takeLatest(
    flashSaleActions.flashSaleAddToCartRequested.type,
    handleAddToCart,
  );
}
