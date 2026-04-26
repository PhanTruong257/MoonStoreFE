import { useState } from "react";
import {
  Button,
  Empty,
  Input,
  Modal,
  Segmented,
  Skeleton,
  Tag,
} from "antd";

import styles from "./admin-sellers-page.module.scss";
import {
  ADMIN_SELLER_STATUS_OPTIONS,
  useAdminSellers,
  type SellerStatusFilter,
} from "./use-admin-sellers";

import { AdminShell } from "@/features/admin/components/admin-shell";

const STATUS_TAG_COLOR: Record<string, string> = {
  pending: "gold",
  active: "green",
  rejected: "red",
  disabled: "default",
};

export const AdminSellersPage = () => {
  const {
    sellers,
    statusFilter,
    isLoading,
    error,
    actingId,
    setStatusFilter,
    handleApprove,
    handleReject,
  } = useAdminSellers();

  const [rejectTarget, setRejectTarget] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  return (
    <AdminShell
      title="Seller applications"
      subtitle="Review pending applications and approve or reject them."
      actions={
        <Segmented
          value={statusFilter}
          onChange={(value) =>
            setStatusFilter(value as SellerStatusFilter)
          }
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
                  <Tag color={STATUS_TAG_COLOR[seller.status] ?? "default"}>
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
                {seller.status === "rejected" && seller.rejectReason ? (
                  <p className={styles.rejectReason}>
                    Reject reason: {seller.rejectReason}
                  </p>
                ) : null}
              </div>
              <div className={styles.actions}>
                {seller.status !== "active" ? (
                  <Button
                    type="primary"
                    loading={actingId === seller.id}
                    onClick={() => {
                      void handleApprove(seller.id);
                    }}
                  >
                    Approve
                  </Button>
                ) : null}
                {seller.status !== "rejected" ? (
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
        onOk={async () => {
          if (rejectTarget === null) {
            return;
          }
          await handleReject(rejectTarget, rejectReason.trim());
          setRejectTarget(null);
        }}
        confirmLoading={actingId !== null && actingId === rejectTarget}
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
