import styles from "./highlights-editor.module.scss";

import type { ProductHighlight } from "@/services/seller-service";


type HighlightsEditorProps = {
  value: ProductHighlight[];
  onChange: (highlights: ProductHighlight[]) => void;
  disabled?: boolean;
};

export const HighlightsEditor = ({
  value,
  onChange,
  disabled,
}: HighlightsEditorProps) => {
  const updateRow = (index: number, patch: Partial<ProductHighlight>) => {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([...value, { label: "", value: "" }]);
  };

  return (
    <div className={styles.editor}>
      {value.length === 0 && (
        <p className={styles.empty}>Chưa có thông số nào.</p>
      )}

      {value.map((row, index) => (
        <div key={index} className={styles.row}>
          <input
            className={styles.label}
            value={row.label}
            placeholder="Tên thông số (vd: Màu sắc)"
            disabled={disabled}
            onChange={(e) => updateRow(index, { label: e.target.value })}
          />
          <input
            className={styles.value}
            value={row.value}
            placeholder="Giá trị (vd: Đen)"
            disabled={disabled}
            onChange={(e) => updateRow(index, { value: e.target.value })}
          />
          <button
            type="button"
            className={styles.removeBtn}
            disabled={disabled}
            onClick={() => removeRow(index)}
            aria-label="Xoá thông số"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        className={styles.addBtn}
        disabled={disabled}
        onClick={addRow}
      >
        + Thêm thông số
      </button>
    </div>
  );
};
