import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import type { RootState } from "@/app/app-store";
import { appConfig } from "@/app/config/app-config";

export const RequireAuth = () => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
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

export const RequireSeller = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role !== "seller") {
    return <Navigate to="/seller/apply" replace />;
  }

  return <Outlet />;
};

export const RequireAdmin = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
