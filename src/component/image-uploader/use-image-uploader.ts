import { useCallback, useRef, useState } from "react";

import { extractApiErrorMessage } from "@/app/utils/error-message";
import { IMAGE_UPLOADER_TEXT } from "@/const/image-uploader.const";
import { uploadImage } from "@/services/uploads-service";

type UseImageUploaderArgs = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
};

export const useImageUploader = ({
  value,
  onChange,
  disabled,
}: UseImageUploaderArgs) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const openPicker = useCallback(() => {
    if (disabled || isUploading) return;
    inputRef.current?.click();
  }, [disabled, isUploading]);

  const handleFile = useCallback(
    async (file: File | null | undefined) => {
      if (!file) return;
      setError("");
      setIsUploading(true);
      try {
        const result = await uploadImage(file);
        onChange(result.url);
      } catch (err) {
        setError(
          extractApiErrorMessage(err, IMAGE_UPLOADER_TEXT.uploadFailed),
        );
      } finally {
        setIsUploading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [onChange],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      void handleFile(event.target.files?.[0]);
    },
    [handleFile],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (disabled || isUploading) return;
      void handleFile(event.dataTransfer.files?.[0]);
    },
    [disabled, isUploading, handleFile],
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const clear = useCallback(() => {
    if (disabled || isUploading) return;
    onChange("");
    setError("");
  }, [disabled, isUploading, onChange]);

  return {
    inputRef,
    isUploading,
    error,
    hasImage: Boolean(value),
    openPicker,
    handleChange,
    handleDrop,
    handleDragOver,
    clear,
  };
};
