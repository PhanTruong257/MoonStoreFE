import { Button } from "antd";
import type { MouseEventHandler, ReactNode } from "react";

import styles from "./shared-button.module.scss";
import { useSharedButton } from "./use-shared-button";

type SharedButtonProps = {
  label: string;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "default" | "text";
  htmlType?: "button" | "submit" | "reset";
  block?: boolean;
  icon?: ReactNode;
};

export const SharedButton = ({
  label,
  onClick,
  className,
  disabled,
  variant = "default",
  htmlType = "button",
  block,
  icon,
}: SharedButtonProps) => {
  const { antdType, mergedClassName } = useSharedButton({
    className,
    variant,
  });

  const variantClassName = variant === "primary" ? styles.primary : variant === "text" ? styles.text : "";

  return (
    <Button
      type={antdType}
      htmlType={htmlType}
      disabled={disabled}
      block={block}
      icon={icon}
      onClick={onClick}
      className={`${styles.button} ${variantClassName} ${mergedClassName}`.trim()}
    >
      {label}
    </Button>
  );
};
