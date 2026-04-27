import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { safeParseJsonArray } from "@/app/utils/safe-parse";
import { SELLER_PRODUCT_NEW_DEFAULTS } from "@/const/seller-product-new.const";
import { SELLER_ROUTES } from "@/const/seller.const";
import { getStoredUser } from "@/features/auth/auth-storage";
import {
  loadSellerProducts,
  saveSellerProducts,
} from "@/features/seller/seller-storage";
import type { CatalogCategory } from "@/services/catalog-service";
import { fetchCategories } from "@/services/catalog-service";
import { createProduct } from "@/services/seller-service";
import type { SellerProductOptionGroupInput } from "@/services/seller-service";

type FormState = {
  name: string;
  description: string;
  categoryId: number;
  brandId: number;
  basePrice: number;
  stock: number;
  imageUrl: string;
  optionGroupsJson: string;
  status: string;
};

const initialForm: FormState = {
  name: "",
  description: "",
  categoryId: SELLER_PRODUCT_NEW_DEFAULTS.CATEGORY_ID,
  brandId: SELLER_PRODUCT_NEW_DEFAULTS.BRAND_ID,
  basePrice: SELLER_PRODUCT_NEW_DEFAULTS.BASE_PRICE,
  stock: SELLER_PRODUCT_NEW_DEFAULTS.STOCK,
  imageUrl: SELLER_PRODUCT_NEW_DEFAULTS.IMAGE_URL,
  optionGroupsJson: "",
  status: SELLER_PRODUCT_NEW_DEFAULTS.STATUS,
};

export const useSellerProductNew = () => {
  const user = getStoredUser();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState("");

  const setField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
          setForm((prev) =>
            list.some((item) => item.id === prev.categoryId)
              ? prev
              : { ...prev, categoryId: list[0].id },
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

  const submit = async () => {
    if (!user) {
      setError("Please login to continue.");
      return;
    }
    if (!form.name.trim()) {
      setError("Please enter product name.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const optionGroups = safeParseJsonArray<SellerProductOptionGroupInput>(
        form.optionGroupsJson,
      );

      const response = await createProduct({
        name: form.name,
        description: form.description,
        categoryId: form.categoryId,
        brandId: form.brandId,
        basePrice: form.basePrice,
        stock: form.stock,
        imageUrl: form.imageUrl,
        status: form.status,
        optionGroups,
      });

      const current = loadSellerProducts(user.id);
      saveSellerProducts(user.id, [
        {
          id: response.product.id,
          name: response.product.name,
          status: response.product.status,
          basePrice: response.product.basePrice,
          stock: response.product.stock,
          imageUrl: response.product.imageUrl,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);

      void navigate(SELLER_ROUTES.products);
    } catch {
      setError("Unable to create product.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    error,
    isSaving,
    categories,
    categoriesError,
    setField,
    submit,
  };
};
