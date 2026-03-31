import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "@/features/auth/auth-api";
import { getAuthErrorMessage } from "@/features/auth/auth-errors";
import { setStoredUser } from "@/features/auth/auth-storage";

interface LoginFormState {
  email: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const setField = (field: keyof LoginFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return false;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const user = await login({ email: form.email, password: form.password });
      setStoredUser(user);
      void navigate("/", { replace: true });
      return true;
    } catch (error) {
      setError(getAuthErrorMessage(error, "Login failed."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    error,
    isSubmitting,
    setField,
    submit,
  };
};
