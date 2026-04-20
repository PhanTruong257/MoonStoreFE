import styles from "./seller-products-toolbar.module.scss";

type SellerProductsToolbarProps = {
  filter: string;
  onFilterChange: (value: string) => void;
};

export const SellerProductsToolbar = ({
  filter,
  onFilterChange,
}: SellerProductsToolbarProps) => (
  <div className={styles.headerRow}>
    <h2 className={styles.headerTitle}>Catalog</h2>
    <div className={styles.filterRow}>
      <label htmlFor="status-filter">Status</label>
      <select
        id="status-filter"
        className={styles.filterSelect}
        value={filter}
        onChange={(event) => onFilterChange(event.target.value)}
      >
        <option value="all">All</option>
        <option value="active">Live</option>
        <option value="draft">Draft</option>
      </select>
    </div>
  </div>
);
