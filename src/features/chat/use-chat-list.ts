import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { chatActions } from "@/features/chat/chat.slice";

export const useChatList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, isListLoading, listError, activeId } = useSelector(
    (state: RootState) => state.chat,
  );

  useEffect(() => {
    dispatch(chatActions.conversationsRequested());
  }, [dispatch]);

  return {
    conversations,
    isLoading: isListLoading,
    error: listError,
    activeId,
  };
};
