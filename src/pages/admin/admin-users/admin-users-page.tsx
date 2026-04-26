import { Button, Empty, Popconfirm, Segmented, Skeleton, Tag } from "antd";

import { ADMIN_USER_ROLE_OPTIONS, useAdminUsers } from "./use-admin-users";

import {
  USER_ROLE,
  USER_ROLE_TAG_COLORS,
  USER_STATUS,
  USER_STATUS_TAG_COLORS,
} from "@/const/role.const";
import { AdminShell } from "@/features/admin/components/admin-shell";
import styles from "@/styles/admin-list.module.scss";

export const AdminUsersPage = () => {
  const {
    users,
    roleFilter,
    isLoading,
    actingId,
    error,
    setRoleFilter,
    handlePromote,
    handleDisable,
    handleEnable,
  } = useAdminUsers();

  return (
    <AdminShell
      title="Users"
      subtitle="Manage user roles and account status."
      actions={
        <Segmented
          value={roleFilter}
          onChange={(value) => setRoleFilter(value)}
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
                  <Tag color={USER_ROLE_TAG_COLORS[user.role] ?? "default"}>
                    {user.role.toUpperCase()}
                  </Tag>
                  <Tag color={USER_STATUS_TAG_COLORS[user.status] ?? "default"}>
                    {user.status.toUpperCase()}
                  </Tag>
                </div>
                <div className={styles.meta}>
                  #{user.id} · {user.email} · {user.phone}
                </div>
              </div>
              <div className={styles.actions}>
                {user.role !== USER_ROLE.ADMIN ? (
                  <Popconfirm
                    title="Promote this user to admin?"
                    okText="Promote"
                    onConfirm={() => handlePromote(user.id)}
                  >
                    <Button loading={actingId === user.id}>
                      Promote to admin
                    </Button>
                  </Popconfirm>
                ) : (
                  <span className={styles.adminBadge}>Already admin</span>
                )}
                {user.status === USER_STATUS.ACTIVE ? (
                  <Popconfirm
                    title="Disable this user? They will not be able to login."
                    okText="Disable"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDisable(user.id)}
                  >
                    <Button danger loading={actingId === user.id}>
                      Disable
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    type="primary"
                    loading={actingId === user.id}
                    onClick={() => handleEnable(user.id)}
                  >
                    Enable
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
};
