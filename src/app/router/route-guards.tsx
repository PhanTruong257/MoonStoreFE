import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import type { RootState } from "@/app/app-store";
import { dispatchOpenLoginModal } from "@/app/utils/login-modal-event";

export const RequireAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      dispatchOpenLoginModal();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return <Outlet />;
};

export const RequireSeller = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      dispatchOpenLoginModal();
    }
  }, [user]);

  if (!user) {
    return null;
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

  useEffect(() => {
    if (!user) {
      dispatchOpenLoginModal();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const RequireShipper = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      dispatchOpenLoginModal();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role !== "shipper") {
    return <Navigate to="/shipper/apply" replace />;
  }

  return <Outlet />;
};

export const RedirectByRole = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  if (user?.role === "seller") return <Navigate to="/seller" replace />;
  if (user?.role === "shipper") return <Navigate to="/shipper/shipments" replace />;

  return <Outlet />;
};
