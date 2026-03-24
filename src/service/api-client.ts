import axios from 'axios'

import { env } from '@/config/env'
import { STORAGE_KEYS } from '@/constants/storage-keys'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 8000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
