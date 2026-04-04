import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "@/app/app-store";
import type { AuthState } from "@/features/auth/auth-slice";
import { authActions } from "@/features/auth/auth-slice";

interface LoginFormState {
  email: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    isLoading,
    error: authError,
  } = useSelector<RootState, AuthState>((state) => state.auth);

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  const setField = (field: keyof LoginFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (user) {
      const state = location.state as { from?: string } | null;
      const target =
        state?.from && state.from !== "/login" ? state.from : "/home";
      void navigate(target, { replace: true });
    }
  }, [user, navigate, location.state]);

  const submit = () => {
    if (!form.email || !form.password) {
      setLocalError("Please enter email and password.");
      return false;
    }

    setLocalError("");
    dispatch(authActions.clearAuthError());
    dispatch(
      authActions.loginRequested({
        email: form.email,
        password: form.password,
      }),
    );
    return true;
  };

  const error = localError || authError || "";

  return {
    form,
    error,
    isSubmitting: isLoading,
    setField,
    submit,
  };
};
