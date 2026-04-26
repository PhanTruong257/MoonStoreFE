import { Link } from "react-router-dom";
import { Button, Select, Table } from "antd";

import styles from "./seller-products-page.module.scss";
import { useSellerProducts } from "./use-seller-products";

import {
  SELLER_PRODUCT_STATUS_FILTER_OPTIONS,
  SELLER_ROUTES,
} from "@/const/seller.const";
import { SellerShell } from "@/features/seller/components/seller-shell";
import type { SellerProductListItem } from "@/services/seller-service";

export const SellerProductsPage = () => {
  const {
    loading,
    error,
    products,
    filtered,
    statusFilter,
    setStatusFilter,
    columns,
  } = useSellerProducts();

  return (
    <SellerShell
      title="Manage products"
      subtitle="Review and keep every listing fresh for buyers."
      actions={
        <Link to={SELLER_ROUTES.productNew} className={styles.uploadLink}>
          + Upload product
        </Link>
      }
    >
      <div className={styles.toolbar}>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={SELLER_PRODUCT_STATUS_FILTER_OPTIONS}
          style={{ width: 180 }}
        />
        <span className={styles.productMeta}>
          Total: {filtered.length} / {products.length}
        </span>
        <div className={styles.toolbarSpacer}>
          <Link to={SELLER_ROUTES.productNew}>
            <Button type="primary">Upload product</Button>
          </Link>
        </div>
      </div>

      {error ? <p className={styles.errorText}>{error}</p> : null}

      <div className={styles.tableCard}>
        <Table<SellerProductListItem>
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <div className={styles.empty}>
                No products yet. Start by uploading a new product.
              </div>
            ),
          }}
        />
      </div>
    </SellerShell>
  );
};
