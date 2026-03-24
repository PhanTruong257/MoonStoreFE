export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: UserProfile
}
