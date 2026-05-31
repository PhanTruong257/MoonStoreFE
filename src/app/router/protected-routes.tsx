import type { RouteObject } from "react-router-dom";

import {
  RequireAdmin,
  RequireAuth,
  RequireSeller,
  RequireShipper,
} from "@/app/router/route-guards";
import { AccountPage } from "@/pages/account/account-page";
import { AdminBrandsPage } from "@/pages/admin/admin-brands";
import { AdminCategoriesPage } from "@/pages/admin/admin-categories";
import { AdminDashboardPage } from "@/pages/admin/admin-dashboard";
import {
  AdminOrderDetailPage,
  AdminOrdersPage,
} from "@/pages/admin/admin-orders";
import { AdminRefundsPage } from "@/pages/admin/admin-refunds/admin-refunds-page";
import { AdminReturnsPage } from "@/pages/admin/admin-returns/admin-returns-page";
import { AdminRevenuePage } from "@/pages/admin/admin-revenue/admin-revenue-page";
import { AdminSellersPage } from "@/pages/admin/admin-sellers";
import { AdminShippersPage } from "@/pages/admin/admin-shippers/admin-shippers-page";
import { AdminUsersPage } from "@/pages/admin/admin-users";
import { AdminVouchersPage } from "@/pages/admin/admin-vouchers";
import { AdminWithdrawalsPage } from "@/pages/admin/admin-withdrawals/admin-withdrawals-page";
import { SellerWalletPage } from "@/pages/seller/seller-wallet/seller-wallet-page";
import { CartPage } from "@/pages/cart/cart-page";
import { ChatPage } from "@/pages/chat/chat-page";
import { CheckoutPage } from "@/pages/checkout/checkout-page";
import { OrderDetailPage, OrdersPage } from "@/pages/orders";
import { SellerLayout } from "@/features/seller/components/seller-layout";
import { SellerApplyPage } from "@/pages/seller/seller-apply";
import { SellerChatPage } from "@/pages/seller/seller-chat";
import { SellerDashboardPage } from "@/pages/seller/seller-dashboard";
import { SellerOrderDetailPage } from "@/pages/seller/seller-order-detail";
import { SellerOrdersPage } from "@/pages/seller/seller-orders";
import { SellerProductEditPage } from "@/pages/seller/seller-product-edit";
import { SellerProductNewPage } from "@/pages/seller/seller-product-new";
import { SellerProductsPage } from "@/pages/seller/seller-products";
import { SellerReturnsPage } from "@/pages/seller/seller-returns/seller-returns-page";
import { ShipperApplyPage } from "@/pages/shipper/shipper-apply/shipper-apply-page";
import { ShipperPendingPage } from "@/pages/shipper/shipper-pending/shipper-pending-page";
import { ShipperShipmentsPage } from "@/pages/shipper/shipper-shipments/shipper-shipments-page";

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
      {
        path: "/shipper/apply",
        element: <ShipperApplyPage />,
        handle: { title: "Become a Shipper" },
      },
      {
        path: "/shipper/pending",
        element: <ShipperPendingPage />,
        handle: { title: "Application Pending" },
      },
      {
        path: "/chat",
        element: <ChatPage />,
        handle: { title: "Messages" },
      },
      {
        path: "/chat/:conversationId",
        element: <ChatPage />,
        handle: { title: "Messages" },
      },
    ],
  },
  {
    element: <RequireSeller />,
    children: [
      {
        // SellerLayout render 1 lần, Outlet thay content → không giật khi navigate
        element: <SellerLayout />,
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
          {
            path: "/seller/chat",
            element: <SellerChatPage />,
            handle: { title: "Seller Messages" },
          },
          {
            path: "/seller/chat/:conversationId",
            element: <SellerChatPage />,
            handle: { title: "Seller Messages" },
          },
          {
            path: "/seller/wallet",
            element: <SellerWalletPage />,
            handle: { title: "My Wallet" },
          },
          {
            path: "/seller/returns",
            element: <SellerReturnsPage />,
            handle: { title: "Return Requests" },
          },
        ],
      },
    ],
  },
  {
    element: <RequireShipper />,
    children: [
      {
        path: "/shipper",
        element: <ShipperShipmentsPage />,
        handle: { title: "My Shipments" },
      },
      {
        path: "/shipper/shipments",
        element: <ShipperShipmentsPage />,
        handle: { title: "My Shipments" },
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
      {
        path: "/admin/revenue",
        element: <AdminRevenuePage />,
        handle: { title: "Revenue & Commission" },
      },
      {
        path: "/admin/refunds",
        element: <AdminRefundsPage />,
        handle: { title: "Refund Requests" },
      },
      {
        path: "/admin/withdrawals",
        element: <AdminWithdrawalsPage />,
        handle: { title: "Withdrawal Requests" },
      },
      {
        path: "/admin/shippers",
        element: <AdminShippersPage />,
        handle: { title: "Shippers" },
      },
      {
        path: "/admin/returns",
        element: <AdminReturnsPage />,
        handle: { title: "Return Requests" },
      },
    ],
  },
];
