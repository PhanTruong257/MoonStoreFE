import { Button, Skeleton, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { AdminShell } from "@/features/admin/components/admin-shell";
import { formatSellerCurrency, formatSellerDateTime } from "@/const/seller.const";
import { UI_TEXT } from "@/const/ui-text";
import type { AdminRefundRequest } from "@/services/admin-service";
import styles from "./admin-refunds-page.module.scss";
import { useAdminRefunds } from "./use-admin-refunds";

const t = UI_TEXT.admin.refunds;
const tbl = UI_TEXT.admin.table;

const STATUS_COLORS: Record<string, string> = {
  PENDING: "gold",
  APPROVED: "green",
  REJECTED: "red",
};

export const AdminRefundsPage = () => {
  const { items, isLoading, error, isProcessing, approve, reject } = useAdminRefunds();

  const columns: ColumnsType<AdminRefundRequest> = [
    {
      title: tbl.date,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => formatSellerDateTime(v),
    },
    {
      title: tbl.order,
      dataIndex: "orderId",
      key: "orderId",
      render: (v) => `#${v}`,
    },
    {
      title: tbl.user,
      key: "user",
      render: (_, r) => `${r.user.fullName} (${r.user.email})`,
    },
    {
      title: tbl.amount,
      dataIndex: "amount",
      key: "amount",
      render: (v) => formatSellerCurrency(v),
    },
    {
      title: tbl.reason,
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: tbl.status,
      dataIndex: "status",
      key: "status",
      render: (v: string) => <Tag color={STATUS_COLORS[v] ?? "default"}>{v}</Tag>,
    },
    {
      title: tbl.actions,
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
              {t.approveBtn}
            </Button>
            <Button
              size="small"
              danger
              loading={isProcessing}
              onClick={() => reject(r.id)}
            >
              {t.rejectBtn}
            </Button>
          </Space>
        ) : null,
    },
  ];

  return (
    <AdminShell title={t.title} subtitle={t.subtitle}>
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
