import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { UserProfile } from '@/global-types'

interface AuthState {
  accessToken?: string
  user?: UserProfile
  isAuthenticated: boolean
}

const initialState: AuthState = {
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ accessToken: string; user: UserProfile }>,
    ) => {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.accessToken = undefined
      state.user = undefined
      state.isAuthenticated = false
    },
  },
})

export const { setAuth, logout } = authSlice.actions
export const authReducer = authSlice.reducer
