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
        handle: { title: "Home" },
      },
      {
        path: "/login",
        element: <AuthPage />,
        handle: { title: "Login" },
      },
      {
        path: "/register",
        element: <AuthPage />,
        handle: { title: "Register" },
      },
    ],
  },
  {
    path: "/home",
    element: <HomePage />,
    handle: { title: "Home" },
  },
  {
    path: "/categories",
    element: <HomePage />,
    handle: { title: "Categories" },
  },
  {
    path: "/about",
    element: <AboutPage />,
    handle: { title: "About" },
  },
  {
    path: "/contact",
    element: <ContactPage />,
    handle: { title: "Contact" },
  },
  {
    path: "/product/:productId",
    element: <ProductDetailPage />,
    handle: { title: "Product Detail" },
  },
  {
    path: "/shop/:sellerId",
    element: <ShopPage />,
    handle: { title: "Shop" },
  },
  {
    path: "/payment/result",
    element: <PaymentResultPage />,
    handle: { title: "Payment Result" },
  },
  {
    path: "/so-sanh",
    element: <CompareProductsPage />,
    handle: { title: "So sánh sản phẩm" },
  },
  {
    path: "/:categorySlug",
    element: <HomePage />,
    handle: { title: "Category Products" },
  },
];
