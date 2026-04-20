import { Link } from "react-router-dom";

import styles from "./seller-hub-page.module.scss";
import { SellerShell } from "@/features/seller/components/seller-shell";
import { loadSellerProducts } from "@/features/seller/seller-storage";

import { getStoredUser } from "@/features/auth/auth-storage";

export const SellerHubPage = () => {
  const user = getStoredUser();
  const products = user ? loadSellerProducts(user.id) : [];

  const activeProducts = products.filter((item) => item.status === "active");
  const draftProducts = products.filter((item) => item.status !== "active");

  return (
    <SellerShell
      title="Your seller cockpit"
      subtitle="Track product performance and launch new drops in minutes."
      actions={
        <>
          <Link to="/seller/products/new" className={styles.quickButton}>
            Upload product
          </Link>
          <Link to="/seller/products" className={styles.quickButton}>
            Manage products
          </Link>
        </>
      }
    >
      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>Total products</span>
          <strong className={styles.statValue}>{products.length}</strong>
        </article>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>Live listings</span>
          <strong className={styles.statValue}>{activeProducts.length}</strong>
        </article>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>Drafts</span>
          <strong className={styles.statValue}>{draftProducts.length}</strong>
        </article>
      </div>

      <div className={styles.grid}>
        <section className={styles.quickAction}>
          <h3 className={styles.panelTitle}>Next best move</h3>
          <p className={styles.panelDesc}>
            Launch new items, keep stock updated, and monitor what is trending.
          </p>
          <Link to="/seller/products/new" className={styles.quickButton}>
            Create new listing
          </Link>
          <Link
            to="/seller/products"
            className={`${styles.quickButton} ${styles.quickSecondary}`}
          >
            Review catalog
          </Link>
        </section>

        <section className={styles.quickAction}>
          <h3 className={styles.panelTitle}>Seller checklist</h3>
          <p className={styles.panelDesc}>
            Add fresh photos, set competitive pricing, and keep the product copy
            sharp.
          </p>
          <ul>
            <li>Upload at least 3 high-res images</li>
            <li>Set stock and price that can ship today</li>
            <li>Use a short, memorable SKU code</li>
          </ul>
        </section>
      </div>
    </SellerShell>
  );
};
