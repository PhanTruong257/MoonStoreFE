import { MOCK_USER } from '@/constants/mock-data'
import type { UserProfile } from '@/global-types'
import { apiClient } from '@/service/api-client'
import { API_ENDPOINTS } from '@/service/api-endpoints'

export const userService = {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>(API_ENDPOINTS.AUTH_PROFILE)
      return response.data
    } catch {
      return MOCK_USER
    }
  },
}
