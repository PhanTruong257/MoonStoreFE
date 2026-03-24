import { STORAGE_KEYS } from '@/constants/storage-keys'

export const tokenStorage = {
  get: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  set: (token: string) => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  clear: () => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
}
