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

  const submit = () => {
    if (!form.email || !form.password) {
      setError("Please enter email and password.");
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
