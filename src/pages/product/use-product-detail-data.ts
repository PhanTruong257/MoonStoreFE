import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { homeProducts } from "@/pages/home/mock-data";
import { getProductDetailById } from "@/pages/product/mock-data";

export const useProductDetailData = () => {
  const { productId } = useParams();

  const product = useMemo(() => {
    if (!productId) {
      return null;
    }

    return getProductDetailById(productId);
  }, [productId]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(2);
  const [quantity, setQuantity] = useState(2);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  return {
    isWishlisted,
    product,
    quantity,
    relatedProducts,
    selectedColor,
    selectedImage,
    selectedSize,
    decreaseQuantity,
    increaseQuantity,
    setSelectedColor,
    setSelectedImage,
    setSelectedSize,
    toggleWishlist,
  };
};
