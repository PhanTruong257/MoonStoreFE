import { Input } from "antd";
import type { ChangeEventHandler } from "react";

import styles from "./shared-input.module.scss";
import { INPUT_DEFAULT_ROWS, useSharedInput } from "./use-shared-input";

type SharedInputKind = "text" | "email" | "password" | "textarea";

type SharedInputProps = {
  id?: string;
  name?: string;
  value: string;
  placeholder: string;
  kind?: SharedInputKind;
  className?: string;
  disabled?: boolean;
  rows?: number;
  ariaLabel?: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export const SharedInput = ({
  id,
  name,
  value,
  placeholder,
  kind = "text",
  className,
  disabled,
  rows = INPUT_DEFAULT_ROWS,
  ariaLabel,
  onChange,
}: SharedInputProps) => {
  const { isPassword, isTextArea, mergedClassName } = useSharedInput({
    className,
    kind,
  });

  if (isTextArea) {
    return (
      <Input.TextArea
        id={id}
        name={name}
        value={value}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel ?? placeholder}
        onChange={onChange}
        className={`${styles.textarea} ${mergedClassName}`.trim()}
      />
    );
  }

  if (isPassword) {
    return (
      <Input.Password
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel ?? placeholder}
        onChange={onChange}
        className={`${styles.password} ${mergedClassName}`.trim()}
      />
    );
  }

  return (
    <Input
      id={id}
      name={name}
      value={value}
      type={kind}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel ?? placeholder}
      onChange={onChange}
      className={`${styles.input} ${mergedClassName}`.trim()}
    />
  );
};
