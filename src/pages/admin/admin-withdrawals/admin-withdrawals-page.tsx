import { Button, Skeleton, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { AdminShell } from "@/features/admin/components/admin-shell";
import { formatSellerCurrency, formatSellerDateTime } from "@/const/seller.const";
import type { AdminWithdrawal } from "@/services/admin-service";
import styles from "./admin-withdrawals-page.module.scss";
import { useAdminWithdrawals } from "./use-admin-withdrawals";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "gold",
  APPROVED: "green",
  REJECTED: "red",
};

export const AdminWithdrawalsPage = () => {
  const { items, isLoading, error, isProcessing, approve, reject } = useAdminWithdrawals();

  const columns: ColumnsType<AdminWithdrawal> = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => formatSellerDateTime(v),
    },
    {
      title: "Shop",
      key: "shop",
      render: (_, r) => r.seller.shopName,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (v) => formatSellerCurrency(v),
    },
    { title: "Bank", dataIndex: "bankName", key: "bankName" },
    { title: "Account", dataIndex: "bankAccount", key: "bankAccount" },
    { title: "Holder", dataIndex: "bankHolder", key: "bankHolder" },
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
    <AdminShell title="Withdrawal Requests" subtitle="Review and process seller withdrawal requests.">
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
