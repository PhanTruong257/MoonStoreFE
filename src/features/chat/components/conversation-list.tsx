import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import styles from "./conversation-list.module.scss";

import type { AppDispatch } from "@/app/app-store";
import { formatChatRelativeDate } from "@/const/chat.const";
import { chatActions } from "@/features/chat/chat.slice";
import type { ChatConversation } from "@/services/chat-service";

type ConversationListProps = {
  conversations: ChatConversation[];
  activeId: number | null;
  isLoading: boolean;
  error: string | null;
  viewerRole: "buyer" | "seller";
  buildDetailPath: (id: number) => string;
  emptyText?: string;
};

const formatPreview = (conversation: ChatConversation, viewerRole: "buyer" | "seller") => {
  const last = conversation.lastMessage;
  if (!last) {
    return viewerRole === "buyer" ? "Bắt đầu trò chuyện" : "Chưa có tin nhắn";
  }
  const isViewerLast = viewerRole === "buyer"
    ? last.senderId === conversation.buyerId
    : last.senderId === conversation.seller.userId;
  const prefix = isViewerLast ? "Bạn: " : "";
  return `${prefix}${last.content}`;
};

export const ConversationList = ({
  conversations,
  activeId,
  isLoading,
  error,
  viewerRole,
  buildDetailPath,
  emptyText,
}: ConversationListProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSelect = (conversation: ChatConversation) => {
    dispatch(chatActions.conversationDetailRequested(conversation.id));
    void navigate(buildDetailPath(conversation.id));
  };

  if (isLoading && conversations.length === 0) {
    return (
      <aside className={styles.list}>
        <div className={styles.placeholder}>Đang tải...</div>
      </aside>
    );
  }

  if (error && conversations.length === 0) {
    return (
      <aside className={styles.list}>
        <div className={styles.placeholderError}>{error}</div>
      </aside>
    );
  }

  if (conversations.length === 0) {
    return (
      <aside className={styles.list}>
        <div className={styles.placeholder}>
          {emptyText ?? "Chưa có cuộc trò chuyện nào."}
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.list}>
      {conversations.map((conversation) => {
        const peer =
          viewerRole === "buyer"
            ? conversation.seller.shopName
            : conversation.buyer.fullName;
        const isActive = conversation.id === activeId;
        const cls = `${styles.item} ${isActive ? styles.itemActive : ""}`;
        return (
          <button
            key={conversation.id}
            type="button"
            className={cls}
            onClick={() => handleSelect(conversation)}
          >
            <div className={styles.avatar}>
              {conversation.product?.imageUrl ? (
                <img src={conversation.product.imageUrl} alt={peer} />
              ) : (
                <span>{peer.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className={styles.body}>
              <div className={styles.head}>
                <span className={styles.peer}>{peer}</span>
                <span className={styles.time}>
                  {formatChatRelativeDate(conversation.updatedAt)}
                </span>
              </div>
              {conversation.product ? (
                <div className={styles.productLine}>
                  {conversation.product.name}
                </div>
              ) : null}
              <div className={styles.preview}>
                <span>{formatPreview(conversation, viewerRole)}</span>
                {conversation.unreadCount > 0 ? (
                  <span className={styles.badge}>
                    {conversation.unreadCount > 99
                      ? "99+"
                      : conversation.unreadCount}
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        );
      })}
    </aside>
  );
};
