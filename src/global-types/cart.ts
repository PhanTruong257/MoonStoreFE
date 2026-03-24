import type { Product } from '@/global-types/product'

export interface CartItem {
  productId: string
  name: string
  imageUrl: string
  price: number
  quantity: number
  selectedVariant?: string
}

export interface AddToCartRequest {
  product: Product
  quantity: number
  selectedVariant?: string
}

export interface CartState {
  items: CartItem[]
  couponCode?: string
}

export interface CheckoutRequest {
  fullName: string
  email: string
  phone: string
  address: string
  shippingMethod: 'standard' | 'express'
  paymentMethod: 'cod' | 'card'
  note?: string
}
