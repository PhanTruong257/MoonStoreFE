import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "@/features/auth/auth-api";
import { getAuthErrorMessage } from "@/features/auth/auth-errors";
import { setStoredUser } from "@/features/auth/auth-storage";

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
}

export const useRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const setField = (field: keyof RegisterFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill all required fields.");
      return false;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const user = await register({
        fullName: form.name,
        email: form.email,
        password: form.password,
      });
      setStoredUser(user);
      void navigate("/", { replace: true });
      return true;
    } catch (error) {
      setError(getAuthErrorMessage(error, "Register failed."));
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
