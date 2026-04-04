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

export const homeHeaderLinks = [
  { label: "Home", to: "/home" },
  { label: "Contact", to: "/contact" },
  { label: "About", to: "/about" },
  { label: "Sign Up", to: "/register" },
];

export const homeFooterSections = [
  {
    title: "Exclusive",
    items: [{ label: "Subscribe" }, { label: "Get 10% off your first order" }],
  },
  {
    title: "Support",
    items: [
      { label: "111 Bijoy Sarani, Dhaka, BD" },
      { label: "exclusive@gmail.com" },
      { label: "+88015-88888-9999" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "My Account" },
      { label: "Login / Register", to: "/login" },
      { label: "Cart" },
      { label: "Wishlist" },
      { label: "Shop", to: "/" },
    ],
  },
  {
    title: "Quick Link",
    items: [
      { label: "Privacy Policy" },
      { label: "Terms Of Use" },
      { label: "FAQ" },
      { label: "Contact" },
    ],
  },
];

export const homeSideMenu = [
  "Phones",
  "Computers",
  "Smart Watch",
  "Camera",
  "Headphones",
  "Gaming",
  "Fashion",
  "Furniture",
];

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

export const homeServices: HomeService[] = [
  {
    id: "service-1",
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $140",
  },
  {
    id: "service-2",
    title: "24/7 CUSTOMER SERVICE",
    description: "Friendly 24/7 customer support",
  },
  {
    id: "service-3",
    title: "MONEY BACK GUARANTEE",
    description: "We return money within 30 days",
  },
];

export const arrivalCards = [
  {
    id: "arrival-1",
    title: "PlayStation 5",
    description: "Black and White version of the PS5 coming out on sale.",
    image: "/images/products/product-3.jpg",
  },
  {
    id: "arrival-2",
    title: "Women's Collections",
    description: "Featured woman collections that give you another vibe.",
    image: "/images/products/product-2.jpg",
  },
  {
    id: "arrival-3",
    title: "Speakers",
    description: "Amazon wireless speakers",
    image: "/images/products/product-1.jpg",
  },
  {
    id: "arrival-4",
    title: "Perfume",
    description: "GUCCI INTENSE OUD EDP",
    image: "/images/products/product-3.jpg",
  },
];
