import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./seller-product-new-page.module.scss";

import { getStoredUser } from "@/features/auth/auth-storage";
import { SellerShell } from "@/features/seller/components/seller-shell";
import {
  loadSellerProducts,
  saveSellerProducts,
} from "@/features/seller/seller-storage";
import type { CatalogCategory } from "@/services/catalog-service";
import { fetchCategories } from "@/services/catalog-service";
import { createProduct } from "@/services/seller-service";
import type { SellerProductOptionGroupInput } from "@/services/seller-service";

const safeParseGroups = (raw: string): SellerProductOptionGroupInput[] | undefined => {
  if (!raw.trim()) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(raw) as SellerProductOptionGroupInput[];
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

export const SellerProductNewPage = () => {
  const user = getStoredUser();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [brandId, setBrandId] = useState(1);
  const [basePrice, setBasePrice] = useState(0);
  const [stock, setStock] = useState(10);
  const [imageUrl, setImageUrl] = useState("/images/products/product-1.jpg");
  const [optionGroupsJson, setOptionGroupsJson] = useState("");
  const [status, setStatus] = useState("active");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setCategoriesError("");
      try {
        const list = await fetchCategories();
        if (!isMounted) {
          return;
        }

        setCategories(list);
        if (list.length > 0) {
          setCategoryId((prev) =>
            list.some((item) => item.id === prev) ? prev : list[0].id,
          );
        }
      } catch {
        if (!isMounted) {
          return;
        }

        setCategoriesError("Unable to load categories.");
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      setError("Please login to continue.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter product name.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const optionGroups = safeParseGroups(optionGroupsJson);

      const response = await createProduct({
        name,
        description,
        categoryId,
        brandId,
        basePrice,
        stock,
        imageUrl,
        status,
        optionGroups,
      });

      const current = loadSellerProducts(user.id);
      const nextItem = {
        id: response.product.id,
        name: response.product.name,
        status: response.product.status,
        basePrice: response.product.basePrice,
        stock: response.product.stock,
        imageUrl: response.product.imageUrl,
        createdAt: new Date().toISOString(),
      };
      saveSellerProducts(user.id, [nextItem, ...current]);

      void navigate("/seller/products");
    } catch {
      setError("Unable to create product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SellerShell
      title="Upload a new product"
      subtitle="Publish listings fast with a clean product brief."
      actions={
        <Link to="/seller/products" className={styles.secondaryButton}>
          Back to products
        </Link>
      }
    >
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <div className={styles.field}>
          <label htmlFor="name">Product name</label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="iPhone 17 Pro Max"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Short description</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Highlight the key specs and condition."
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(event) => setCategoryId(Number(event.target.value))}
              disabled={categories.length === 0}
            >
              {categories.length === 0 ? (
                <option value={categoryId}>No categories available</option>
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
              value={brandId}
              onChange={(event) => setBrandId(Number(event.target.value))}
            />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="basePrice">Base price</label>
            <input
              id="basePrice"
              type="number"
              value={basePrice}
              onChange={(event) => setBasePrice(Number(event.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              type="number"
              value={stock}
              onChange={(event) => setStock(Number(event.target.value))}
            />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="imageUrl">Image URL</label>
            <input
              id="imageUrl"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="optionGroupsJson">Option groups (JSON, optional)</label>
          <textarea
            id="optionGroupsJson"
            value={optionGroupsJson}
            onChange={(event) => setOptionGroupsJson(event.target.value)}
            placeholder='[{"name":"Size","required":true,"multiSelect":false,"options":[{"name":"S","priceDelta":0},{"name":"M","priceDelta":0}]}]'
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
          <Link to="/seller/products" className={styles.secondaryButton}>
            Cancel
          </Link>
        </div>
      </form>
    </SellerShell>
  );
};
