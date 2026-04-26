import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import {
  adminUsersActions,
  type RoleFilter,
} from "@/features/admin/admin-users/admin-users.slice";

export const ADMIN_USER_ROLE_OPTIONS: RoleFilter[] = [
  "all",
  "user",
  "seller",
  "admin",
];

export type { RoleFilter };

export const useAdminUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, roleFilter, isLoading, isActing, actingId, error } =
    useSelector((state: RootState) => state.adminUsers);

  useEffect(() => {
    dispatch(adminUsersActions.requested());
  }, [dispatch]);

  return {
    users,
    roleFilter,
    isLoading,
    actingId: isActing ? actingId : null,
    error,
    setRoleFilter: (next: RoleFilter) =>
      dispatch(adminUsersActions.roleFilterChanged(next)),
    handlePromote: (userId: number) =>
      dispatch(adminUsersActions.promoteRequested(userId)),
    handleDisable: (userId: number) =>
      dispatch(adminUsersActions.disableRequested(userId)),
    handleEnable: (userId: number) =>
      dispatch(adminUsersActions.enableRequested(userId)),
  };
};
