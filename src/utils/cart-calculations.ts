import type { CartItem } from '@/global-types/cart'

export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export const calculateShippingFee = (
  subtotal: number,
  shippingMethod: 'standard' | 'express',
): number => {
  if (subtotal >= 1500000) {
    return 0
  }

  return shippingMethod === 'express' ? 60000 : 30000
}

export const calculateDiscount = (subtotal: number, couponCode?: string): number => {
  if (!couponCode) {
    return 0
  }

  if (couponCode.toUpperCase() === 'SAVE10') {
    return Math.floor(subtotal * 0.1)
  }

  return 0
}

export const calculateGrandTotal = (
  subtotal: number,
  shippingFee: number,
  discount: number,
): number => subtotal + shippingFee - discount
