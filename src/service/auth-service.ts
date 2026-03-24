import { MOCK_USER } from '@/constants/mock-data'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/global-types'
import { apiClient } from '@/service/api-client'
import { API_ENDPOINTS } from '@/service/api-endpoints'

const buildMockAuth = (email: string): AuthResponse => ({
  accessToken: 'mock-token',
  user: {
    ...MOCK_USER,
    email,
  },
})

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, payload)
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken)
      return response.data
    } catch {
      const mockAuth = buildMockAuth(payload.email)
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockAuth.accessToken)
      return mockAuth
    }
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER, payload)
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken)
      return response.data
    } catch {
      const mockAuth = buildMockAuth(payload.email)
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockAuth.accessToken)
      return mockAuth
    }
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  },
}
