import type { RouteObject } from "react-router-dom";

import { AboutPage } from "@/pages/about/about-page";
import { AuthPage } from "@/pages/auth/auth-page";
import { ContactPage } from "@/pages/contact/contact-page";
import { HomePage } from "@/pages/home/home-page";
import { ProductDetailPage } from "@/pages/product/product-detail-page";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
    handle: { title: "Home" },
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
    path: "/login",
    element: <AuthPage />,
    handle: { title: "Login" },
  },
  {
    path: "/register",
    element: <AuthPage />,
    handle: { title: "Register" },
  },
  {
    path: "/product/:productId",
    element: <ProductDetailPage />,
    handle: { title: "Product Detail" },
  },
];
