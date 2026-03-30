import type { RouteObject } from "react-router-dom";

import { RequireAuth } from "@/app/router/route-guards";
import { AccountPage } from "@/pages/account/account-page";
import { CartPage } from "@/pages/cart/cart-page";
import { CheckoutPage } from "@/pages/checkout/checkout-page";

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
    ],
  },
];
