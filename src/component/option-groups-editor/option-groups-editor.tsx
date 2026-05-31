import type { SellerProductOptionGroupInput } from "@/services/seller-service";
import styles from "./option-groups-editor.module.scss";

type Props = {
  value: SellerProductOptionGroupInput[];
  onChange: (groups: SellerProductOptionGroupInput[]) => void;
  disabled?: boolean;
};

const emptyGroup = (): SellerProductOptionGroupInput => ({
  name: "",
  required: false,
  multiSelect: false,
  options: [{ name: "", priceDelta: 0 }],
});

export const OptionGroupsEditor = ({ value, onChange, disabled }: Props) => {
  const addGroup = () => onChange([...value, emptyGroup()]);

  const removeGroup = (groupIndex: number) =>
    onChange(value.filter((_, i) => i !== groupIndex));

  const updateGroup = (
    groupIndex: number,
    patch: Partial<SellerProductOptionGroupInput>,
  ) =>
    onChange(
      value.map((g, i) => (i === groupIndex ? { ...g, ...patch } : g)),
    );

  const addOption = (groupIndex: number) =>
    updateGroup(groupIndex, {
      options: [...value[groupIndex].options, { name: "", priceDelta: 0 }],
    });

  const removeOption = (groupIndex: number, optionIndex: number) =>
    updateGroup(groupIndex, {
      options: value[groupIndex].options.filter((_, i) => i !== optionIndex),
    });

  const updateOption = (
    groupIndex: number,
    optionIndex: number,
    field: "name" | "priceDelta",
    fieldValue: string | number,
  ) =>
    updateGroup(groupIndex, {
      options: value[groupIndex].options.map((o, i) =>
        i === optionIndex ? { ...o, [field]: fieldValue } : o,
      ),
    });

  return (
    <div className={styles.editor}>
      {value.map((group, gi) => (
        <div key={gi} className={styles.groupCard}>
          <div className={styles.groupHeader}>
            <input
              className={styles.groupNameInput}
              value={group.name}
              onChange={(e) => updateGroup(gi, { name: e.target.value })}
              placeholder="Màu sắc, Kích cỡ..."
              disabled={disabled}
            />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeGroup(gi)}
              disabled={disabled}
            >
              Xoá nhóm
            </button>
          </div>

          <div className={styles.groupFlags}>
            <label className={styles.flagLabel}>
              <input
                type="checkbox"
                checked={group.required ?? false}
                onChange={(e) => updateGroup(gi, { required: e.target.checked })}
                disabled={disabled}
              />
              Bắt buộc
            </label>
            <label className={styles.flagLabel}>
              <input
                type="checkbox"
                checked={group.multiSelect ?? false}
                onChange={(e) =>
                  updateGroup(gi, { multiSelect: e.target.checked })
                }
                disabled={disabled}
              />
              Chọn nhiều
            </label>
          </div>

          <div className={styles.optionList}>
            {group.options.map((option, oi) => (
              <div key={oi} className={styles.optionRow}>
                <input
                  className={styles.optionNameInput}
                  value={option.name}
                  onChange={(e) => updateOption(gi, oi, "name", e.target.value)}
                  placeholder="Đỏ, Size M..."
                  disabled={disabled}
                />
                <input
                  className={styles.optionPriceInput}
                  type="number"
                  value={option.priceDelta ?? 0}
                  onChange={(e) =>
                    updateOption(gi, oi, "priceDelta", Number(e.target.value))
                  }
                  placeholder="Giá thêm"
                  disabled={disabled}
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeOption(gi, oi)}
                  disabled={disabled}
                >
                  Xoá
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addOptionBtn}
              onClick={() => addOption(gi)}
              disabled={disabled}
            >
              + Thêm tuỳ chọn
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className={styles.addGroupBtn}
        onClick={addGroup}
        disabled={disabled}
      >
        + Thêm nhóm tuỳ chọn
      </button>
    </div>
  );
};
