import { Link } from "react-router-dom";

import styles from "./seller-product-new-page.module.scss";
import { useSellerProductNew } from "./use-seller-product-new";

import {
  OPTION_GROUPS_JSON_PLACEHOLDER,
  SELLER_PRODUCT_STATUS_OPTIONS,
} from "@/const/seller-product-new.const";
import { SELLER_ROUTES } from "@/const/seller.const";
import { SellerShell } from "@/features/seller/components/seller-shell";

export const SellerProductNewPage = () => {
  const {
    form,
    error,
    isSaving,
    categories,
    categoriesError,
    setField,
    submit,
  } = useSellerProductNew();

  return (
    <SellerShell
      title="Upload a new product"
      subtitle="Publish listings fast with a clean product brief."
      actions={
        <Link to={SELLER_ROUTES.products} className={styles.secondaryButton}>
          Back to products
        </Link>
      }
    >
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div className={styles.field}>
          <label htmlFor="name">Product name</label>
          <input
            id="name"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            placeholder="iPhone 17 Pro Max"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Short description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => setField("description", event.target.value)}
            placeholder="Highlight the key specs and condition."
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              value={form.categoryId}
              onChange={(event) =>
                setField("categoryId", Number(event.target.value))
              }
              disabled={categories.length === 0}
            >
              {categories.length === 0 ? (
                <option value={form.categoryId}>No categories available</option>
              ) : (
                categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="brandId">Brand id</label>
            <input
              id="brandId"
              type="number"
              value={form.brandId}
              onChange={(event) =>
                setField("brandId", Number(event.target.value))
              }
            />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="basePrice">Base price</label>
            <input
              id="basePrice"
              type="number"
              value={form.basePrice}
              onChange={(event) =>
                setField("basePrice", Number(event.target.value))
              }
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              type="number"
              value={form.stock}
              onChange={(event) => setField("stock", Number(event.target.value))}
            />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="imageUrl">Image URL</label>
            <input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(event) => setField("imageUrl", event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(event) => setField("status", event.target.value)}
            >
              {SELLER_PRODUCT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="optionGroupsJson">
            Option groups (JSON, optional)
          </label>
          <textarea
            id="optionGroupsJson"
            value={form.optionGroupsJson}
            onChange={(event) =>
              setField("optionGroupsJson", event.target.value)
            }
            placeholder={OPTION_GROUPS_JSON_PLACEHOLDER}
            rows={6}
          />
        </div>

        {categoriesError ? (
          <p className={styles.note}>{categoriesError}</p>
        ) : (
          <p className={styles.note}>
            Tip: Use category/brand ids from your database seed to keep products
            in the right catalog.
          </p>
        )}

        {error ? <p className={styles.note}>{error}</p> : null}

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Publish product"}
          </button>
          <Link to={SELLER_ROUTES.products} className={styles.secondaryButton}>
            Cancel
          </Link>
        </div>
      </form>
    </SellerShell>
  );
};
