import { http } from "@/app/api/http";

export type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  role: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
};

export const login = async (payload: LoginPayload) => {
  const response = await http.post<{ user: AuthUser }>("/auth/login", payload);
  return response.data.user;
};

export const register = async (payload: RegisterPayload) => {
  const response = await http.post<{ user: AuthUser }>(
    "/auth/register",
    payload,
  );
  return response.data.user;
};

export const fetchMe = async () => {
  const response = await http.get<{ user: AuthUser }>("/auth/me");
  return response.data.user;
};

export const logout = async () => {
  await http.post("/auth/logout");
};
