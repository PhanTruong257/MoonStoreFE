import { Button, Card, Empty, Popconfirm, Spin, Tag } from "antd";

import {
  SHIPMENT_STATUS,
  SHIPMENT_STATUS_COLORS,
  SHIPMENT_STATUS_LABELS,
} from "@/const/shipper.const";
import { useShipperShipments } from "./use-shipper-shipments";
import styles from "./shipper-shipments-page.module.scss";

export const ShipperShipmentsPage = () => {
  const { shipments, loading, updatingId, nextStatus, handleAdvance, handleFailed } =
    useShipperShipments();

  const nextLabels: Record<string, string> = {
    [SHIPMENT_STATUS.ASSIGNED]: "Xác nhận lấy hàng",
    [SHIPMENT_STATUS.PICKED_UP]: "Bắt đầu giao",
    [SHIPMENT_STATUS.IN_TRANSIT]: "Đã giao thành công",
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Đơn giao của tôi</h2>
      </div>

      <Spin spinning={loading}>
        {shipments.length === 0 && !loading && (
          <Empty description="Chưa có đơn hàng nào được giao cho bạn." />
        )}

        {shipments.map((s) => {
          const addr = s.orderGroup.order.shippingAddress as Record<string, string> | null;
          const canAdvance = !!nextStatus[s.status];
          const canFail =
            s.status === SHIPMENT_STATUS.PICKED_UP || s.status === SHIPMENT_STATUS.IN_TRANSIT;

          return (
            <Card
              key={s.id}
              className={styles.card}
              title={`Đơn #${s.orderGroup.order.id} — Lô giao #${s.id}`}
              extra={
                <Tag color={SHIPMENT_STATUS_COLORS[s.status]}>
                  {SHIPMENT_STATUS_LABELS[s.status] ?? s.status}
                </Tag>
              }
            >
              <p>
                <strong>Mã tracking:</strong> {s.trackingCode}
              </p>
              {addr && (
                <p className={styles.address}>
                  <strong>Địa chỉ:</strong>{" "}
                  {[addr.addressLine, addr.district, addr.city].filter(Boolean).join(", ")}
                </p>
              )}

              <div className={styles.actions}>
                {canAdvance && (
                  <Button
                    type="primary"
                    size="small"
                    loading={updatingId === s.id}
                    onClick={() => handleAdvance(s)}
                  >
                    {nextLabels[s.status] ?? "Tiến trạng thái"}
                  </Button>
                )}
                {canFail && (
                  <Popconfirm
                    title="Đánh dấu giao thất bại?"
                    description="Hành động này không thể hoàn tác."
                    okText="Xác nhận"
                    cancelText="Huỷ"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleFailed(s)}
                  >
                    <Button danger size="small" loading={updatingId === s.id}>
                      Giao thất bại
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </Card>
          );
        })}
      </Spin>
    </div>
  );
};
