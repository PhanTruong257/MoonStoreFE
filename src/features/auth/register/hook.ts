import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      void navigate("/login", { replace: true });
      return true;
    } catch {
      setError("Registration failed. Please try again.");
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
