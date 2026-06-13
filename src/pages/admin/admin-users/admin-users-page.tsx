import { Button, Empty, Input, Modal, Popconfirm, Radio, Segmented, Skeleton, Tag } from "antd";

import { ADMIN_USER_ROLE_OPTIONS, useAdminUsers } from "./use-admin-users";

import {
  USER_ROLE,
  USER_ROLE_TAG_COLORS,
  USER_STATUS,
  USER_STATUS_TAG_COLORS,
} from "@/const/role.const";
import { UI_TEXT } from "@/const/ui-text";
import { AdminShell } from "@/features/admin/components/admin-shell";
import styles from "@/styles/admin-list.module.scss";

const t = UI_TEXT.admin.users;

export const AdminUsersPage = () => {
  const {
    users,
    roleFilter,
    isLoading,
    actingId,
    error,
    grantRoleModal,
    grantRole,
    shopName,
    grantRoleOptions,
    isActing,
    setRoleFilter,
    handlePromote,
    handleDisable,
    handleEnable,
    openGrantRoleModal,
    closeGrantRoleModal,
    submitGrantRole,
    setGrantRole,
    setShopName,
  } = useAdminUsers();

  return (
    <AdminShell
      title={t.title}
      subtitle={t.subtitle}
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
        <Empty description={t.noUsers} />
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
                {user.role === USER_ROLE.USER && (
                  <Button onClick={() => openGrantRoleModal(user.id)}>
                    Cấp quyền
                  </Button>
                )}
                {user.role !== USER_ROLE.ADMIN ? (
                  <Popconfirm
                    title={t.promoteTitle}
                    okText={t.promoteOk}
                    onConfirm={() => handlePromote(user.id)}
                  >
                    <Button loading={actingId === user.id}>
                      {t.promoteBtn}
                    </Button>
                  </Popconfirm>
                ) : (
                  <span className={styles.adminBadge}>{t.alreadyAdmin}</span>
                )}
                {user.status === USER_STATUS.ACTIVE ? (
                  <Popconfirm
                    title={t.disableTitle}
                    okText={t.disableOk}
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDisable(user.id)}
                  >
                    <Button danger loading={actingId === user.id}>
                      {t.disableBtn}
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    type="primary"
                    loading={actingId === user.id}
                    onClick={() => handleEnable(user.id)}
                  >
                    {t.enableBtn}
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        title="Cấp quyền cho người dùng"
        open={grantRoleModal.open}
        onCancel={closeGrantRoleModal}
        onOk={submitGrantRole}
        okText="Xác nhận"
        cancelText="Huỷ"
        confirmLoading={isActing}
        okButtonProps={{
          disabled: grantRole === USER_ROLE.SELLER && !shopName.trim(),
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Loại quyền</div>
            <Radio.Group
              value={grantRole}
              onChange={(e) => setGrantRole(e.target.value)}
              options={grantRoleOptions.map((o) => ({
                label: o.label,
                value: o.value,
              }))}
              optionType="button"
              buttonStyle="solid"
            />
          </div>

          {grantRole === USER_ROLE.SELLER && (
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                Tên shop <span style={{ color: "red" }}>*</span>
              </div>
              <Input
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Nhập tên shop"
                maxLength={100}
              />
            </div>
          )}
        </div>
      </Modal>
    </AdminShell>
  );
};
