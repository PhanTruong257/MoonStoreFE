import { message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { dispatchCartUpdated } from "@/app/utils/cart-event";
import { extractApiErrorMessage } from "@/app/utils/error-message";
import { CHAT_ROUTES } from "@/const/chat.const";
import { getStoredUser } from "@/features/auth/auth-storage";
import { homeProducts } from "@/pages/home/mock-data";
import { addToCart } from "@/services/cart-service";
import { fetchProductDetail } from "@/services/catalog-service";
import type {
  CatalogOption,
  CatalogOptionGroup,
  CatalogProductDetail,
} from "@/services/catalog-service";
import { createOrGetConversation } from "@/services/chat-service";

const colorMap: Record<string, string> = {
  Red: "#e07575",
  Blue: "#5a8dee",
  Black: "#1f2028",
  White: "#f2f2f2",
  Midnight: "#1f2028",
  Silver: "#c5c5c5",
};

const resolveColor = (value: string) => {
  return colorMap[value] ?? "#8abdcf";
};

export type ProductOptionView = CatalogOption & { swatch?: string };

export type ProductOptionGroupView = Omit<CatalogOptionGroup, "options"> & {
  options: ProductOptionView[];
};

type ProductView = {
  id: string;
  rawId: number;
  name: string;
  categoryName: string;
  basePrice: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  gallery: string[];
  sellerId: number;
  sellerShopName: string;
  optionGroups: ProductOptionGroupView[];
};

type SelectionMap = Record<number, number[]>;

const buildInitialSelection = (groups: ProductOptionGroupView[]): SelectionMap => {
  const selection: SelectionMap = {};
  for (const group of groups) {
    if (group.required && group.options.length > 0 && !group.multiSelect) {
      selection[group.id] = [group.options[0].id];
    } else {
      selection[group.id] = [];
    }
  }
  return selection;
};

export const useProductDetailData = () => {
  const { productId } = useParams();
  const [catalogProduct, setCatalogProduct] =
    useState<CatalogProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const product = useMemo<ProductView | null>(() => {
    if (!productId) {
      return null;
    }

    if (!catalogProduct) {
      return null;
    }

    const optionGroups: ProductOptionGroupView[] = catalogProduct.optionGroups.map(
      (group) => {
        const isColor = group.name.toLowerCase() === "color";
        return {
          ...group,
          options: group.options.map((option) => ({
            ...option,
            swatch: isColor ? resolveColor(option.name) : undefined,
          })),
        };
      },
    );

    return {
      id: String(catalogProduct.id),
      rawId: catalogProduct.id,
      name: catalogProduct.name,
      categoryName: catalogProduct.categoryName,
      basePrice: catalogProduct.basePrice,
      rating: catalogProduct.averageRating ?? 0,
      reviews: catalogProduct.totalReviews,
      inStock: catalogProduct.stock > 0,
      description: catalogProduct.description ?? "",
      gallery: [catalogProduct.imageUrl],
      sellerId: catalogProduct.sellerId,
      sellerShopName: catalogProduct.sellerShopName,
      optionGroups,
    };
  }, [catalogProduct, productId]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<SelectionMap>({});
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!product) {
      return;
    }
    setSelectedOptions(buildInitialSelection(product.optionGroups));
    setSelectedImage(0);
  }, [product]);

  useEffect(() => {
    if (!productId) {
      return;
    }

    const numericId = Number(productId);
    if (Number.isNaN(numericId)) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const loadDetail = async () => {
      try {
        const detail = await fetchProductDetail(numericId);
        if (isMounted) {
          setCatalogProduct(detail);
        }
      } catch {
        if (isMounted) {
          setCatalogProduct(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDetail();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const optionsTotal = useMemo(() => {
    if (!product) {
      return 0;
    }
    let sum = 0;
    for (const group of product.optionGroups) {
      const selectedIds = selectedOptions[group.id] ?? [];
      for (const optionId of selectedIds) {
        const option = group.options.find((item) => item.id === optionId);
        if (option) {
          sum += option.priceDelta;
        }
      }
    }
    return sum;
  }, [product, selectedOptions]);

  const unitPrice = product ? product.basePrice + optionsTotal : 0;

  const selectedOptionIds = useMemo(() => {
    return Object.values(selectedOptions).flat();
  }, [selectedOptions]);

  const relatedProducts = useMemo(() => {
    if (!product) {
      return homeProducts.slice(0, 4);
    }
    return homeProducts.filter((item) => item.id !== product.id).slice(0, 4);
  }, [product]);

  const setOption = (group: ProductOptionGroupView, optionId: number) => {
    setSelectedOptions((prev) => {
      if (group.multiSelect) {
        const current = prev[group.id] ?? [];
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [group.id]: next };
      }
      return { ...prev, [group.id]: [optionId] };
    });
  };

  const isOptionSelected = (groupId: number, optionId: number) => {
    return (selectedOptions[groupId] ?? []).includes(optionId);
  };

  const missingRequiredGroups = useMemo(() => {
    if (!product) {
      return [];
    }
    return product.optionGroups.filter(
      (group) => group.required && (selectedOptions[group.id] ?? []).length === 0,
    );
  }, [product, selectedOptions]);

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 20));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const toggleWishlist = () => {
    setIsWishlisted((prev) => !prev);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const chatWithSeller = async () => {
    if (!product) {
      return;
    }
    const user = getStoredUser();
    if (!user) {
      void navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }
    setIsStartingChat(true);
    try {
      const conversation = await createOrGetConversation({
        sellerId: product.sellerId,
        productId: product.rawId,
      });
      void navigate(CHAT_ROUTES.buyerDetail(conversation.id));
    } catch (error) {
      void message.error(
        extractApiErrorMessage(error, "Không thể bắt đầu trò chuyện."),
      );
    } finally {
      setIsStartingChat(false);
    }
  };

  const addSelectedToCart = async () => {
    if (!product) {
      return false;
    }
    if (missingRequiredGroups.length > 0) {
      return false;
    }

    try {
      await addToCart({
        productId: product.rawId,
        optionIds: selectedOptionIds,
        quantity,
      });
      dispatchCartUpdated();
      return true;
    } catch {
      return false;
    }
  };

  return {
    isLoading,
    isWishlisted,
    product,
    quantity,
    relatedProducts,
    selectedImage,
    selectedOptions,
    unitPrice,
    missingRequiredGroups,
    isStartingChat,
    addSelectedToCart,
    chatWithSeller,
    decreaseQuantity,
    increaseQuantity,
    isOptionSelected,
    setOption,
    setSelectedImage,
    toggleWishlist,
  };
};
