/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
import { useEffect, useMemo } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { normalizeCategorySlug } from "@/app/utils/category-slug";
import {
  productListActions,
  type ProductListItem,
  type ProductListCategory,
  type ProductListState,
} from "@/features/home/product-list/product-list.slice";

type UseProductListResult = {
  categories: ProductListCategory[];
  error: string | null;
  isLoading: boolean;
  items: ProductListItem[];
  page: number;
  total: number;
  totalPages: number;
  selectedCategoryId: string;
  setCategory: (categoryId: string) => void;
  previousPage: () => void;
  nextPage: () => void;
  goToPage: (nextPage: number) => void;
};

const selectProductList = (state: RootState): ProductListState =>
  state.productList as ProductListState;

export const useProductList = (
  searchQuery: string,
  initialCategorySlug?: string,
): UseProductListResult => {
  const syncedSlugRef = useRef<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const {
    categories,
    error,
    isLoading,
    items,
    limit,
    page,
    selectedCategoryId,
    total,
    totalPages,
  } = useSelector(selectProductList);

  useEffect(() => {
    dispatch(
      productListActions.productListRequested({
        categoryId: selectedCategoryId,
        page,
        limit,
      }),
    );
  }, [dispatch, limit, page, selectedCategoryId]);

  useEffect(() => {
    if (!initialCategorySlug) {
      syncedSlugRef.current = null;
      return;
    }

    const normalizedSlug = normalizeCategorySlug(initialCategorySlug);
    if (syncedSlugRef.current === normalizedSlug) {
      return;
    }

    const matchedCategory = categories.find(
      (category: ProductListCategory) =>
        normalizeCategorySlug(category.slug) === normalizedSlug,
    );

    if (!matchedCategory) {
      return;
    }

    syncedSlugRef.current = normalizedSlug;

    if (matchedCategory.id === selectedCategoryId) {
      return;
    }

    dispatch(productListActions.productListSetCategory(matchedCategory.id));
  }, [categories, dispatch, initialCategorySlug, selectedCategoryId]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.trim().toLowerCase();
    return items.filter((item: ProductListItem) =>
      item.name.toLowerCase().includes(query),
    );
  }, [items, searchQuery]);

  return {
    categories,
    error,
    isLoading,
    items: filteredItems,
    page,
    total,
    totalPages,
    selectedCategoryId,
    setCategory: (categoryId: string) =>
      dispatch(productListActions.productListSetCategory(categoryId)),
    previousPage: () => {
      if (page <= 1) {
        return;
      }
      dispatch(productListActions.productListSetPage(page - 1));
    },
    nextPage: () => {
      if (page >= totalPages) {
        return;
      }
      dispatch(productListActions.productListSetPage(page + 1));
    },
    goToPage: (nextPage: number) => {
      if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
        return;
      }
      dispatch(productListActions.productListSetPage(nextPage));
    },
  };
};
