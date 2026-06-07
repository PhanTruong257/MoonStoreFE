import { Button, Empty, Select, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import {
  RETURN_REQUEST_STATUS,
  RETURN_REQUEST_STATUS_COLORS,
  RETURN_REQUEST_STATUS_LABELS,
  RETURN_REQUEST_TYPE_LABELS,
} from "@/const/return.const";
import { useSetSellerShell } from "@/features/seller/components/seller-shell-context";
import type { ReturnRequest } from "@/services/return-service";
import { useSellerReturns } from "./use-seller-returns";
import styles from "./seller-returns-page.module.scss";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: RETURN_REQUEST_STATUS.PENDING, label: "Chờ xử lý" },
  { value: RETURN_REQUEST_STATUS.APPROVED, label: "Đã duyệt" },
  { value: RETURN_REQUEST_STATUS.REJECTED, label: "Từ chối" },
  { value: RETURN_REQUEST_STATUS.ITEM_RECEIVED, label: "Đã nhận hàng về" },
  { value: RETURN_REQUEST_STATUS.COMPLETED, label: "Hoàn thành" },
];

export const SellerReturnsPage = () => {
  const {
    requests,
    loading,
    statusFilter,
    setStatusFilter,
    processingId,
    handleApprove,
    handleReject,
    handleConfirmReceived,
  } = useSellerReturns();

  useSetSellerShell({
    title: "Yêu cầu Đổi/Trả hàng",
    subtitle: "Quản lý các yêu cầu đổi/trả từ khách hàng.",
  });

  const columns: ColumnsType<ReturnRequest> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "Loại",
      dataIndex: "type",
      render: (type: string) => RETURN_REQUEST_TYPE_LABELS[type] ?? type,
    },
    {
      title: "Sản phẩm",
      render: (_: unknown, r) =>
        r.orderGroup?.items?.map((i) => `${i.productName} x${i.quantity}`).join(", ") ?? "-",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={RETURN_REQUEST_STATUS_COLORS[status]}>
          {RETURN_REQUEST_STATUS_LABELS[status] ?? status}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      render: (_: unknown, r) => (
        <div style={{ display: "flex", gap: 8 }}>
          {r.status === RETURN_REQUEST_STATUS.PENDING && (
            <>
              <Button
                type="primary"
                size="small"
                loading={processingId === r.id}
                onClick={() => handleApprove(r.id)}
              >
                Duyệt
              </Button>
              <Button
                danger
                size="small"
                loading={processingId === r.id}
                onClick={() => handleReject(r.id, "Không đủ điều kiện đổi/trả.")}
              >
                Từ chối
              </Button>
            </>
          )}
          {r.status === RETURN_REQUEST_STATUS.APPROVED && (
            <Button
              type="default"
              size="small"
              loading={processingId === r.id}
              onClick={() => handleConfirmReceived(r.id)}
            >
              Xác nhận đã nhận hàng
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={styles.filterRow}>
        <span>Lọc:</span>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
          style={{ width: 180 }}
        />
      </div>
      <Spin spinning={loading}>
        {requests.length === 0 && !loading ? (
          <Empty description="Chưa có yêu cầu đổi/trả nào." />
        ) : (
          <Table
            columns={columns}
            dataSource={requests}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Spin>
    </>
  );
};
