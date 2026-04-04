import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { getStoredUser } from "@/features/auth/auth-storage";
import { homeProducts } from "@/pages/home/mock-data";
import { getProductDetailById } from "@/pages/product/mock-data";
import { addToCart } from "@/services/cart-service";
import { fetchProductDetail } from "@/services/catalog-service";
import type {
  CatalogOptionGroup,
  CatalogProductDetail,
} from "@/services/catalog-service";

const colorMap: Record<string, string> = {
  Red: "#e07575",
  Blue: "#5a8dee",
  Black: "#1f2028",
  White: "#f2f2f2",
};

const resolveColor = (value: string) => {
  return colorMap[value] ?? "#8abdcf";
};

type ProductOption = {
  value: string;
  swatch?: string;
};

type ProductOptionGroup = {
  name: string;
  options: ProductOption[];
};

export const useProductDetailData = () => {
  const { productId } = useParams();
  const [catalogProduct, setCatalogProduct] =
    useState<CatalogProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const product = useMemo(() => {
    if (!productId) {
      return null;
    }

    if (catalogProduct) {
      const toOptionGroups = (groups: CatalogOptionGroup[]) => {
        return groups.map((group) => {
          const isColor = group.name.toLowerCase() === "color";
          return {
            name: group.name,
            options: group.options.map((option) => ({
              value: option.value,
              swatch: isColor ? resolveColor(option.value) : undefined,
            })),
          } as ProductOptionGroup;
        });
      };

      const derivedGroupsMap = new Map<string, Set<string>>();
      for (const sku of catalogProduct.skus) {
        for (const attr of sku.attributes ?? []) {
          if (!derivedGroupsMap.has(attr.name)) {
            derivedGroupsMap.set(attr.name, new Set<string>());
          }
          derivedGroupsMap.get(attr.name)?.add(attr.value);
        }
      }

      const derivedGroups: CatalogOptionGroup[] = Array.from(
        derivedGroupsMap.entries(),
      ).map(([name, values]) => ({
        name,
        options: Array.from(values).map((value) => ({ value })),
      }));

      const optionGroups = toOptionGroups(
        catalogProduct.optionGroups && catalogProduct.optionGroups.length > 0
          ? catalogProduct.optionGroups
          : derivedGroups,
      );

      const gallery = Array.from(
        new Set(catalogProduct.skus.map((sku) => sku.imageUrl).filter(Boolean)),
      );

      const defaultSku = catalogProduct.skus[0];
      const price = defaultSku ? Number(defaultSku.price) : 0;

      return {
        id: String(catalogProduct.id),
        name: catalogProduct.name,
        price,
        oldPrice: Math.round(price * 1.2),
        rating: 4,
        reviews: 64,
        inStock: (defaultSku?.stock ?? 0) > 0,
        description: catalogProduct.description ?? "",
        gallery:
          gallery.length > 0 ? gallery : ["/images/products/product-1.jpg"],
        optionGroups,
        skus: catalogProduct.skus,
      };
    }

    const fallback = getProductDetailById(productId);
    if (!fallback) {
      return null;
    }

    const fallbackGroups: ProductOptionGroup[] = [
      {
        name: "Color",
        options: fallback.colors.map((color) => ({
          value: color.id,
          swatch: color.hex,
        })),
      },
      {
        name: "Size",
        options: fallback.sizes.map((size) => ({ value: size })),
      },
    ];

    return {
      ...fallback,
      optionGroups: fallbackGroups,
      skus: [],
    };
  }, [catalogProduct, productId]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(2);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!product) {
      return;
    }

    const defaults: Record<string, string> = {};
    for (const group of product.optionGroups ?? []) {
      const firstOption = group.options[0];
      if (firstOption) {
        defaults[group.name] = firstOption.value;
      }
    }

    setSelectedOptions(defaults);
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

  const selectedSku = useMemo(() => {
    if (!product || !product.skus || product.skus.length === 0) {
      return null;
    }

    const selectedEntries = Object.entries(selectedOptions).filter(
      ([, value]) => Boolean(value),
    );

    const match = product.skus.find((sku) => {
      const attrs = sku.attributes ?? [];
      return selectedEntries.every(([groupName, value]) => {
        const attr = attrs.find(
          (item) => item.name.toLowerCase() === groupName.toLowerCase(),
        );
        return !value || attr?.value === value;
      });
    });

    return match ?? product.skus[0] ?? null;
  }, [product, selectedOptions]);

  const relatedProducts = useMemo(() => {
    if (!product) {
      return homeProducts.slice(0, 4);
    }

    return homeProducts.filter((item) => item.id !== product.id).slice(0, 4);
  }, [product]);

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 20));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const toggleWishlist = () => {
    setIsWishlisted((prev) => !prev);
  };

  const addSelectedToCart = async () => {
    if (!selectedSku) {
      return false;
    }

    const user = getStoredUser();

    try {
      await addToCart({
        userId: user?.id,
        skuId: selectedSku.id,
        quantity,
      });
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
    selectedSku,
    relatedProducts,
    selectedImage,
    selectedOptions,
    addSelectedToCart,
    decreaseQuantity,
    increaseQuantity,
    setSelectedOption: (groupName: string, value: string) => {
      setSelectedOptions((prev) => ({ ...prev, [groupName]: value }));
    },
    setSelectedImage,
    toggleWishlist,
  };
};
