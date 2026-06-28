import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { AboutPage } from "@/pages/about/about-page";
import { AuthPage } from "@/pages/auth/auth-page";
import { CompareProductsPage } from "@/pages/compare/compare-products-page";
import { ContactPage } from "@/pages/contact/contact-page";
import { HomePage } from "@/pages/home/home-page";
import { PaymentResultPage } from "@/pages/payment/payment-result-page";
import { ProductDetailPage } from "@/pages/product/product-detail-page";
import { ShopPage } from "@/pages/shop/shop-page/shop-page";
import { RedirectByRole } from "@/app/router/route-guards";

export const publicRoutes: RouteObject[] = [
  {
    element: <RedirectByRole />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" replace />,
        handle: { title: "Trang chủ" },
      },
      {
        path: "/login",
        element: <AuthPage />,
        handle: { title: "Đăng nhập" },
      },
      {
        path: "/register",
        element: <AuthPage />,
        handle: { title: "Đăng ký" },
      },
    ],
  },
  {
    path: "/home",
    element: <HomePage />,
    handle: { title: "Trang chủ" },
  },
  {
    path: "/categories",
    element: <HomePage />,
    handle: { title: "Danh mục" },
  },
  {
    path: "/about",
    element: <AboutPage />,
    handle: { title: "Giới thiệu" },
  },
  {
    path: "/contact",
    element: <ContactPage />,
    handle: { title: "Liên hệ" },
  },
  {
    path: "/product/:productId",
    element: <ProductDetailPage />,
    handle: { title: "Chi tiết sản phẩm" },
  },
  {
    path: "/shop/:sellerId",
    element: <ShopPage />,
    handle: { title: "Cửa hàng" },
  },
  {
    path: "/payment/result",
    element: <PaymentResultPage />,
    handle: { title: "Kết quả thanh toán" },
  },
  {
    path: "/so-sanh",
    element: <CompareProductsPage />,
    handle: { title: "So sánh sản phẩm" },
  },
  {
    path: "/:categorySlug",
    element: <HomePage />,
    handle: { title: "Sản phẩm theo danh mục" },
  },
];
