import { Link } from "react-router-dom";

import styles from "./seller-product-new-page.module.scss";
import { useSellerProductNew } from "./use-seller-product-new";

import { ImageUploader } from "@/component/image-uploader/image-uploader";
import { OptionGroupsEditor } from "@/component/option-groups-editor/option-groups-editor";
import { SELLER_PRODUCT_STATUS_OPTIONS } from "@/const/seller-product-new.const";
import { SELLER_ROUTES } from "@/const/seller.const";
import { UI_TEXT } from "@/const/ui-text";
import { useSetSellerShell } from "@/features/seller/components/seller-shell-context";

const t = UI_TEXT.seller.productNew;

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

  useSetSellerShell({
    title: t.title,
    subtitle: t.subtitle,
    actions: (
      <Link to={SELLER_ROUTES.products} className={styles.secondaryButton}>
        {t.backToProducts}
      </Link>
    ),
  });

  return (
    <>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div className={styles.field}>
          <label htmlFor="name">{t.nameLabel}</label>
          <input
            id="name"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            placeholder={t.namePlaceholder}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">{t.descLabel}</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => setField("description", event.target.value)}
            placeholder={t.descPlaceholder}
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="categoryId">{t.categoryLabel}</label>
            <select
              id="categoryId"
              value={form.categoryId}
              onChange={(event) =>
                setField("categoryId", Number(event.target.value))
              }
              disabled={categories.length === 0}
            >
              {categories.length === 0 ? (
                <option value={form.categoryId}>{t.noCategoriesOption}</option>
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
            <label htmlFor="brandId">{t.brandIdLabel}</label>
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
            <label htmlFor="basePrice">{t.basePriceLabel}</label>
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
            <label htmlFor="stock">{t.stockLabel}</label>
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
            <label>{t.imageUrlLabel}</label>
            <ImageUploader
              value={form.imageUrl}
              onChange={(url) => setField("imageUrl", url)}
              disabled={isSaving}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="status">{t.statusLabel}</label>
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
          <label>{t.optionGroupsLabel}</label>
          <OptionGroupsEditor
            value={form.optionGroups}
            onChange={(groups) => setField("optionGroups", groups)}
            disabled={isSaving}
          />
        </div>

        {categoriesError ? (
          <p className={styles.note}>{categoriesError}</p>
        ) : (
          <p className={styles.note}>{t.tipText}</p>
        )}

        {error ? <p className={styles.note}>{error}</p> : null}

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isSaving}
          >
            {isSaving ? t.savingBtn : t.publishBtn}
          </button>
          <Link to={SELLER_ROUTES.products} className={styles.secondaryButton}>
            {t.cancelBtn}
          </Link>
        </div>
      </form>
    </>
  );
};
