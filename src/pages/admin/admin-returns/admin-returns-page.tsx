import { Button, Empty, Segmented, Skeleton, Tag } from "antd";

import {
  RETURN_REQUEST_STATUS,
  RETURN_REQUEST_STATUS_COLORS,
  RETURN_REQUEST_STATUS_LABELS,
  RETURN_REQUEST_TYPE_LABELS,
} from "@/const/return.const";
import { AdminShell } from "@/features/admin/components/admin-shell";
import styles from "@/styles/admin-list.module.scss";
import { useAdminReturns } from "./use-admin-returns";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: RETURN_REQUEST_STATUS.PENDING, label: "Chờ xử lý" },
  { value: RETURN_REQUEST_STATUS.APPROVED, label: "Đã duyệt" },
  { value: RETURN_REQUEST_STATUS.REJECTED, label: "Từ chối" },
  { value: RETURN_REQUEST_STATUS.ITEM_RECEIVED, label: "Đã nhận hàng về" },
  { value: RETURN_REQUEST_STATUS.COMPLETED, label: "Hoàn thành" },
];

export const AdminReturnsPage = () => {
  const { requests, statusFilter, setStatusFilter, loading, processingId, handleComplete } =
    useAdminReturns();

  return (
    <AdminShell
      title="Yêu cầu Đổi/Trả"
      subtitle="Giám sát và hoàn tất các yêu cầu đổi/trả từ người mua."
      actions={
        <Segmented
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as string)}
        />
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : requests.length === 0 ? (
        <Empty description="Không có yêu cầu nào." />
      ) : (
        <div className={styles.list}>
          {requests.map((r) => (
            <div key={r.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.name}>
                    #{r.id} — {RETURN_REQUEST_TYPE_LABELS[r.type] ?? r.type}
                  </span>
                  <span className={styles.meta}>
                    Người mua: {r.user?.fullName} ({r.user?.email})
                  </span>
                  <span className={styles.meta}>
                    Shop: {r.orderGroup?.seller?.shopName}
                  </span>
                  <span className={styles.meta}>Lý do: {r.reason}</span>
                  {r.note && (
                    <span className={styles.meta}>Ghi chú: {r.note}</span>
                  )}
                </div>
                <Tag color={RETURN_REQUEST_STATUS_COLORS[r.status]}>
                  {RETURN_REQUEST_STATUS_LABELS[r.status] ?? r.status}
                </Tag>
              </div>

              {r.status === RETURN_REQUEST_STATUS.ITEM_RECEIVED && (
                <div className={styles.actions}>
                  <Button
                    type="primary"
                    size="small"
                    loading={processingId === r.id}
                    onClick={() => handleComplete(r.id)}
                  >
                    Hoàn tất (xác nhận hoàn tiền/đổi hàng)
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
};
