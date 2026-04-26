import { Select, Table } from "antd";

import styles from "./seller-orders-page.module.scss";
import { useSellerOrders } from "./use-seller-orders";

import { SellerShell } from "@/features/seller/components/seller-shell";
import { SELLER_ORDER_STATUS_FILTER_OPTIONS } from "@/const/seller.const";
import type { SellerOrderGroup } from "@/services/seller-service";

export const SellerOrdersPage = () => {
  const {
    loading,
    error,
    groups,
    filtered,
    statusFilter,
    setStatusFilter,
    columns,
  } = useSellerOrders();

  return (
    <SellerShell
      title="Orders"
      subtitle="Manage every order your shop receives."
    >
      <div className={styles.toolbar}>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={SELLER_ORDER_STATUS_FILTER_OPTIONS}
          style={{ width: 180 }}
        />
        <span className={styles.productMeta}>
          Total: {filtered.length} / {groups.length}
        </span>
      </div>

      {error ? <p className={styles.errorText}>{error}</p> : null}

      <div className={styles.tableCard}>
        <Table<SellerOrderGroup>
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: <div className={styles.empty}>No orders yet.</div>,
          }}
        />
      </div>
    </SellerShell>
  );
};
