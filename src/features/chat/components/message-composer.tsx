import { Input, Button, message as antMessage } from "antd";
import type { KeyboardEvent } from "react";
import { useState } from "react";

import styles from "./message-composer.module.scss";

import { MAX_CHAT_MESSAGE_LENGTH } from "@/const/chat.const";

type MessageComposerProps = {
  disabled: boolean;
  isSending: boolean;
  sendError: string | null;
  onSend: (content: string) => void;
};

export const MessageComposer = ({
  disabled,
  isSending,
  sendError,
  onSend,
}: MessageComposerProps) => {
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0) {
      return;
    }
    if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
      void antMessage.error(
        `Tin nhắn tối đa ${MAX_CHAT_MESSAGE_LENGTH} ký tự.`,
      );
      return;
    }
    onSend(trimmed);
    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.composer}>
      {sendError ? <p className={styles.error}>{sendError}</p> : null}
      <div className={styles.row}>
        <Input.TextArea
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          maxLength={MAX_CHAT_MESSAGE_LENGTH}
        />
        <Button
          type="primary"
          loading={isSending}
          disabled={disabled || draft.trim().length === 0}
          onClick={handleSend}
        >
          Gửi
        </Button>
      </div>
    </div>
  );
};
