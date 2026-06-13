import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import {
  ADMIN_GRANT_ROLE_OPTIONS,
  ADMIN_USER_ROLE_OPTIONS,
  type AdminUserRoleFilter,
} from "@/const/admin.const";
import { USER_ROLE } from "@/const/role.const";
import { adminUsersActions } from "@/features/admin/admin-users/admin-users.slice";
import type { GrantUserRolePayload } from "@/services/admin-service";

export { ADMIN_USER_ROLE_OPTIONS };
export type RoleFilter = AdminUserRoleFilter;

export const useAdminUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, roleFilter, isLoading, isActing, actingId, error, grantRoleModal } =
    useSelector((state: RootState) => state.adminUsers);

  const [grantRole, setGrantRole] = useState<"seller" | "shipper">(USER_ROLE.SELLER);
  const [shopName, setShopName] = useState("");

  useEffect(() => {
    dispatch(adminUsersActions.requested());
  }, [dispatch]);

  const openGrantRoleModal = (userId: number) => {
    setGrantRole(USER_ROLE.SELLER);
    setShopName("");
    dispatch(adminUsersActions.grantRoleModalOpened(userId));
  };

  const closeGrantRoleModal = () => {
    dispatch(adminUsersActions.grantRoleModalClosed());
  };

  const submitGrantRole = () => {
    if (!grantRoleModal.userId) return;
    const payload: { userId: number } & GrantUserRolePayload =
      grantRole === USER_ROLE.SELLER
        ? { userId: grantRoleModal.userId, role: "seller", shopName }
        : { userId: grantRoleModal.userId, role: "shipper" };
    dispatch(adminUsersActions.grantRoleRequested(payload));
  };

  return {
    users,
    roleFilter,
    isLoading,
    actingId: isActing ? actingId : null,
    error,
    grantRoleModal,
    grantRole,
    shopName,
    grantRoleOptions: ADMIN_GRANT_ROLE_OPTIONS,
    isActing,
    setRoleFilter: (next: AdminUserRoleFilter) =>
      dispatch(adminUsersActions.roleFilterChanged(next)),
    handlePromote: (userId: number) =>
      dispatch(adminUsersActions.promoteRequested(userId)),
    handleDisable: (userId: number) =>
      dispatch(adminUsersActions.disableRequested(userId)),
    handleEnable: (userId: number) =>
      dispatch(adminUsersActions.enableRequested(userId)),
    openGrantRoleModal,
    closeGrantRoleModal,
    submitGrantRole,
    setGrantRole,
    setShopName,
  };
};
