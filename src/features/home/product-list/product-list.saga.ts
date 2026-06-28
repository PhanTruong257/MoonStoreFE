import { call, put, select, takeLatest } from "redux-saga/effects";

import type { RootState } from "@/app/app-store";
import { toCategorySlug } from "@/app/utils/category-slug";
import {
  productListActions,
  type ProductListCategory,
  type ProductListItem,
} from "@/features/home/product-list/product-list.slice";
import { fetchCategories, fetchProductList } from "@/services/catalog-service";

function* handleProductListRequested(
  action: ReturnType<typeof productListActions.productListRequested>,
) {
  try {
    const selectedCategoryId = action.payload?.categoryId ?? "all";
    const page = action.payload?.page ?? 1;
    const limit = action.payload?.limit ?? 24;

    const existingCategories = (yield select(
      (state: RootState) => state.productList.categories,
    )) as ProductListCategory[];

    let categories = existingCategories;
    if (existingCategories.length <= 1) {
      const categoryResponse = (yield call(fetchCategories)) as Array<{
        id: number;
        name: string;
        parentId?: number | null;
      }>;

      categories = [
        { id: "all", label: "Tất cả", slug: "all" },
        ...categoryResponse.map((item) => ({
          id: String(item.id),
          label: item.name,
          slug: toCategorySlug(item.name),
        })),
      ];
    }

    const productResponse = (yield call(fetchProductList, {
      categoryId:
        selectedCategoryId === "all" ? undefined : Number(selectedCategoryId),
      page,
      limit,
    })) as {
      products: Array<{
        id: number;
        name: string;
        basePrice: number;
        stock: number;
        imageUrl: string;
      }>;
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };

    const mapped: ProductListItem[] = productResponse.products.map((item) => {
      const price = Number(item.basePrice ?? 0);
      return {
        id: String(item.id),
        name: item.name,
        price,
        oldPrice: Math.round(price * 1.2),
        image: item.imageUrl ?? "/images/products/product-1.jpg",
        rating: 4,
        sold: Math.max(10, Math.round((item.stock ?? 0) / 2)),
        productIdNumber: item.id,
      };
    });

    yield put(
      productListActions.productListSucceeded({
        items: mapped,
        categories,
        page: productResponse.page,
        limit: productResponse.limit,
        total: productResponse.total,
        totalPages: productResponse.totalPages,
      }),
    );
  } catch {
    yield put(productListActions.productListFailed("Không tải được sản phẩm."));
  }
}

export function* productListSaga() {
  yield takeLatest(
    productListActions.productListRequested.type,
    handleProductListRequested,
  );
}
