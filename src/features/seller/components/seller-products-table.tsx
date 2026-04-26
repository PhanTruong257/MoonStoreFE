import type { SellerProductItem } from "../seller-storage";

import styles from "./seller-products-table.module.scss";

const statusLabel = (status: string) =>
  status === "active" ? "Live" : "Draft";

type SellerProductsTableProps = {
  items: SellerProductItem[];
};

export const SellerProductsTable = ({ items }: SellerProductsTableProps) => {
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        No products yet. Start by uploading a new product.
      </div>
    );
  }

  return (
    <div className={styles.table}>
      {items.map((item) => (
        <div key={item.id} className={styles.row}>
          <img src={item.imageUrl} alt={item.name} />
          <div>
            <strong>{item.name}</strong>
            <p>ID: {item.id}</p>
          </div>
          <span>${item.basePrice.toFixed(0)}</span>
          <span>{item.stock} units</span>
          <span
            className={`${styles.badge} ${
              item.status === "active" ? styles.badgeActive : ""
            }`}
          >
            {statusLabel(item.status)}
          </span>
        </div>
      ))}
    </div>
  );
};
