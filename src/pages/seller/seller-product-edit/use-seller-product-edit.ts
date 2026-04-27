import { Form } from "antd";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "@/app/app-store";
import { safeParseJsonArray } from "@/app/utils/safe-parse";
import { SELLER_ROUTES } from "@/const/seller.const";
import { sellerProductEditActions } from "@/features/seller/seller-product-edit/seller-product-edit.slice";
import type {
  SellerProductOptionGroupInput,
  UpdateSellerProductPayload,
} from "@/services/seller-service";

export type SellerProductEditFormValues = {
  name: string;
  description?: string;
  status: string;
  categoryId: number;
  brandId: number;
  basePrice: number;
  stock: number;
  imageUrl: string;
  optionGroupsJson?: string;
};

export const useSellerProductEdit = () => {
  const params = useParams<{ productId: string }>();
  const productId = Number(params.productId ?? 0);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm<SellerProductEditFormValues>();

  const { detail, categories, isLoading, isSubmitting, isDeleting, error } =
    useSelector((state: RootState) => state.sellerProductEdit);

  useEffect(() => {
    if (!productId) {
      return;
    }
    dispatch(
      sellerProductEditActions.sellerProductEditLoadRequested(productId),
    );

    return () => {
      dispatch(sellerProductEditActions.sellerProductEditReset());
    };
  }, [dispatch, productId]);

  useEffect(() => {
    if (!detail) {
      return;
    }
    const product = detail.product;
    const groupsForJson = product.optionGroups.map((group) => ({
      name: group.name,
      required: group.required,
      multiSelect: group.multiSelect,
      options: group.options.map((option) => ({
        name: option.name,
        priceDelta: option.priceDelta,
      })),
    }));

    form.setFieldsValue({
      name: product.name,
      description: product.description ?? "",
      status: product.status,
      categoryId: product.categoryId,
      brandId: product.brandId,
      basePrice: product.basePrice,
      stock: product.stock,
      imageUrl: product.imageUrl,
      optionGroupsJson:
        groupsForJson.length > 0
          ? JSON.stringify(groupsForJson, null, 2)
          : "",
    });
  }, [detail, form]);

  const handleSubmit = useCallback(
    (values: SellerProductEditFormValues) => {
      const payload: UpdateSellerProductPayload = {
        name: values.name,
        description: values.description,
        status: values.status,
        categoryId: Number(values.categoryId),
        brandId: Number(values.brandId),
        basePrice: Number(values.basePrice),
        stock: Number(values.stock),
        imageUrl: values.imageUrl,
      };

      const parsedGroups = safeParseJsonArray<SellerProductOptionGroupInput>(
        values.optionGroupsJson,
      );
      if (parsedGroups !== undefined) {
        payload.optionGroups = parsedGroups;
      }

      dispatch(
        sellerProductEditActions.sellerProductEditUpdateRequested({
          productId,
          payload,
        }),
      );
    },
    [dispatch, productId],
  );

  const handleDelete = useCallback(() => {
    dispatch(
      sellerProductEditActions.sellerProductEditDeleteRequested(productId),
    );
  }, [dispatch, productId]);

  const prevSubmittingRef = useRef(false);
  const prevDeletingRef = useRef(false);

  useEffect(() => {
    if (prevSubmittingRef.current && !isSubmitting && !error) {
      void navigate(SELLER_ROUTES.products);
    }
    prevSubmittingRef.current = isSubmitting;
  }, [isSubmitting, error, navigate]);

  useEffect(() => {
    if (prevDeletingRef.current && !isDeleting && !error) {
      void navigate(SELLER_ROUTES.products);
    }
    prevDeletingRef.current = isDeleting;
  }, [isDeleting, error, navigate]);

  return {
    form,
    loading: isLoading,
    submitting: isSubmitting,
    deleting: isDeleting,
    error,
    categories,
    handleSubmit,
    handleDelete,
  };
};
