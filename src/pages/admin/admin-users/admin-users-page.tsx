import { Button, Empty, Popconfirm, Segmented, Skeleton, Tag } from "antd";

import styles from "./admin-users-page.module.scss";
import {
  ADMIN_USER_ROLE_OPTIONS,
  useAdminUsers,
  type RoleFilter,
} from "./use-admin-users";

import { AdminShell } from "@/features/admin/components/admin-shell";

const ROLE_TAG_COLOR: Record<string, string> = {
  user: "default",
  seller: "blue",
  admin: "purple",
};

export const AdminUsersPage = () => {
  const {
    users,
    roleFilter,
    isLoading,
    error,
    actingId,
    setRoleFilter,
    handlePromote,
  } = useAdminUsers();

  return (
    <AdminShell
      title="Users"
      subtitle="Manage user roles. Promote users to admin if needed."
      actions={
        <Segmented
          value={roleFilter}
          onChange={(value) => setRoleFilter(value as RoleFilter)}
          options={ADMIN_USER_ROLE_OPTIONS.map((role) => ({
            label: role.toUpperCase(),
            value: role,
          }))}
        />
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : users.length === 0 ? (
        <Empty description="No users" />
      ) : (
        <div className={styles.list}>
          {users.map((user) => (
            <article key={user.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <strong>{user.fullName}</strong>
                  <Tag color={ROLE_TAG_COLOR[user.role] ?? "default"}>
                    {user.role.toUpperCase()}
                  </Tag>
                </div>
                <div className={styles.meta}>
                  #{user.id} · {user.email} · {user.phone}
                </div>
              </div>
              <div className={styles.actions}>
                {user.role !== "admin" ? (
                  <Popconfirm
                    title="Promote this user to admin?"
                    okText="Promote"
                    onConfirm={() => {
                      void handlePromote(user.id);
                    }}
                  >
                    <Button loading={actingId === user.id}>
                      Promote to admin
                    </Button>
                  </Popconfirm>
                ) : (
                  <span className={styles.adminBadge}>Already admin</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
};
