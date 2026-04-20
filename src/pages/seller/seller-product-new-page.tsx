import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./seller-product-new-page.module.scss";

import { getStoredUser, setStoredUser } from "@/features/auth/auth-storage";
import { SellerShell } from "@/features/seller/components/seller-shell";
import {
  loadSellerProducts,
  saveSellerProducts,
} from "@/features/seller/seller-storage";
import type { CatalogCategory } from "@/services/catalog-service";
import { fetchCategories } from "@/services/catalog-service";
import { createProduct, createSellerProfile } from "@/services/seller-service";

export const SellerProductNewPage = () => {
  const user = getStoredUser();
  const navigate = useNavigate();

  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [brandId, setBrandId] = useState(1);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(10);
  const [imageUrl, setImageUrl] = useState("/images/products/product-1.jpg");
  const [skuCode, setSkuCode] = useState("");
  const [status, setStatus] = useState("active");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState("");

  const canRegisterSeller = useMemo(() => {
    return Boolean(user && user.role !== "seller");
  }, [user]);

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

  const handleRegisterSeller = async () => {
    if (!user) {
      return;
    }
    if (!shopName.trim()) {
      setError("Please enter your shop name.");
      return;
    }

    setError("");
    try {
      await createSellerProfile({
        userId: user.id,
        shopName,
        description: shopDescription,
      });
      setStoredUser({ ...user, role: "seller" });
    } catch {
      setError("Unable to register seller profile.");
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("Please login to continue.");
      return;
    }

    if (user.role !== "seller") {
      setError("Please register a seller profile first.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter product name.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await createProduct({
        userId: user.id,
        name,
        description,
        categoryId,
        brandId,
        price,
        stock,
        imageUrl,
        skuCode,
        status,
      });

      const current = loadSellerProducts(user.id);
      const nextItem = {
        id: response.product.id,
        name: response.product.name,
        status: response.product.status,
        price: response.sku.price,
        stock: response.sku.stock,
        imageUrl: response.sku.imageUrl,
        skuCode: response.sku.skuCode,
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
      {canRegisterSeller ? (
        <div className={styles.banner}>
          <strong>Seller profile required</strong>
          <p>Create your seller profile to start listing products.</p>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="shopName">Shop name</label>
              <input
                id="shopName"
                value={shopName}
                onChange={(event) => setShopName(event.target.value)}
                placeholder="Moon Store"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="shopDesc">Shop description</label>
              <input
                id="shopDesc"
                value={shopDescription}
                onChange={(event) => setShopDescription(event.target.value)}
                placeholder="Fast delivery, authentic devices"
              />
            </div>
          </div>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleRegisterSeller}
          >
            Activate seller profile
          </button>
        </div>
      ) : null}

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <div className={styles.fieldRow}>
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
            <label htmlFor="skuCode">SKU code</label>
            <input
              id="skuCode"
              value={skuCode}
              onChange={(event) => setSkuCode(event.target.value)}
              placeholder="IP17PM-256"
            />
          </div>
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
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
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
