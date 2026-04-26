import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { adminBrandsActions } from "@/features/admin/admin-brands/admin-brands.slice";

export const useAdminBrands = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, isSubmitting, error } = useSelector(
    (state: RootState) => state.adminBrands,
  );

  useEffect(() => {
    dispatch(adminBrandsActions.requested());
  }, [dispatch]);

  return {
    items,
    isLoading,
    isSubmitting,
    error,
    create: (name: string) =>
      dispatch(adminBrandsActions.createRequested({ name })),
    update: (id: number, name: string) =>
      dispatch(adminBrandsActions.updateRequested({ id, name })),
    remove: (id: number) =>
      dispatch(adminBrandsActions.deleteRequested(id)),
  };
};
