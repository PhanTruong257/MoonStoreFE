import { Button, Input, Select, Table } from "antd";
import { Link } from "react-router-dom";

import styles from "./seller-products-page.module.scss";
import { useSellerProducts } from "./use-seller-products";

import {
  SELLER_PRODUCT_STATUS_FILTER_OPTIONS,
  SELLER_ROUTES,
} from "@/const/seller.const";
import { UI_TEXT } from "@/const/ui-text";
import { useSetSellerShell } from "@/features/seller/components/seller-shell-context";
import type { SellerProductListItem } from "@/services/seller-service";

const t = UI_TEXT.seller.products;

export const SellerProductsPage = () => {
  const {
    loading,
    error,
    products,
    filtered,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    columns,
  } = useSellerProducts();

  useSetSellerShell({
    title: t.title,
    subtitle: t.subtitle,
    actions: (
      <Link to={SELLER_ROUTES.productNew} className={styles.uploadLink}>
        {t.uploadProductBtn}
      </Link>
    ),
  });

  return (
    <>
      <div className={styles.toolbar}>
        <Input
          placeholder="Tìm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select
          placeholder="Danh mục"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={[
            { label: "Tất cả danh mục", value: null },
            ...categories.map((cat) => ({ label: cat, value: cat })),
          ]}
          style={{ width: 180 }}
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={SELLER_PRODUCT_STATUS_FILTER_OPTIONS}
          style={{ width: 180 }}
        />
        <span className={styles.productMeta}>
          {t.totalMeta(filtered.length, products.length)}
        </span>
        <div className={styles.toolbarSpacer}>
          <Link to={SELLER_ROUTES.productNew}>
            <Button type="primary">{t.uploadProductBtn}</Button>
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
              <div className={styles.empty}>{t.emptyText}</div>
            ),
          }}
        />
      </div>
    </>
  );
};
