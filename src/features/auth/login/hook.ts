import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      void navigate("/login", { replace: true });
      return true;
    } catch {
      setError("Login failed. Please try again.");
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
