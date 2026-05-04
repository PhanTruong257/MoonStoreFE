import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import type { RootState } from "@/app/app-store";
import { useChatList } from "@/features/chat/use-chat-list";
import { useChatThread } from "@/features/chat/use-chat-thread";

export const useSellerChat = () => {
  const params = useParams<{ conversationId?: string }>();
  const conversationId = useMemo(() => {
    const raw = params.conversationId;
    if (!raw) {
      return null;
    }
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.conversationId]);

  const list = useChatList();
  const thread = useChatThread(conversationId);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  return {
    conversationId,
    conversations: list.conversations,
    isListLoading: list.isLoading,
    listError: list.error,
    activeConversation: thread.conversation,
    messages: thread.messages,
    isThreadLoading: thread.isLoading,
    threadError: thread.error,
    isSending: thread.isSending,
    sendError: thread.sendError,
    sendMessage: thread.sendMessage,
    currentUserId: currentUser?.id ?? 0,
  };
};
