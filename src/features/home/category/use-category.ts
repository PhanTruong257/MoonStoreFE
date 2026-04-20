import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { homeCategoryActions } from "@/features/home/category/category.slice";

const cycleSlice = <T>(list: T[], start: number, count: number): T[] => {
  if (list.length <= count) {
    return list;
  }

  return Array.from({ length: count }, (_, index) => {
    return list[(start + index) % list.length];
  });
};

export const useCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, start, activeCategoryId } = useSelector(
    (state: RootState) => state.homeCategory,
  );

  useEffect(() => {
    dispatch(homeCategoryActions.categoryInitRequested());
  }, [dispatch]);

  const visibleCategories = useMemo(() => {
    return cycleSlice(items, start, 6);
  }, [items, start]);

  return {
    activeCategoryId,
    visibleCategories,
    setActiveCategory: (categoryId: string) =>
      dispatch(homeCategoryActions.categorySetActive(categoryId)),
    nextCategory: () => dispatch(homeCategoryActions.categoryNext()),
    previousCategory: () => dispatch(homeCategoryActions.categoryPrevious()),
  };
};
