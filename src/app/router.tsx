import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '@/core/auth/protected-route'
import { AccountPage } from '@/pages/account-page'
import { CartPage } from '@/pages/cart-page'
import { CategoryPage } from '@/pages/category-page'
import { CheckoutPage } from '@/pages/checkout-page'
import { HomePage } from '@/pages/home-page'
import { LoginPage } from '@/pages/login-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { OrderSuccessPage } from '@/pages/order-success-page'
import { ProductDetailPage } from '@/pages/product-detail-page'
import { RegisterPage } from '@/pages/register-page'

import { AppShell } from './app'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/category/:categoryId', element: <CategoryPage /> },
      { path: '/product/:productId', element: <ProductDetailPage /> },
      { path: '/cart', element: <CartPage /> },
      {
        path: '/checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      { path: '/order-success', element: <OrderSuccessPage /> },
      {
        path: '/account',
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
