import { Modal, Segmented, Select, Skeleton, Tag } from "antd";
import { SharedButton } from "@/component/shared-button/shared-button";
import { AdminShell } from "@/features/admin/components/admin-shell";
import styles from "@/styles/admin-list.module.scss";
import {
  SHIPMENT_STATUS_COLORS,
  SHIPMENT_STATUS_LABELS,
  SHIPMENT_STATUS_OPTIONS,
  useAdminShipments,
} from "./use-admin-shipments";

export const AdminShipmentsPage = () => {
  const {
    shipments,
    statusFilter,
    setStatusFilter,
    loading,
    assignTarget,
    setAssignTarget,
    activeShippers,
    selectedShipperId,
    setSelectedShipperId,
    assigning,
    openAssignModal,
    handleAssign,
  } = useAdminShipments();

  return (
    <AdminShell
      title="Giao hàng"
      subtitle="Quản lý và phân công đơn giao hàng cho shipper."
      actions={
        <Segmented
          options={SHIPMENT_STATUS_OPTIONS}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as string)}
        />
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className={styles.list}>
          {shipments.length === 0 && (
            <p className={styles.empty}>Không có đơn giao hàng nào.</p>
          )}

          {shipments.map((s) => (
            <div key={s.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.name}>
                    Nhóm đơn #{s.orderGroup.id} · Đơn hàng #{s.orderGroup.orderId}
                  </span>
                  <span className={styles.meta}>
                    {s.orderGroup.seller.shopName}
                  </span>
                  <span className={styles.meta}>
                    Sản phẩm:{" "}
                    {s.orderGroup.items
                      .map((i) => `${i.productName} x${i.quantity}`)
                      .join(", ")}
                  </span>
                  {s.shipper ? (
                    <span className={styles.meta}>
                      Shipper: {s.shipper.user.fullName} · {s.shipper.user.phone}
                    </span>
                  ) : null}
                </div>
                <Tag color={SHIPMENT_STATUS_COLORS[s.status]}>
                  {SHIPMENT_STATUS_LABELS[s.status] ?? s.status}
                </Tag>
              </div>

              <div className={styles.actions}>
                {s.status === "PENDING" && (
                  <SharedButton
                    variant="primary"
                    label="Phân công shipper"
                    onClick={() => openAssignModal(s.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={assignTarget !== null}
        title="Phân công shipper"
        onOk={handleAssign}
        onCancel={() => setAssignTarget(null)}
        okText="Phân công"
        okButtonProps={{ loading: assigning, disabled: selectedShipperId === null }}
        cancelText="Huỷ"
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn shipper..."
          value={selectedShipperId ?? undefined}
          onChange={(v) => setSelectedShipperId(v as number)}
          options={activeShippers.map((sh) => ({
            value: sh.id,
            label: `${sh.user.fullName} · ${sh.user.phone}`,
          }))}
        />
      </Modal>
    </AdminShell>
  );
};
