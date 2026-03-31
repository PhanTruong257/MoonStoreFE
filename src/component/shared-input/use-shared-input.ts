import { useMemo } from "react";

type InputKind = "text" | "email" | "password" | "textarea";

type UseSharedInputParams = {
  className?: string;
  kind: InputKind;
};

export const INPUT_DEFAULT_ROWS = 4;

export const useSharedInput = ({ className, kind }: UseSharedInputParams) => {
  const isPassword = kind === "password";
  const isTextArea = kind === "textarea";

  const mergedClassName = useMemo(() => {
    return className ? `${className}` : "";
  }, [className]);

  return {
    isPassword,
    isTextArea,
    mergedClassName,
  };
};
