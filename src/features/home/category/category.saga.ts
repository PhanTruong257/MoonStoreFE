import { call, put, takeLatest } from "redux-saga/effects";

import {
  homeCategoryActions,
  type CategoryItem,
} from "@/features/home/category/category.slice";
import { fetchCategories } from "@/services/catalog-service";

function* handleCategoryInit() {
  try {
    const categoryList = (yield call(fetchCategories)) as Array<{
      id: number;
      name: string;
    }>;
    const mapped: CategoryItem[] = [
      { id: "all", label: "All" },
      ...categoryList.map((item) => ({
        id: String(item.id),
        label: item.name,
      })),
    ];
    yield put(homeCategoryActions.categoryInitSucceeded(mapped));
  } catch {
    yield put(
      homeCategoryActions.categoryInitFailed("Unable to load categories."),
    );
  }
}

export function* homeCategorySaga() {
  yield takeLatest(
    homeCategoryActions.categoryInitRequested.type,
    handleCategoryInit,
  );
}
