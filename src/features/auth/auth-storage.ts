import type { AuthUser } from "@/features/auth/auth-api";

const STORAGE_KEY = "auth_user";

export const getStoredUser = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const setStoredUser = (user: AuthUser | null) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};
