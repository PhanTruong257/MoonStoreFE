import type { RouteObject } from "react-router-dom";

import {
  RequireAdmin,
  RequireAuth,
  RequireSeller,
} from "@/app/router/route-guards";
import { AccountPage } from "@/pages/account/account-page";
import { AdminBrandsPage } from "@/pages/admin/admin-brands";
import { AdminCategoriesPage } from "@/pages/admin/admin-categories";
import { AdminDashboardPage } from "@/pages/admin/admin-dashboard";
import {
  AdminOrderDetailPage,
  AdminOrdersPage,
} from "@/pages/admin/admin-orders";
import { AdminSellersPage } from "@/pages/admin/admin-sellers";
import { AdminUsersPage } from "@/pages/admin/admin-users";
import { AdminVouchersPage } from "@/pages/admin/admin-vouchers";
import { CartPage } from "@/pages/cart/cart-page";
import { CheckoutPage } from "@/pages/checkout/checkout-page";
import { OrderDetailPage, OrdersPage } from "@/pages/orders";
import { SellerApplyPage } from "@/pages/seller/seller-apply";
import { SellerDashboardPage } from "@/pages/seller/seller-dashboard";
import { SellerOrderDetailPage } from "@/pages/seller/seller-order-detail";
import { SellerOrdersPage } from "@/pages/seller/seller-orders";
import { SellerProductEditPage } from "@/pages/seller/seller-product-edit";
import { SellerProductNewPage } from "@/pages/seller/seller-product-new";
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
        path: "/orders",
        element: <OrdersPage />,
        handle: { title: "My Orders" },
      },
      {
        path: "/orders/:orderId",
        element: <OrderDetailPage />,
        handle: { title: "Order Detail" },
      },
      {
        path: "/seller/apply",
        element: <SellerApplyPage />,
        handle: { title: "Become a Seller" },
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
        path: "/seller/products/new",
        element: <SellerProductNewPage />,
        handle: { title: "Upload Product" },
      },
      {
        path: "/seller/products/:productId/edit",
        element: <SellerProductEditPage />,
        handle: { title: "Edit Product" },
      },
    ],
  },
  {
    element: <RequireAdmin />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboardPage />,
        handle: { title: "Admin Dashboard" },
      },
      {
        path: "/admin/sellers",
        element: <AdminSellersPage />,
        handle: { title: "Seller Applications" },
      },
      {
        path: "/admin/users",
        element: <AdminUsersPage />,
        handle: { title: "Users" },
      },
      {
        path: "/admin/orders",
        element: <AdminOrdersPage />,
        handle: { title: "Orders" },
      },
      {
        path: "/admin/orders/:orderId",
        element: <AdminOrderDetailPage />,
        handle: { title: "Order Detail" },
      },
      {
        path: "/admin/categories",
        element: <AdminCategoriesPage />,
        handle: { title: "Categories" },
      },
      {
        path: "/admin/brands",
        element: <AdminBrandsPage />,
        handle: { title: "Brands" },
      },
      {
        path: "/admin/vouchers",
        element: <AdminVouchersPage />,
        handle: { title: "Vouchers" },
      },
    ],
  },
];
