import styles from "./image-uploader.module.scss";
import { useImageUploader } from "./use-image-uploader";

import {
  IMAGE_UPLOADER_ACCEPT,
  IMAGE_UPLOADER_TEXT,
} from "@/const/image-uploader.const";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
};

export const ImageUploader = ({
  value,
  onChange,
  disabled,
}: ImageUploaderProps) => {
  const {
    inputRef,
    isUploading,
    error,
    hasImage,
    openPicker,
    handleChange,
    handleDrop,
    handleDragOver,
    clear,
  } = useImageUploader({ value, onChange, disabled });

  return (
    <div className={styles.uploader}>
      <div className={styles.row}>
        {hasImage ? (
          <div className={styles.preview}>
            <img src={value} alt="" />
          </div>
        ) : null}

        <div
          className={`${styles.dropzone} ${
            disabled || isUploading ? styles.disabled : ""
          }`}
          onClick={openPicker}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openPicker();
            }
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_UPLOADER_ACCEPT}
            className={styles.fileInput}
            onChange={handleChange}
            disabled={disabled || isUploading}
          />
          <div className={styles.dropzoneIcon}>📷</div>
          <p className={styles.dropzoneText}>
            {isUploading
              ? IMAGE_UPLOADER_TEXT.uploading
              : IMAGE_UPLOADER_TEXT.dropHint}
          </p>
          <p className={styles.dropzoneHint}>{IMAGE_UPLOADER_TEXT.formatHint}</p>
        </div>
      </div>

      {hasImage && !isUploading ? (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.removeButton}
            onClick={clear}
            disabled={disabled}
          >
            {IMAGE_UPLOADER_TEXT.remove}
          </button>
        </div>
      ) : null}

      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
};
