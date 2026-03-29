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

  const submit = () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill all required fields.");
      return false;
    }

    setError("");
    setIsSubmitting(true);
    void navigate("/login", { replace: true });
    setIsSubmitting(false);
    return true;
  };

  return {
    form,
    error,
    isSubmitting,
    setField,
    submit,
  };
};
