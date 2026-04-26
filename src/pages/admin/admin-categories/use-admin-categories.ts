import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { adminCategoriesActions } from "@/features/admin/admin-categories/admin-categories.slice";
import type {
  CreateAdminCategoryPayload,
  UpdateAdminCategoryPayload,
} from "@/services/admin-service";

export const useAdminCategories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, isSubmitting, error } = useSelector(
    (state: RootState) => state.adminCategories,
  );

  useEffect(() => {
    dispatch(adminCategoriesActions.requested());
  }, [dispatch]);

  return {
    items,
    isLoading,
    isSubmitting,
    error,
    create: (payload: CreateAdminCategoryPayload) =>
      dispatch(adminCategoriesActions.createRequested(payload)),
    update: (id: number, payload: UpdateAdminCategoryPayload) =>
      dispatch(adminCategoriesActions.updateRequested({ id, payload })),
    remove: (id: number) =>
      dispatch(adminCategoriesActions.deleteRequested(id)),
  };
};
