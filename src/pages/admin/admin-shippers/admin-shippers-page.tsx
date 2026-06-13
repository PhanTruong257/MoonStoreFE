import { Button, Input, Modal, Popconfirm, Segmented, Skeleton, Tag } from "antd";
import { useState } from "react";

import { SHIPPER_STATUS_COLORS, SHIPPER_STATUS_LABELS } from "@/const/shipper.const";
import { AdminShell } from "@/features/admin/components/admin-shell";
import styles from "@/styles/admin-list.module.scss";
import {
  ADMIN_SHIPPER_STATUS_OPTIONS,
  useAdminShippers,
} from "./use-admin-shippers";

export const AdminShippersPage = () => {
  const {
    shippers,
    statusFilter,
    setStatusFilter,
    loading,
    actingId,
    handleApprove,
    handleReject,
    handleDisable,
    handleEnable,
  } = useAdminShippers();

  const [rejectTarget, setRejectTarget] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  return (
    <AdminShell
      title="Shipper"
      subtitle="Xét duyệt và quản lý tài khoản shipper."
      actions={
        <Segmented
          options={ADMIN_SHIPPER_STATUS_OPTIONS}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as string)}
        />
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className={styles.list}>
          {shippers.length === 0 && (
            <p className={styles.empty}>Không có shipper nào phù hợp.</p>
          )}

          {shippers.map((s) => (
            <div key={s.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.name}>{s.user.fullName}</span>
                  <span className={styles.meta}>
                    {s.user.email} · {s.user.phone}
                  </span>
                  {s.rejectReason && (
                    <span className={styles.meta} style={{ color: "#ff4d4f" }}>
                      Lý do từ chối: {s.rejectReason}
                    </span>
                  )}
                </div>
                <Tag color={SHIPPER_STATUS_COLORS[s.status]}>
                  {SHIPPER_STATUS_LABELS[s.status] ?? s.status}
                </Tag>
              </div>

              <div className={styles.actions}>
                {s.status === "pending" && (
                  <>
                    <Popconfirm
                      title="Xác nhận duyệt shipper này?"
                      onConfirm={() => handleApprove(s.id)}
                      okText="Duyệt"
                      cancelText="Huỷ"
                    >
                      <Button
                        type="primary"
                        size="small"
                        loading={actingId === s.id}
                      >
                        Duyệt
                      </Button>
                    </Popconfirm>
                    <Button
                      danger
                      size="small"
                      loading={actingId === s.id}
                      onClick={() => {
                        setRejectTarget(s.id);
                        setRejectReason("");
                      }}
                    >
                      Từ chối
                    </Button>
                  </>
                )}
                {s.status === "active" && (
                  <Popconfirm
                    title="Vô hiệu hoá shipper này?"
                    onConfirm={() => handleDisable(s.id)}
                    okText="Vô hiệu"
                    cancelText="Huỷ"
                  >
                    <Button danger size="small" loading={actingId === s.id}>
                      Vô hiệu
                    </Button>
                  </Popconfirm>
                )}
                {s.status === "disabled" && (
                  <Popconfirm
                    title="Kích hoạt lại shipper này?"
                    onConfirm={() => handleEnable(s.id)}
                    okText="Kích hoạt"
                    cancelText="Huỷ"
                  >
                    <Button type="default" size="small" loading={actingId === s.id}>
                      Kích hoạt
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={rejectTarget !== null}
        title="Lý do từ chối"
        onOk={() => {
          if (rejectTarget !== null) {
            handleReject(rejectTarget, rejectReason);
            setRejectTarget(null);
          }
        }}
        onCancel={() => setRejectTarget(null)}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true }}
      >
        <Input.TextArea
          rows={3}
          placeholder="Nhập lý do từ chối..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </AdminShell>
  );
};
