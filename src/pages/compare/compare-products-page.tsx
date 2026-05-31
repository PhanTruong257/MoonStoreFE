import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  clearCompareItems,
  getCompareItems,
  removeCompareItem,
  subscribeCompareUpdated,
  type CompareItem,
} from "@/app/utils/compare-store";
import { formatMoneyShort } from "@/app/utils/format";
import styles from "./compare-products-page.module.scss";

const ROWS = [
  { key: "image", label: "Hình ảnh" },
  { key: "price", label: "Giá" },
  { key: "rating", label: "Đánh giá" },
  { key: "actions", label: "" },
];

export const CompareProductsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CompareItem[]>(() => getCompareItems());

  useEffect(() => {
    const unsub = subscribeCompareUpdated(() => setItems(getCompareItems()));
    return unsub;
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => void navigate(-1)}
          >
            ← Quay lại
          </button>
          <h1 className={styles.title}>So sánh sản phẩm</h1>
          {items.length > 0 ? (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={clearCompareItems}
            >
              Xóa tất cả
            </button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Chưa có sản phẩm nào để so sánh.</p>
            <Link to="/home" className={styles.shopLink}>
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.labelCol}>Thuộc tính</th>
                  {items.map((item) => (
                    <th key={item.id} className={styles.productCol}>
                      <Link to={`/product/${item.id}`} className={styles.productName}>
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeCompareItem(item.id)}
                        aria-label={`Xóa ${item.name}`}
                      >
                        ×
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.key}>
                    <td className={styles.labelCol}>{row.label}</td>
                    {items.map((item) => (
                      <td key={item.id} className={styles.productCol}>
                        <CompareCell rowKey={row.key} item={item} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

const CompareCell = ({ rowKey, item }: { rowKey: string; item: CompareItem }) => {
  switch (rowKey) {
    case "image":
      return (
        <Link to={`/product/${item.id}`}>
          <img src={item.image} alt={item.name} className={styles.productImg} />
        </Link>
      );
    case "price":
      return <strong className={styles.price}>{formatMoneyShort(item.price)}</strong>;
    case "rating":
      return item.rating && item.rating > 0 ? (
        <span className={styles.rating}>
          {"★".repeat(Math.round(item.rating))}
          {"☆".repeat(Math.max(0, 5 - Math.round(item.rating)))}
          <small> ({item.rating.toFixed(1)})</small>
        </span>
      ) : (
        <span className={styles.noData}>—</span>
      );
    case "actions":
      return (
        <Link to={`/product/${item.id}`} className={styles.detailLink}>
          Xem chi tiết →
        </Link>
      );
    default:
      return null;
  }
};
