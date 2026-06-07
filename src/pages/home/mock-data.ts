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
  children?: HomeCategory[];
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
  {
    id: "phones-devices",
    label: "Điện Thoại & Thiết Bị Số",
    children: [
      {
        id: "smartphone",
        label: "Điện thoại",
        children: [
          { id: "phone-apple", label: "Apple (iPhone)" },
          { id: "phone-samsung", label: "Samsung (Galaxy)" },
          { id: "phone-oppo", label: "OPPO" },
          { id: "phone-xiaomi", label: "Xiaomi" },
          { id: "phone-honor", label: "HONOR" },
          { id: "phone-other", label: "Hãng khác" },
          { id: "phone-ai", label: "Điện thoại AI" },
          { id: "phone-foldable", label: "Điện thoại gập" },
          { id: "phone-5g", label: "5G" },
          { id: "phone-gaming", label: "Gaming Phone" },
        ],
      },
      {
        id: "tablet",
        label: "Máy tính bảng & Máy đọc sách",
        children: [
          { id: "ipad", label: "iPad" },
          { id: "galaxy-tab", label: "Samsung Galaxy Tab" },
          { id: "honor-pad", label: "Honor Pad" },
          { id: "e-reader", label: "Máy đọc sách (Kindle, Boox)" },
        ],
      },
      {
        id: "smartwatch",
        label: "Đồng hồ thông minh",
        children: [
          { id: "apple-watch", label: "Apple Watch" },
          { id: "samsung-watch", label: "Samsung Watch" },
          { id: "garmin", label: "Garmin" },
          { id: "amazfit", label: "Amazfit" },
        ],
      },
    ],
  },
  {
    id: "computers-office",
    label: "Máy Tính & Thiết Bị Văn Phòng",
    children: [
      {
        id: "laptop",
        label: "Laptop",
        children: [
          { id: "macbook", label: "MacBook" },
          { id: "asus", label: "Asus" },
          { id: "lenovo", label: "Lenovo" },
          { id: "dell", label: "Dell" },
          { id: "acer", label: "Acer" },
          { id: "hp", label: "HP" },
          { id: "laptop-gaming-graphics", label: "Gaming & Đồ họa" },
          { id: "laptop-ai", label: "Laptop AI" },
          { id: "laptop-student", label: "Sinh viên - Văn phòng" },
          { id: "laptop-ultrabook", label: "Mỏng nhẹ" },
        ],
      },
      {
        id: "desktop-pc",
        label: "PC - Máy tính để bàn",
        children: [
          { id: "pc-office", label: "PC Văn phòng" },
          { id: "pc-gaming", label: "PC Gaming" },
          { id: "pc-workstation", label: "PC Workstation" },
        ],
      },
      {
        id: "monitor",
        label: "Màn hình",
        children: [
          { id: "monitor-asus", label: "Asus" },
          { id: "monitor-dell", label: "Dell" },
          { id: "monitor-lg", label: "LG" },
          { id: "monitor-msi", label: "MSI" },
        ],
      },
      {
        id: "pc-components",
        label: "Linh kiện PC",
        children: [
          { id: "cpu", label: "CPU" },
          { id: "ram", label: "RAM" },
          { id: "vga", label: "VGA (Card màn hình)" },
          { id: "motherboard", label: "Mainboard" },
          { id: "storage", label: "Ổ cứng (SSD/HDD)" },
          { id: "psu", label: "Nguồn" },
          { id: "case", label: "Vỏ Case" },
          { id: "cooler", label: "Tản nhiệt" },
        ],
      },
    ],
  },
  {
    id: "home-appliances",
    label: "Điện Máy & Điện Lạnh",
    children: [
      {
        id: "television",
        label: "Tivi",
        children: [
          { id: "tv-4k", label: "Tivi 4K" },
          { id: "tv-qled", label: "Tivi QLED" },
          { id: "tv-google", label: "Google TV" },
          { id: "tv-samsung", label: "Samsung" },
          { id: "tv-sony", label: "Sony" },
          { id: "tv-lg", label: "LG" },
        ],
      },
      {
        id: "air-conditioner",
        label: "Máy lạnh - Điều hòa",
        children: [
          { id: "ac-1way", label: "1 chiều" },
          { id: "ac-2way", label: "2 chiều" },
          { id: "ac-inverter", label: "Inverter" },
          { id: "ac-panasonic", label: "Panasonic" },
          { id: "ac-daikin", label: "Daikin" },
        ],
      },
      {
        id: "refrigerator",
        label: "Tủ lạnh - Tủ đông",
        children: [
          { id: "fridge-sbs", label: "Tủ Side-by-Side" },
          { id: "fridge-multi", label: "Multi-Door" },
          { id: "fridge-bottom", label: "Ngăn đá dưới" },
          { id: "fridge-lg", label: "LG" },
          { id: "fridge-samsung", label: "Samsung" },
        ],
      },
      {
        id: "washing-machine",
        label: "Máy giặt & Máy sấy",
        children: [
          { id: "washer-front", label: "Máy giặt cửa trước" },
          { id: "washer-top", label: "Máy giặt cửa trên" },
          { id: "washer-dryer", label: "Máy giặt sấy" },
          { id: "dryer-air", label: "Máy sấy thông hơi" },
          { id: "dryer-condense", label: "Máy sấy ngưng tụ" },
        ],
      },
    ],
  },
  {
    id: "accessories-gaming",
    label: "Phụ Kiện & Gaming Gear",
    children: [
      {
        id: "audio",
        label: "Âm thanh",
        children: [
          { id: "headphone-earbuds", label: "Tai nghe nhét tai" },
          { id: "headphone-over", label: "Tai nghe chụp tai" },
          { id: "headphone-wireless", label: "Tai nghe không dây" },
          { id: "speaker-bluetooth", label: "Loa Bluetooth" },
          { id: "speaker-karaoke", label: "Loa Karaoke" },
        ],
      },
      {
        id: "mobile-accessories",
        label: "Phụ kiện di động",
        children: [
          { id: "charger-cable", label: "Sạc & Cáp" },
          { id: "powerbank", label: "Pin dự phòng" },
          { id: "case", label: "Ốp lưng" },
          { id: "screen-protector", label: "Dán màn hình" },
          { id: "memory-card", label: "Thẻ nhớ" },
          { id: "tracker", label: "Airtag/Định vị" },
        ],
      },
      {
        id: "laptop-accessories",
        label: "Phụ kiện Laptop",
        children: [
          { id: "mouse", label: "Chuột" },
          { id: "keyboard", label: "Bàn phím" },
          { id: "laptop-bag", label: "Balo" },
          { id: "hub", label: "Hub chuyển đổi" },
          { id: "external-drive", label: "Ổ cứng di động" },
          { id: "usb-device", label: "USB & Thiết bị ngoại vi" },
        ],
      },
      {
        id: "gaming-gear",
        label: "Gaming Gear",
        children: [
          { id: "gaming-mouse", label: "Chuột Gaming" },
          { id: "gaming-keyboard", label: "Bàn phím Gaming" },
          { id: "gaming-headset", label: "Tai nghe Gaming" },
          { id: "gaming-controller", label: "Tay cầm chơi game" },
          { id: "gaming-mousepad", label: "Lót chuột Gaming" },
        ],
      },
      {
        id: "other-devices",
        label: "Thiết bị khác",
        children: [
          { id: "action-camera", label: "Camera hành động" },
          { id: "drone", label: "Flycam" },
          { id: "smartglass", label: "Kính thông minh" },
          { id: "tvbox", label: "TV Box" },
        ],
      },
    ],
  },
];

const _sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
export const flashSaleDeadline = _sevenDaysFromNow.toISOString();

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
