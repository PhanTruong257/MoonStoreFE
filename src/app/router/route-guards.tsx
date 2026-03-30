import { Navigate, Outlet } from "react-router-dom";

import { appConfig } from "@/app/config/app-config";

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("auth_token"));
};

export const RequireAuth = () => {
  if (!isAuthenticated()) {
    return <Navigate to={appConfig.loginPath} replace />;
  }

  return <Outlet />;
};
