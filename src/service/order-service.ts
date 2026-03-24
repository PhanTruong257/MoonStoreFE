import { MOCK_ORDERS } from '@/constants/mock-data'
import type { CreateOrderRequest, CreateOrderResponse, Order } from '@/global-types'
import { apiClient } from '@/service/api-client'
import { API_ENDPOINTS } from '@/service/api-endpoints'

export const orderService = {
  async checkout(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await apiClient.post<CreateOrderResponse>(API_ENDPOINTS.ORDERS, payload)
      return response.data
    } catch {
      const order: Order = {
        id: `mock-${Date.now()}`,
        code: `ORD${Date.now().toString().slice(-6)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        items: payload.items,
        total: payload.total,
        shippingFee: payload.shippingFee,
        discount: payload.discount,
        customer: payload.customer,
      }

      return { order }
    }
  },

  async getOrderHistory(): Promise<Order[]> {
    try {
      const response = await apiClient.get<Order[]>(API_ENDPOINTS.ORDERS)
      return response.data
    } catch {
      return MOCK_ORDERS
    }
  },
}
