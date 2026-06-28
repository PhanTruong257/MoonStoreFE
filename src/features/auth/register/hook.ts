import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "@/app/app-store";
import type { AuthState } from "@/features/auth/auth-slice";
import { authActions } from "@/features/auth/auth-slice";

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
}

export const useRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const selectAuth = (state: RootState): AuthState => state.auth;
  const { user, isLoading, error: authError } = useSelector(selectAuth);

  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  const setField = (field: keyof RegisterFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (user) {
      void navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const submit = () => {
    if (!form.name || !form.email || !form.password) {
      setLocalError("Vui lòng điền đầy đủ các trường bắt buộc.");
      return false;
    }

    setLocalError("");
    dispatch(authActions.clearAuthError());
    dispatch(
      authActions.registerRequested({
        fullName: form.name,
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
