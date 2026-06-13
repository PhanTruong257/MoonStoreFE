import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { resolveImageUrl } from "@/app/utils/image-url";

import styles from "./message-thread.module.scss";

import { formatChatTime } from "@/const/chat.const";
import type { ChatConversation, ChatMessage } from "@/services/chat-service";

type MessageThreadProps = {
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentUserId: number;
  viewerRole: "buyer" | "seller";
};

const buildProductLink = (productId: number) => `/product/${productId}`;

export const MessageThread = ({
  conversation,
  messages,
  isLoading,
  error,
  currentUserId,
  viewerRole,
}: MessageThreadProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages.length, conversation?.id]);

  if (!conversation) {
    if (isLoading) {
      return <div className={styles.empty}>Đang tải...</div>;
    }
    if (error) {
      return <div className={styles.error}>{error}</div>;
    }
    return (
      <div className={styles.empty}>
        Chọn một cuộc trò chuyện để bắt đầu nhắn tin.
      </div>
    );
  }

  const peerName =
    viewerRole === "buyer"
      ? conversation.seller.shopName
      : conversation.buyer.fullName;

  return (
    <section className={styles.thread}>
      <header className={styles.header}>
        <div>
          <h2>{peerName}</h2>
          {conversation.product ? (
            <Link
              to={buildProductLink(conversation.product.id)}
              className={styles.productLink}
            >
              <img
                src={resolveImageUrl(conversation.product.imageUrl)}
                alt={conversation.product.name}
              />
              <span>{conversation.product.name}</span>
            </Link>
          ) : null}
        </div>
      </header>

      <div className={styles.messages} ref={scrollRef}>
        {messages.length === 0 && !isLoading ? (
          <div className={styles.placeholder}>
            Chưa có tin nhắn. Hãy gửi lời chào đầu tiên.
          </div>
        ) : null}
        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId;
          const cls = `${styles.message} ${isOwn ? styles.own : styles.other}`;
          return (
            <div key={message.id} className={cls}>
              {!isOwn ? (
                <div className={styles.senderName}>{message.senderName}</div>
              ) : null}
              <div className={styles.bubble}>{message.content}</div>
              <div className={styles.meta}>
                <span>{formatChatTime(message.createdAt)}</span>
                {isOwn ? (
                  <span className={styles.readMark}>
                    {message.isRead ? "Đã đọc" : "Đã gửi"}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
