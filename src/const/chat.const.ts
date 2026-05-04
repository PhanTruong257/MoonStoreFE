export const CHAT_ROUTES = {
  buyerList: "/chat",
  buyerDetail: (id: number | string) => `/chat/${id}`,
  sellerList: "/seller/chat",
  sellerDetail: (id: number | string) => `/seller/chat/${id}`,
} as const;

export const CHAT_MESSAGE_TYPE = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  SYSTEM: "SYSTEM",
} as const;

export const CHAT_SOCKET_EVENT = {
  MESSAGE_NEW: "chat:message:new",
  MESSAGE_READ: "chat:message:read",
} as const;

export const MAX_CHAT_MESSAGE_LENGTH = 2000;

export const formatChatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatChatRelativeDate = (iso: string) => {
  const date = new Date(iso);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return formatChatTime(iso);
  }
  return date.toLocaleDateString("vi-VN");
};
