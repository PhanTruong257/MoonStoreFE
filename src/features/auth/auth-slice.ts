import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { getStoredUser } from "./auth-storage";

import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/services/auth-service";

export type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: getStoredUser(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequested: (state, action: PayloadAction<LoginPayload>) => {
      void action.payload;
      state.isLoading = true;
      state.error = null;
    },
    loginSucceeded: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    registerRequested: (state, action: PayloadAction<RegisterPayload>) => {
      void action.payload;
      state.isLoading = true;
      state.error = null;
    },
    registerSucceeded: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    registerFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    logoutSucceeded: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
