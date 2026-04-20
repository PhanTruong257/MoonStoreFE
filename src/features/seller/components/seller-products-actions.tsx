import { Link } from "react-router-dom";

import styles from "./seller-products-actions.module.scss";

export const SellerProductsActions = () => (
  <Link to="/seller/products/new" className={styles.primaryButton}>
    Upload product
  </Link>
);
