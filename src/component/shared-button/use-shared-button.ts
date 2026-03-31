import { useMemo } from "react";

type Variant = "primary" | "default" | "text";

type UseSharedButtonParams = {
  className?: string;
  variant: Variant;
};

export const useSharedButton = ({ className, variant }: UseSharedButtonParams) => {
  const antdType = useMemo(() => {
    if (variant === "primary") {
      return "primary" as const;
    }

    return "default" as const;
  }, [variant]);

  const mergedClassName = useMemo(() => {
    return className ? `${className}` : "";
  }, [className]);

  return {
    antdType,
    mergedClassName,
  };
};
