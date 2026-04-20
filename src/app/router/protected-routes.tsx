import type { RouteObject } from "react-router-dom";

import { RequireAuth } from "@/app/router/route-guards";
import { AccountPage } from "@/pages/account/account-page";
import { CartPage } from "@/pages/cart/cart-page";
import { CheckoutPage } from "@/pages/checkout/checkout-page";
import { SellerHubPage } from "@/pages/seller/seller-hub-page";
import { SellerProductNewPage } from "@/pages/seller/seller-product-new-page";
import { SellerProductsPage } from "@/pages/seller/seller-products-page";

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
        path: "/seller",
        element: <SellerHubPage />,
        handle: { title: "Seller Hub" },
      },
      {
        path: "/seller/products",
        element: <SellerProductsPage />,
        handle: { title: "Manage Products" },
      },
      {
        path: "/seller/products/new",
        element: <SellerProductNewPage />,
        handle: { title: "Upload Product" },
      },
    ],
  },
];
