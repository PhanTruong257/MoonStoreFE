import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { chatActions } from "@/features/chat/chat.slice";

export const useChatThread = (conversationId: number | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    activeConversation,
    activeMessages,
    isThreadLoading,
    threadError,
    isSending,
    sendError,
  } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (conversationId === null) {
      dispatch(chatActions.conversationOpened(null));
      return;
    }
    dispatch(chatActions.conversationDetailRequested(conversationId));
    return () => {
      dispatch(chatActions.conversationOpened(null));
    };
  }, [conversationId, dispatch]);

  const sendMessage = (content: string) => {
    if (conversationId === null) {
      return;
    }
    const trimmed = content.trim();
    if (trimmed.length === 0) {
      return;
    }
    dispatch(
      chatActions.messageSendRequested({
        conversationId,
        content: trimmed,
      }),
    );
  };

  return {
    conversation: activeConversation,
    messages: activeMessages,
    isLoading: isThreadLoading,
    error: threadError,
    isSending,
    sendError,
    sendMessage,
  };
};
