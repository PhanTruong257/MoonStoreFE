import { Navigate, Outlet, useLocation } from "react-router-dom";

import { appConfig } from "@/app/config/app-config";
import { getStoredUser } from "@/features/auth/auth-storage";

const isAuthenticated = () => {
  return Boolean(getStoredUser());
};

export const RequireAuth = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to={appConfig.loginPath}
        replace
        state={{
          from: `${location.pathname}${location.search}${location.hash}`,
        }}
      />
    );
  }

  return <Outlet />;
};
