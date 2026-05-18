import { Button, Skeleton, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { AdminShell } from "@/features/admin/components/admin-shell";
import { formatSellerCurrency, formatSellerDateTime } from "@/const/seller.const";
import { UI_TEXT } from "@/const/ui-text";
import type { AdminWithdrawal } from "@/services/admin-service";
import styles from "./admin-withdrawals-page.module.scss";
import { useAdminWithdrawals } from "./use-admin-withdrawals";

const t = UI_TEXT.admin.withdrawals;
const tbl = UI_TEXT.admin.table;

const STATUS_COLORS: Record<string, string> = {
  PENDING: "gold",
  APPROVED: "green",
  REJECTED: "red",
};

export const AdminWithdrawalsPage = () => {
  const { items, isLoading, error, isProcessing, approve, reject } = useAdminWithdrawals();

  const columns: ColumnsType<AdminWithdrawal> = [
    {
      title: tbl.date,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => formatSellerDateTime(v),
    },
    {
      title: tbl.shop,
      key: "shop",
      render: (_, r) => r.seller.shopName,
    },
    {
      title: tbl.amount,
      dataIndex: "amount",
      key: "amount",
      render: (v) => formatSellerCurrency(v),
    },
    { title: tbl.bank, dataIndex: "bankName", key: "bankName" },
    { title: tbl.account, dataIndex: "bankAccount", key: "bankAccount" },
    { title: tbl.holder, dataIndex: "bankHolder", key: "bankHolder" },
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
