import { call, put, takeLatest } from "redux-saga/effects";

import {
  homeCategoryActions,
  type CategoryItem,
} from "@/features/home/category/category.slice";
import { homeCategories } from "@/pages/home/mock-data";
import { http } from "@/app/api/http";

type ApiCategoryDto = {
  id: number;
  name: string;
  parentId: number | null;
};

type ApiCategoriesResponse = {
  categories: ApiCategoryDto[];
};

// Convert flat API response to hierarchical structure
const buildHierarchy = (categories: ApiCategoryDto[]): CategoryItem[] => {
  const categoryMap = new Map<number, CategoryItem>();

  // Create all categories
  for (const cat of categories) {
    if (!categoryMap.has(cat.id)) {
      categoryMap.set(cat.id, {
        id: cat.id.toString(),
        label: cat.name,
        children: [],
      });
    }
  }

  // Build parent-child relationships
  const parentCategories: CategoryItem[] = [];
  for (const cat of categories) {
    const categoryItem = categoryMap.get(cat.id);
    if (!categoryItem) continue;

    if (cat.parentId === null) {
      parentCategories.push(categoryItem);
    } else {
      const parent = categoryMap.get(cat.parentId);
      if (parent && categoryItem.children !== undefined) {
        parent.children!.push(categoryItem);
      }
    }
  }

  return parentCategories;
};

function* handleCategoryInit(): Generator {
  try {
    console.log("[Category Saga] Fetching categories from API...");
    const response: any = yield call(() =>
      http.get("/catalog/categories"),
    );

    console.log("[Category Saga] API Response:", response);

    // Axios wraps response in .data
    const apiData: ApiCategoriesResponse = response.data || response;

    if (apiData?.categories && Array.isArray(apiData.categories)) {
      const hierarchical = buildHierarchy(apiData.categories);
      console.log("[Category Saga] Built hierarchy:", hierarchical);
      yield put(homeCategoryActions.categoryInitSucceeded(hierarchical));
      return;
    }
  } catch (error) {
    console.warn("[Category Saga] Failed to fetch from API, using mock data:", error);
  }

  // Fallback to mock data
  console.log("[Category Saga] Using mock data");
  yield put(
    homeCategoryActions.categoryInitSucceeded(homeCategories as CategoryItem[]),
  );
}

export function* homeCategorySaga() {
  yield takeLatest(
    homeCategoryActions.categoryInitRequested.type,
    handleCategoryInit,
  );
}
