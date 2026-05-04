import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { chatActions } from "@/features/chat/chat.slice";

const POLL_INTERVAL_MS = 60000;

export const useUnreadCount = (enabled: boolean) => {
  const dispatch = useDispatch<AppDispatch>();
  const unreadCount = useSelector(
    (state: RootState) => state.chat.unreadCount,
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }
    dispatch(chatActions.unreadCountRequested());
    const id = window.setInterval(() => {
      dispatch(chatActions.unreadCountRequested());
    }, POLL_INTERVAL_MS);
    return () => {
      window.clearInterval(id);
    };
  }, [enabled, dispatch]);

  return unreadCount;
};
