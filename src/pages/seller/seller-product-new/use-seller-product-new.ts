import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SELLER_PRODUCT_NEW_DEFAULTS } from "@/const/seller-product-new.const";
import { SELLER_ROUTES } from "@/const/seller.const";
import { UI_TEXT } from "@/const/ui-text";
import { getStoredUser } from "@/features/auth/auth-storage";
import {
  loadSellerProducts,
  saveSellerProducts,
} from "@/features/seller/seller-storage";
import type { CatalogCategory } from "@/services/catalog-service";
import { fetchCategories } from "@/services/catalog-service";
import { createProduct, generateProductContent } from "@/services/seller-service";
import type {
  ProductHighlight,
  SellerProductOptionGroupInput,
} from "@/services/seller-service";

const aiText = UI_TEXT.seller.productNew;

// AI chỉ đọc được ảnh đã upload thật (lưu ở /uploads/products/...), không đọc
// được ảnh placeholder tĩnh mặc định (/images/...).
const UPLOADED_IMAGE_PREFIX = "/uploads/";

type FormState = {
  name: string;
  description: string;
  categoryId: number;
  brandId: number;
  basePrice: number;
  stock: number;
  imageUrl: string;
  optionGroups: SellerProductOptionGroupInput[];
  highlights: ProductHighlight[];
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
  optionGroups: [],
  highlights: [],
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

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
        setCategoriesError("Không tải được danh mục.");
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const submit = async () => {
    if (!user) {
      setError("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    if (!form.name.trim()) {
      setError("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (!form.imageUrl) {
      setError("Vui lòng tải ảnh sản phẩm.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await createProduct({
        name: form.name,
        description: form.description,
        categoryId: form.categoryId,
        brandId: form.brandId,
        basePrice: form.basePrice,
        stock: form.stock,
        imageUrl: form.imageUrl,
        status: form.status,
        optionGroups: form.optionGroups.length > 0 ? form.optionGroups : undefined,
        highlights: form.highlights.length > 0 ? form.highlights : undefined,
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
      setError("Không thể tạo sản phẩm.");
    } finally {
      setIsSaving(false);
    }
  };

  const canGenerate = form.imageUrl.includes(UPLOADED_IMAGE_PREFIX);

  const generateContent = async () => {
    if (!canGenerate) {
      setAiError(aiText.aiNeedImage);
      return;
    }
    setIsGenerating(true);
    setAiError("");
    try {
      const data = await generateProductContent({
        imageUrl: form.imageUrl,
        name: form.name || undefined,
        categoryId: form.categoryId,
        brandId: form.brandId,
      });
      setForm((prev) => ({
        ...prev,
        name: data.title || prev.name,
        description: data.description || prev.description,
        highlights: data.highlights.length > 0 ? data.highlights : prev.highlights,
      }));
    } catch {
      setAiError(aiText.aiError);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    form,
    error,
    isSaving,
    categories,
    categoriesError,
    isGenerating,
    aiError,
    canGenerate,
    setField,
    submit,
    generateContent,
  };
};
