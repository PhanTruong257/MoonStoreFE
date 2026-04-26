import { useEffect, useState } from "react";
import { message } from "antd";

import {
  fetchAdminUsers,
  promoteUserToAdmin,
} from "@/services/admin-service";
import type { AdminUser } from "@/services/admin-service";

const ROLE_OPTIONS = ["all", "user", "seller", "admin"] as const;
export type RoleFilter = (typeof ROLE_OPTIONS)[number];

export const ADMIN_USER_ROLE_OPTIONS: RoleFilter[] = [...ROLE_OPTIONS];

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<number | null>(null);

  const load = async (role: RoleFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminUsers(role === "all" ? undefined : role);
      setUsers(data);
    } catch {
      setError("Unable to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load(roleFilter);
  }, [roleFilter]);

  const handlePromote = async (userId: number) => {
    setActingId(userId);
    try {
      await promoteUserToAdmin(userId);
      void message.success("User promoted to admin.");
      await load(roleFilter);
    } catch {
      void message.error("Unable to promote user.");
    } finally {
      setActingId(null);
    }
  };

  return {
    users,
    roleFilter,
    isLoading,
    error,
    actingId,
    setRoleFilter,
    handlePromote,
  };
};
