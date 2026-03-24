import type { CartItem, CheckoutRequest } from '@/global-types/cart'

export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'completed'

export interface Order {
  id: string
  code: string
  status: OrderStatus
  createdAt: string
  items: CartItem[]
  total: number
  shippingFee: number
  discount: number
  customer: CheckoutRequest
}

export interface CreateOrderRequest {
  customer: CheckoutRequest
  items: CartItem[]
  subtotal: number
  shippingFee: number
  discount: number
  total: number
}

export interface CreateOrderResponse {
  order: Order
}
