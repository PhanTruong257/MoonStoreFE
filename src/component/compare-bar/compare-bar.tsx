import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { resolveImageUrl } from "@/app/utils/image-url";

import {
  clearCompareItems,
  getCompareItems,
  removeCompareItem,
  subscribeCompareUpdated,
  type CompareItem,
} from "@/app/utils/compare-store";
import { formatMoneyShort } from "@/app/utils/format";
import styles from "./compare-bar.module.scss";

export const CompareBar = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CompareItem[]>(() => getCompareItems());

  useEffect(() => {
    const unsub = subscribeCompareUpdated(() => setItems(getCompareItems()));
    return unsub;
  }, []);

  if (items.length < 1) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.slots}>
          {items.map((item) => (
            <div key={item.id} className={styles.slot}>
              <button
                type="button"
                className={styles.remove}
                onClick={() => removeCompareItem(item.id)}
                aria-label={`Xóa ${item.name}`}
              >
                ×
              </button>
              <img src={resolveImageUrl(item.image)} alt={item.name} className={styles.thumb} />
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemPrice}>{formatMoneyShort(item.price)}</span>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 2 - items.length) }, (_, i) => (
            <div key={`empty-${i}`} className={`${styles.slot} ${styles.slotEmpty}`}>
              <span>+ Thêm sản phẩm</span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.compareBtn}
            disabled={items.length < 2}
            onClick={() => void navigate("/so-sanh")}
          >
            So sánh ({items.length})
          </button>
          <button
            type="button"
            className={styles.clearBtn}
            onClick={clearCompareItems}
          >
            Xóa tất cả
          </button>
        </div>
      </div>
    </div>
  );
};
