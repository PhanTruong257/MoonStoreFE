import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { AboutPage } from "@/pages/about/about-page";
import { AuthPage } from "@/pages/auth/auth-page";
import { ContactPage } from "@/pages/contact/contact-page";
import { HomePage } from "@/pages/home/home-page";
import { ProductDetailPage } from "@/pages/product/product-detail-page";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/home" replace />,
    handle: { title: "Home" },
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
  {
    path: "/:categorySlug",
    element: <HomePage />,
    handle: { title: "Category Products" },
  },
];
