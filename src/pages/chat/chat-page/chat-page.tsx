import styles from "./chat-page.module.scss";
import { useChatPage } from "./use-chat-page";

import { CHAT_ROUTES } from "@/const/chat.const";
import {
  ConversationList,
  MessageComposer,
  MessageThread,
} from "@/features/chat";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

export const ChatPage = () => {
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
  } = useChatPage();

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: "Exclusive", to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: "Tìm sản phẩm" }}
      />

      <section className={styles.shell}>
        <header className={styles.shellHeader}>
          <h1>Tin nhắn</h1>
          <p>Trao đổi trực tiếp với người bán về đơn hàng và sản phẩm.</p>
        </header>

        <div className={styles.layout}>
          <ConversationList
            conversations={conversations}
            activeId={conversationId}
            isLoading={isListLoading}
            error={listError}
            viewerRole="buyer"
            buildDetailPath={CHAT_ROUTES.buyerDetail}
            emptyText="Bạn chưa có cuộc trò chuyện nào. Mở trang sản phẩm và nhấn 'Chat với shop' để bắt đầu."
          />

          <div className={styles.threadArea}>
            <MessageThread
              conversation={activeConversation}
              messages={messages}
              isLoading={isThreadLoading}
              error={threadError}
              currentUserId={currentUserId}
              viewerRole="buyer"
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
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
