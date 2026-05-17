import { Button, Skeleton, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { AdminShell } from "@/features/admin/components/admin-shell";
import { formatSellerCurrency, formatSellerDateTime } from "@/const/seller.const";
import type { AdminRefundRequest } from "@/services/admin-service";
import styles from "./admin-refunds-page.module.scss";
import { useAdminRefunds } from "./use-admin-refunds";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "gold",
  APPROVED: "green",
  REJECTED: "red",
};

export const AdminRefundsPage = () => {
  const { items, isLoading, error, isProcessing, approve, reject } = useAdminRefunds();

  const columns: ColumnsType<AdminRefundRequest> = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => formatSellerDateTime(v),
    },
    {
      title: "Order",
      dataIndex: "orderId",
      key: "orderId",
      render: (v) => `#${v}`,
    },
    {
      title: "User",
      key: "user",
      render: (_, r) => `${r.user.fullName} (${r.user.email})`,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (v) => formatSellerCurrency(v),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: string) => <Tag color={STATUS_COLORS[v] ?? "default"}>{v}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) =>
        r.status === "PENDING" ? (
          <Space>
            <Button
              size="small"
              type="primary"
              loading={isProcessing}
              onClick={() => approve(r.id)}
            >
              Approve
            </Button>
            <Button
              size="small"
              danger
              loading={isProcessing}
              onClick={() => reject(r.id)}
            >
              Reject
            </Button>
          </Space>
        ) : null,
    },
  ];

  return (
    <AdminShell title="Refund Requests" subtitle="Review and process customer refund requests.">
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <Table columns={columns} dataSource={items} rowKey="id" size="small" />
      )}
    </AdminShell>
  );
};
