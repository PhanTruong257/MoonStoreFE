import { homeProducts } from "@/pages/home/mock-data";

export type ProductColor = {
  id: string;
  hex: string;
};

export type ProductDetail = {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  gallery: string[];
  colors: ProductColor[];
  sizes: string[];
};

const fallbackDescription =
  "PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install and mess free removal Pressure sensitive.";

const colorPresets: ProductColor[][] = [
  [
    { id: "cyan", hex: "#8abdcf" },
    { id: "red", hex: "#e07575" },
  ],
  [
    { id: "black", hex: "#1f2028" },
    { id: "violet", hex: "#6d63ff" },
  ],
  [
    { id: "orange", hex: "#ff8e3c" },
    { id: "steel", hex: "#708090" },
  ],
];

const sizePresets = ["XS", "S", "M", "L", "XL"];

export const productDetailData: ProductDetail[] = homeProducts.map(
  (product, index) => {
    const preset = colorPresets[index % colorPresets.length];

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      rating: product.rating,
      reviews: product.sold + 62,
      inStock: true,
      description: fallbackDescription,
      gallery: [
        product.image,
        "/images/products/product-1.jpg",
        "/images/products/product-2.jpg",
        "/images/products/product-3.jpg",
      ],
      colors: preset,
      sizes: sizePresets,
    };
  },
);

export const getProductDetailById = (productId: string) => {
  return productDetailData.find((item) => item.id === productId) ?? null;
};
