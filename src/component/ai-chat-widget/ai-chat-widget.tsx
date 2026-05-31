import { useRef, useEffect, type KeyboardEvent } from "react";

import styles from "./ai-chat-widget.module.scss";
import { useAiChat } from "./use-ai-chat";

export const AiChatWidget = () => {
  const { isOpen, toggleOpen, messages, input, setInput, sendMessage, isLoading, clearMessages } =
    useAiChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <div className={styles.widget}>
      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>🤖</div>
              <div>
                <div className={styles.headerName}>Moon AI</div>
                <div className={styles.headerSub}>Trợ lý tư vấn sản phẩm</div>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={clearMessages}
                className={styles.iconBtn}
                title="Xoá lịch sử"
                aria-label="Xoá lịch sử chat"
              >
                🗑
              </button>
              <button
                type="button"
                onClick={toggleOpen}
                className={styles.iconBtn}
                title="Đóng"
                aria-label="Đóng chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className={styles.messages}>
            {messages.length === 0 && (
              <div className={styles.welcome}>
                <div className={styles.welcomeAvatar}>🤖</div>
                <p>Xin chào! Tôi có thể giúp bạn tìm sản phẩm phù hợp.</p>
                <p>Hỏi tôi về sản phẩm, giá cả, hoặc tư vấn mua sắm nhé!</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.role === "user" ? styles.userMessage : styles.assistantMessage}`}
              >
                {msg.role === "assistant" && (
                  <div className={styles.msgAvatar}>🤖</div>
                )}
                <div className={styles.bubble}>
                  {msg.content}
                  {msg.isStreaming && <span className={styles.cursor} />}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          <div className={styles.composer}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi... (Enter để gửi)"
              disabled={isLoading}
              rows={1}
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => void sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className={styles.sendBtn}
              aria-label="Gửi"
            >
              {isLoading ? (
                <span className={styles.spinner} />
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggleOpen}
        className={styles.fab}
        aria-label={isOpen ? "Đóng AI chat" : "Mở AI chat"}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        )}
        {!isOpen && <span className={styles.fabLabel}>AI Chat</span>}
      </button>
    </div>
  );
};
