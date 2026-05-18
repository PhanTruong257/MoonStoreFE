import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  fill: "currentColor",
};

export const SearchIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M11 4a7 7 0 1 0 4.9 12.1l3.5 3.5 1.4-1.4-3.5-3.5A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
  </svg>
);

export const UserIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" />
  </svg>
);

export const ChatIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7l-5 4V6a2 2 0 0 1 2-2zm3 6h10v2H7v-2zm0-3h10v2H7V7z" />
  </svg>
);

export const CartIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M7 6h14l-2 8H8L6.2 3H3v2h2l2.2 11h12.6l2.4-10H7V6zm1 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
  </svg>
);

export const HeartIcon = ({
  size = 24,
  filled = false,
  ...props
}: IconProps & { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const BellIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M12 2a7 7 0 0 0-7 7v4l-2 2v1h18v-1l-2-2V9a7 7 0 0 0-7-7zm0 18a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z" />
  </svg>
);

export const StarIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const DeliveryIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2a3 3 0 0 0 6 0h6a3 3 0 0 0 6 0h2v-5l-3-4zm-7 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-6H17V9.5l2.5 3.5H19z" />
  </svg>
);

export const ReturnIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M12 4V1L8 5l4 4V6a6 6 0 0 1 6 6 6 6 0 0 1-6 6 6 6 0 0 1-6-6H4a8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8z" />
  </svg>
);

export const CloseIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

export const ChevronRightIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

export const WalletIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M21 7H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-1 12H4V9h16v10zm-2-5h-2v-2h2v2zM3 5h18V3H3a1 1 0 0 0-1 1v1h1z" />
  </svg>
);

export const MenuHamburgerIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
  </svg>
);

export const ShopIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M20 4H4v2l-2 6v2h2v6h12v-6h2v-2l-2-6V4zm-6 14H8v-4h6v4zm4-8H4l1-4h14l1 4z" />
  </svg>
);

export const OrdersIcon = ({ size = 24, ...props }: IconProps) => (
  <svg {...base} width={size} height={size} {...props}>
    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </svg>
);
