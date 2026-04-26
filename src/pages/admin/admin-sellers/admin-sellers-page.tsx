import {
  Button,
  Empty,
  Input,
  Modal,
  Popconfirm,
  Segmented,
  Skeleton,
  Tag,
} from "antd";
import { useState } from "react";

import {
  ADMIN_SELLER_STATUS_OPTIONS,
  useAdminSellers,
} from "./use-admin-sellers";

import {
  SELLER_APPLICATION_STATUS,
  SELLER_APPLICATION_STATUS_COLORS,
} from "@/const/seller-status.const";
import { AdminShell } from "@/features/admin/components/admin-shell";
import styles from "@/styles/admin-list.module.scss";

export const AdminSellersPage = () => {
  const {
    sellers,
    statusFilter,
    isLoading,
    actingId,
    error,
    setStatusFilter,
    handleApprove,
    handleReject,
    handleDisable,
    handleEnable,
  } = useAdminSellers();

  const [rejectTarget, setRejectTarget] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  return (
    <AdminShell
      title="Seller applications"
      subtitle="Review pending applications and approve, reject or disable sellers."
      actions={
        <Segmented
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          options={ADMIN_SELLER_STATUS_OPTIONS.map((status) => ({
            label: status.toUpperCase(),
            value: status,
          }))}
        />
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : sellers.length === 0 ? (
        <Empty description="No applications" />
      ) : (
        <div className={styles.list}>
          {sellers.map((seller) => (
            <article key={seller.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <strong>{seller.shopName}</strong>
                  <Tag
                    color={
                      SELLER_APPLICATION_STATUS_COLORS[seller.status] ??
                      "default"
                    }
                  >
                    {seller.status.toUpperCase()}
                  </Tag>
                </div>
                <div className={styles.meta}>
                  {seller.user.fullName} · {seller.user.email} ·{" "}
                  {seller.user.phone}
                </div>
                {seller.description ? (
                  <p className={styles.description}>{seller.description}</p>
                ) : null}
                {seller.status === SELLER_APPLICATION_STATUS.REJECTED &&
                seller.rejectReason ? (
                  <p className={styles.rejectReason}>
                    Reject reason: {seller.rejectReason}
                  </p>
                ) : null}
              </div>
              <div className={styles.actions}>
                {seller.status === SELLER_APPLICATION_STATUS.PENDING ||
                seller.status === SELLER_APPLICATION_STATUS.REJECTED ? (
                  <Button
                    type="primary"
                    loading={actingId === seller.id}
                    onClick={() => handleApprove(seller.id)}
                  >
                    Approve
                  </Button>
                ) : null}
                {seller.status === SELLER_APPLICATION_STATUS.PENDING ||
                seller.status === SELLER_APPLICATION_STATUS.ACTIVE ? (
                  <Button
                    danger
                    disabled={actingId === seller.id}
                    onClick={() => {
                      setRejectTarget(seller.id);
                      setRejectReason("");
                    }}
                  >
                    Reject
                  </Button>
                ) : null}
                {seller.status === SELLER_APPLICATION_STATUS.ACTIVE ? (
                  <Popconfirm
                    title="Disable this seller? Their products will be hidden."
                    okText="Disable"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDisable(seller.id)}
                  >
                    <Button loading={actingId === seller.id}>Disable</Button>
                  </Popconfirm>
                ) : null}
                {seller.status === SELLER_APPLICATION_STATUS.DISABLED ? (
                  <Button
                    type="primary"
                    loading={actingId === seller.id}
                    onClick={() => handleEnable(seller.id)}
                  >
                    Enable
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={rejectTarget !== null}
        title="Reject application"
        okText="Reject"
        okButtonProps={{ danger: true }}
        onCancel={() => setRejectTarget(null)}
        onOk={() => {
          if (rejectTarget === null) {
            return;
          }
          handleReject(rejectTarget, rejectReason);
          setRejectTarget(null);
        }}
        confirmLoading={actingId === rejectTarget}
      >
        <p>Tell the seller why their application is rejected (optional).</p>
        <Input.TextArea
          value={rejectReason}
          onChange={(event) => setRejectReason(event.target.value)}
          rows={3}
          placeholder="E.g. Insufficient shop information"
        />
      </Modal>
    </AdminShell>
  );
};
