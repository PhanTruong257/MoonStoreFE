import type { RouteObject } from "react-router-dom";

import { RequireAuth, RequireSeller } from "@/app/router/route-guards";
import { AccountPage } from "@/pages/account/account-page";
import { CartPage } from "@/pages/cart/cart-page";
import { CheckoutPage } from "@/pages/checkout/checkout-page";
import { SellerDashboardPage } from "@/pages/seller/seller-dashboard";
import { SellerOrderDetailPage } from "@/pages/seller/seller-order-detail";
import { SellerOrdersPage } from "@/pages/seller/seller-orders";
import { SellerProductEditPage } from "@/pages/seller/seller-product-edit";
import { SellerProductNewPage } from "@/pages/seller/seller-product-new-page";
import { SellerProductsPage } from "@/pages/seller/seller-products";

export const protectedRoutes: RouteObject[] = [
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/account",
        element: <AccountPage />,
        handle: { title: "My Account" },
      },
      {
        path: "/cart",
        element: <CartPage />,
        handle: { title: "Cart" },
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
        handle: { title: "Checkout" },
      },
      {
        path: "/seller/products/new",
        element: <SellerProductNewPage />,
        handle: { title: "Upload Product" },
      },
    ],
  },
  {
    element: <RequireSeller />,
    children: [
      {
        path: "/seller",
        element: <SellerDashboardPage />,
        handle: { title: "Seller Dashboard" },
      },
      {
        path: "/seller/orders",
        element: <SellerOrdersPage />,
        handle: { title: "Seller Orders" },
      },
      {
        path: "/seller/orders/:groupId",
        element: <SellerOrderDetailPage />,
        handle: { title: "Order Detail" },
      },
      {
        path: "/seller/products",
        element: <SellerProductsPage />,
        handle: { title: "Manage Products" },
      },
      {
        path: "/seller/products/:productId/edit",
        element: <SellerProductEditPage />,
        handle: { title: "Edit Product" },
      },
    ],
  },
];
