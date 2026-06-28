import type { RouteObject } from "react-router-dom";

import {
  RequireAdmin,
  RequireAuth,
  RequireSeller,
  RequireShipper,
} from "@/app/router/route-guards";
import { SellerLayout } from "@/features/seller/components/seller-layout";
import { AccountPage } from "@/pages/account/account-page";
import { AdminAnalyticsPage } from "@/pages/admin/admin-analytics";
import { AdminBrandsPage } from "@/pages/admin/admin-brands";
import { AdminCategoriesPage } from "@/pages/admin/admin-categories";
import { AdminDashboardPage } from "@/pages/admin/admin-dashboard";
import {
  AdminOrderDetailPage,
  AdminOrdersPage,
} from "@/pages/admin/admin-orders";
import { AdminReturnsPage } from "@/pages/admin/admin-returns/admin-returns-page";
import { AdminRevenuePage } from "@/pages/admin/admin-revenue/admin-revenue-page";
import { AdminSellersPage } from "@/pages/admin/admin-sellers";
import { AdminShipmentsPage } from "@/pages/admin/admin-shipments/admin-shipments-page";
import { AdminShippersPage } from "@/pages/admin/admin-shippers/admin-shippers-page";
import { AdminUsersPage } from "@/pages/admin/admin-users";
import { AdminVouchersPage } from "@/pages/admin/admin-vouchers";
import { AdminWithdrawalsPage } from "@/pages/admin/admin-withdrawals/admin-withdrawals-page";
import { CartPage } from "@/pages/cart/cart-page";
import { ChatPage } from "@/pages/chat/chat-page";
import { CheckoutPage } from "@/pages/checkout/checkout-page";
import { OrderDetailPage, OrdersPage } from "@/pages/orders";
import { SellerApplyPage } from "@/pages/seller/seller-apply";
import { SellerChatPage } from "@/pages/seller/seller-chat";
import { SellerDashboardPage } from "@/pages/seller/seller-dashboard";
import { SellerOrderDetailPage } from "@/pages/seller/seller-order-detail";
import { SellerOrdersPage } from "@/pages/seller/seller-orders";
import { SellerProductEditPage } from "@/pages/seller/seller-product-edit";
import { SellerProductNewPage } from "@/pages/seller/seller-product-new";
import { SellerProductsPage } from "@/pages/seller/seller-products";
import { SellerReturnsPage } from "@/pages/seller/seller-returns/seller-returns-page";
import { SellerWalletPage } from "@/pages/seller/seller-wallet/seller-wallet-page";
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
        handle: { title: "Tài khoản của tôi" },
      },
      {
        path: "/cart",
        element: <CartPage />,
        handle: { title: "Giỏ hàng" },
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
        handle: { title: "Thanh toán" },
      },
      {
        path: "/orders",
        element: <OrdersPage />,
        handle: { title: "Đơn hàng của tôi" },
      },
      {
        path: "/orders/:orderId",
        element: <OrderDetailPage />,
        handle: { title: "Chi tiết đơn hàng" },
      },
      {
        path: "/seller/apply",
        element: <SellerApplyPage />,
        handle: { title: "Đăng ký bán hàng" },
      },
      {
        path: "/shipper/apply",
        element: <ShipperApplyPage />,
        handle: { title: "Đăng ký Shipper" },
      },
      {
        path: "/shipper/pending",
        element: <ShipperPendingPage />,
        handle: { title: "Đơn đang chờ duyệt" },
      },
      {
        path: "/chat",
        element: <ChatPage />,
        handle: { title: "Tin nhắn" },
      },
      {
        path: "/chat/:conversationId",
        element: <ChatPage />,
        handle: { title: "Tin nhắn" },
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
            handle: { title: "Tổng quan người bán" },
          },
          {
            path: "/seller/orders",
            element: <SellerOrdersPage />,
            handle: { title: "Đơn hàng của shop" },
          },
          {
            path: "/seller/orders/:groupId",
            element: <SellerOrderDetailPage />,
            handle: { title: "Chi tiết đơn hàng" },
          },
          {
            path: "/seller/products",
            element: <SellerProductsPage />,
            handle: { title: "Quản lý sản phẩm" },
          },
          {
            path: "/seller/products/new",
            element: <SellerProductNewPage />,
            handle: { title: "Đăng sản phẩm" },
          },
          {
            path: "/seller/products/:productId/edit",
            element: <SellerProductEditPage />,
            handle: { title: "Chỉnh sửa sản phẩm" },
          },
          {
            path: "/seller/chat",
            element: <SellerChatPage />,
            handle: { title: "Tin nhắn người bán" },
          },
          {
            path: "/seller/chat/:conversationId",
            element: <SellerChatPage />,
            handle: { title: "Tin nhắn người bán" },
          },
          {
            path: "/seller/wallet",
            element: <SellerWalletPage />,
            handle: { title: "Ví của tôi" },
          },
          {
            path: "/seller/returns",
            element: <SellerReturnsPage />,
            handle: { title: "Yêu cầu đổi/trả" },
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
        handle: { title: "Đơn giao của tôi" },
      },
      {
        path: "/shipper/shipments",
        element: <ShipperShipmentsPage />,
        handle: { title: "Đơn giao của tôi" },
      },
    ],
  },
  {
    element: <RequireAdmin />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboardPage />,
        handle: { title: "Tổng quan quản trị" },
      },
      {
        path: "/admin/sellers",
        element: <AdminSellersPage />,
        handle: { title: "Đăng ký người bán" },
      },
      {
        path: "/admin/users",
        element: <AdminUsersPage />,
        handle: { title: "Người dùng" },
      },
      {
        path: "/admin/orders",
        element: <AdminOrdersPage />,
        handle: { title: "Đơn hàng" },
      },
      {
        path: "/admin/orders/:orderId",
        element: <AdminOrderDetailPage />,
        handle: { title: "Chi tiết đơn hàng" },
      },
      {
        path: "/admin/categories",
        element: <AdminCategoriesPage />,
        handle: { title: "Danh mục" },
      },
      {
        path: "/admin/brands",
        element: <AdminBrandsPage />,
        handle: { title: "Thương hiệu" },
      },
      {
        path: "/admin/vouchers",
        element: <AdminVouchersPage />,
        handle: { title: "Mã giảm giá" },
      },
      {
        path: "/admin/revenue",
        element: <AdminRevenuePage />,
        handle: { title: "Doanh thu & Hoa hồng" },
      },
      {
        path: "/admin/analytics",
        element: <AdminAnalyticsPage />,
        handle: { title: "Thống kê AI" },
      },
      {
        path: "/admin/withdrawals",
        element: <AdminWithdrawalsPage />,
        handle: { title: "Yêu cầu rút tiền" },
      },
      {
        path: "/admin/shippers",
        element: <AdminShippersPage />,
        handle: { title: "Shipper" },
      },
      {
        path: "/admin/shipments",
        element: <AdminShipmentsPage />,
        handle: { title: "Đơn giao" },
      },
      {
        path: "/admin/returns",
        element: <AdminReturnsPage />,
        handle: { title: "Yêu cầu đổi/trả" },
      },
    ],
  },
];
