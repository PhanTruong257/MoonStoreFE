import type { AddToCartRequest, CartState } from '@/global-types'
import { apiClient } from '@/service/api-client'
import { API_ENDPOINTS } from '@/service/api-endpoints'

export const cartService = {
  async syncCart(cart: CartState): Promise<CartState> {
    try {
      const response = await apiClient.post<CartState>(API_ENDPOINTS.CART, cart)
      return response.data
    } catch {
      return cart
    }
  },

  async addToCart(request: AddToCartRequest): Promise<AddToCartRequest> {
    try {
      const response = await apiClient.post<AddToCartRequest>(API_ENDPOINTS.CART, request)
      return response.data
    } catch {
      return request
    }
  },
}
