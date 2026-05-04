import styles from "./seller-chat-page.module.scss";
import { useSellerChat } from "./use-seller-chat";

import { CHAT_ROUTES } from "@/const/chat.const";
import {
  ConversationList,
  MessageComposer,
  MessageThread,
} from "@/features/chat";
import { SellerShell } from "@/features/seller/components/seller-shell";

export const SellerChatPage = () => {
  const {
    conversationId,
    conversations,
    isListLoading,
    listError,
    activeConversation,
    messages,
    isThreadLoading,
    threadError,
    isSending,
    sendError,
    sendMessage,
    currentUserId,
  } = useSellerChat();

  return (
    <SellerShell
      title="Tin nhắn"
      subtitle="Trả lời khách hàng đang quan tâm tới sản phẩm và đơn hàng của shop."
    >
      <div className={styles.layout}>
        <ConversationList
          conversations={conversations}
          activeId={conversationId}
          isLoading={isListLoading}
          error={listError}
          viewerRole="seller"
          buildDetailPath={CHAT_ROUTES.sellerDetail}
          emptyText="Chưa có khách nào nhắn tin với shop của bạn."
        />

        <div className={styles.threadArea}>
          <MessageThread
            conversation={activeConversation}
            messages={messages}
            isLoading={isThreadLoading}
            error={threadError}
            currentUserId={currentUserId}
            viewerRole="seller"
          />
          {activeConversation ? (
            <MessageComposer
              disabled={isThreadLoading}
              isSending={isSending}
              sendError={sendError}
              onSend={sendMessage}
            />
          ) : null}
        </div>
      </div>
    </SellerShell>
  );
};
