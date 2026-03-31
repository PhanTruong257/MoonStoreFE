import { Navigate, Outlet } from "react-router-dom";

import { appConfig } from "@/app/config/app-config";
import { getStoredUser } from "@/features/auth/auth-storage";

const isAuthenticated = () => {
  return Boolean(getStoredUser());
};

export const RequireAuth = () => {
  if (!isAuthenticated()) {
    return <Navigate to={appConfig.loginPath} replace />;
  }

  return <Outlet />;
};
