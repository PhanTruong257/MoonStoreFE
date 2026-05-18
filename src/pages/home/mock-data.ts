export type HomeBanner = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaTo: string;
  image: string;
};

export type HomeCategory = {
  id: string;
  label: string;
};

export type HomeProduct = {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  categoryId: string;
  image: string;
  rating: number;
  sold: number;
  isNew?: boolean;
};

export type HomeService = {
  id: string;
  title: string;
  description: string;
};

export type HomeSideMenuItem = {
  label: string;
  children: string[];
};

import { UI_TEXT } from "@/const/ui-text";

const ft = UI_TEXT.footer;
const nv = UI_TEXT.nav;

export const homeHeaderLinks = [
  { label: nv.home, to: "/home" },
  { label: nv.contact, to: "/contact" },
  { label: nv.about, to: "/about" },
  { label: nv.signUp, to: "/register" },
];

export const homeFooterSections = [
  {
    title: ft.exclusiveTitle,
    items: [{ label: ft.subscribeLabel }, { label: ft.subscribeDesc }],
  },
  {
    title: ft.supportTitle,
    items: [
      { label: ft.address },
      { label: ft.email },
      { label: ft.phone },
    ],
  },
  {
    title: ft.accountTitle,
    items: [
      { label: ft.myAccount },
      { label: ft.loginRegister, to: "/login" },
      { label: ft.cart },
      { label: ft.wishlist },
      { label: ft.shop, to: "/" },
    ],
  },
  {
    title: ft.quickLinkTitle,
    items: [
      { label: ft.privacyPolicy },
      { label: ft.termsOfUse },
      { label: ft.faq },
      { label: ft.contact },
    ],
  },
];

export const homeSideMenu: HomeSideMenuItem[] = UI_TEXT.home.sideMenu;

export const homeBanners: HomeBanner[] = [
  {
    id: "banner-1",
    title: "Up to 10% off Voucher",
    subtitle: "iPhone 14 Series",
    ctaLabel: "Shop Now",
    ctaTo: "/",
    image: "/images/products/product-1.jpg",
  },
  {
    id: "banner-2",
    title: "Big Weekend Gaming Deals",
    subtitle: "RGB accessories and monitor sale",
    ctaLabel: "Discover",
    ctaTo: "/",
    image: "/images/products/product-2.jpg",
  },
  {
    id: "banner-3",
    title: "Upgrade Your Setup Today",
    subtitle: "Laptops, cameras, and audio devices",
    ctaLabel: "See Offers",
    ctaTo: "/",
    image: "/images/products/product-3.jpg",
  },
];

export const homeCategories: HomeCategory[] = [
  { id: "all", label: "All" },
  { id: "phone", label: "Phones" },
  { id: "computer", label: "Computers" },
  { id: "watch", label: "Smart Watch" },
  { id: "camera", label: "Camera" },
  { id: "headphone", label: "Headphones" },
  { id: "gaming", label: "Gaming" },
  { id: "fashion", label: "Fashion" },
  { id: "furniture", label: "Furniture" },
];

export const flashSaleDeadline = "2026-04-03T23:59:59";

export const homeProducts: HomeProduct[] = [
  {
    id: "p-1",
    name: "HAVIT HV-G92 Gamepad",
    price: 120,
    oldPrice: 160,
    categoryId: "gaming",
    image: "/images/products/product-1.jpg",
    rating: 5,
    sold: 88,
  },
  {
    id: "p-2",
    name: "AK-900 Wired Keyboard",
    price: 960,
    oldPrice: 1160,
    categoryId: "gaming",
    image: "/images/products/product-2.jpg",
    rating: 4,
    sold: 75,
  },
  {
    id: "p-3",
    name: "IPS LCD Gaming Monitor",
    price: 370,
    oldPrice: 400,
    categoryId: "computer",
    image: "/images/products/product-3.jpg",
    rating: 5,
    sold: 99,
  },
  {
    id: "p-4",
    name: "S-Series Comfort Chair",
    price: 375,
    oldPrice: 400,
    categoryId: "furniture",
    image: "/images/products/product-1.jpg",
    rating: 4,
    sold: 52,
  },
  {
    id: "p-5",
    name: "The North Coat",
    price: 260,
    oldPrice: 360,
    categoryId: "fashion",
    image: "/images/products/product-2.jpg",
    rating: 5,
    sold: 65,
  },
  {
    id: "p-6",
    name: "Gucci Duffle Bag",
    price: 960,
    oldPrice: 1160,
    categoryId: "fashion",
    image: "/images/products/product-3.jpg",
    rating: 5,
    sold: 65,
  },
  {
    id: "p-7",
    name: "RGB Liquid CPU Cooler",
    price: 160,
    oldPrice: 170,
    categoryId: "computer",
    image: "/images/products/product-1.jpg",
    rating: 5,
    sold: 65,
  },
  {
    id: "p-8",
    name: "Kids Electric Car",
    price: 960,
    oldPrice: 1160,
    categoryId: "gaming",
    image: "/images/products/product-2.jpg",
    rating: 5,
    sold: 65,
    isNew: true,
  },
  {
    id: "p-9",
    name: "Jr. Zoom Soccer Cleats",
    price: 1160,
    oldPrice: 1360,
    categoryId: "fashion",
    image: "/images/products/product-3.jpg",
    rating: 4,
    sold: 35,
  },
  {
    id: "p-10",
    name: "GP11 Shooter USB Gamepad",
    price: 660,
    oldPrice: 760,
    categoryId: "gaming",
    image: "/images/products/product-1.jpg",
    rating: 5,
    sold: 55,
    isNew: true,
  },
  {
    id: "p-11",
    name: "Canon EOS DSLR Camera",
    price: 360,
    oldPrice: 400,
    categoryId: "camera",
    image: "/images/products/product-2.jpg",
    rating: 4,
    sold: 95,
  },
  {
    id: "p-12",
    name: "ASUS FHD Gaming Laptop",
    price: 700,
    oldPrice: 820,
    categoryId: "computer",
    image: "/images/products/product-3.jpg",
    rating: 5,
    sold: 325,
  },
];

export const homeServices: HomeService[] = UI_TEXT.home.services.map(
  (s, i) => ({ id: `service-${i + 1}`, ...s }),
);

const arrivalImages = [
  "/images/products/product-3.jpg",
  "/images/products/product-2.jpg",
  "/images/products/product-1.jpg",
  "/images/products/product-3.jpg",
];

export const arrivalCards = UI_TEXT.home.arrivals.map((a, i) => ({
  id: `arrival-${i + 1}`,
  ...a,
  image: arrivalImages[i],
}));
