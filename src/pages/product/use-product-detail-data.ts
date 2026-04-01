import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { getStoredUser } from "@/features/auth/auth-storage";
import { homeProducts } from "@/pages/home/mock-data";
import { getProductDetailById } from "@/pages/product/mock-data";
import { addToCart } from "@/services/cart-service";
import { fetchProductDetail } from "@/services/catalog-service";
import type { CatalogProductDetail } from "@/services/catalog-service";

const colorMap: Record<string, string> = {
  Red: "#e07575",
  Blue: "#5a8dee",
  Black: "#1f2028",
  White: "#f2f2f2",
};

const resolveColor = (value: string) => {
  return colorMap[value] ?? "#8abdcf";
};

export const useProductDetailData = () => {
  const { productId } = useParams();
  const [catalogProduct, setCatalogProduct] =
    useState<CatalogProductDetail | null>(null);

  const product = useMemo(() => {
    if (!productId) {
      return null;
    }

    if (catalogProduct) {
      const colors = Array.from(
        new Set(
          catalogProduct.skus
            .flatMap((sku) => sku.attributes ?? [])
            .filter((attr) => attr.name.toLowerCase() === "color")
            .map((attr) => attr.value),
        ),
      ).map((value) => ({ id: value, hex: resolveColor(value) }));

      const sizes = Array.from(
        new Set(
          catalogProduct.skus
            .flatMap((sku) => sku.attributes ?? [])
            .filter((attr) => attr.name.toLowerCase() === "size")
            .map((attr) => attr.value),
        ),
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
        colors,
        sizes,
        skus: catalogProduct.skus,
      };
    }

    return getProductDetailById(productId);
  }, [catalogProduct, productId]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(2);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!productId) {
      return;
    }

    const numericId = Number(productId);
    if (Number.isNaN(numericId)) {
      return;
    }

    let isMounted = true;

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
      }
    };

    void loadDetail();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const selectedSku = useMemo(() => {
    if (!product || !("skus" in product)) {
      return null;
    }

    const selectedColorValue = product.colors[selectedColor]?.id;
    const selectedSizeValue = product.sizes[selectedSize];

    const match = product.skus.find((sku) => {
      const attrs = sku.attributes ?? [];
      const color = attrs.find(
        (attr) => attr.name.toLowerCase() === "color",
      )?.value;
      const size = attrs.find(
        (attr) => attr.name.toLowerCase() === "size",
      )?.value;

      return (
        (!selectedColorValue || color === selectedColorValue) &&
        (!selectedSizeValue || size === selectedSizeValue)
      );
    });

    return match ?? product.skus[0] ?? null;
  }, [product, selectedColor, selectedSize]);

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
    isWishlisted,
    product,
    quantity,
    selectedSku,
    relatedProducts,
    selectedColor,
    selectedImage,
    selectedSize,
    addSelectedToCart,
    decreaseQuantity,
    increaseQuantity,
    setSelectedColor,
    setSelectedImage,
    setSelectedSize,
    toggleWishlist,
  };
};
