export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_PROFILE: '/users/me',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (productId: string) => `/products/${productId}`,
  CART: '/cart',
  ORDERS: '/orders',
  ORDER_DETAIL: (orderId: string) => `/orders/${orderId}`,
} as const
