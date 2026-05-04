import { http } from "@/app/api/http";

export type ChatProductInfo = {
  id: number;
  name: string;
  imageUrl: string;
};

export type ChatBuyerInfo = {
  id: number;
  fullName: string;
};

export type ChatSellerInfo = {
  id: number;
  userId: number;
  shopName: string;
};

export type ChatLastMessage = {
  id: number;
  content: string;
  senderId: number;
  type: string;
  createdAt: string;
};

export type ChatConversation = {
  id: number;
  status: string;
  buyerId: number;
  sellerId: number;
  buyer: ChatBuyerInfo;
  seller: ChatSellerInfo;
  product: ChatProductInfo | null;
  orderId: number | null;
  lastMessage: ChatLastMessage | null;
  unreadCount: number;
  updatedAt: string;
  createdAt: string;
};

export type ChatMessage = {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  type: string;
  isDeleted: boolean;
  createdAt: string;
  isRead: boolean;
};

export type CreateConversationPayload = {
  sellerId: number;
  productId?: number;
  orderId?: number;
};

export type ConversationDetailResponse = {
  conversation: ChatConversation;
  messages: ChatMessage[];
};

export type SocketMessageEvent = {
  conversationId: number;
  message: ChatMessage;
};

export type SocketReadEvent = {
  conversationId: number;
  readerUserId: number;
  messageIds: number[];
};

export const fetchConversations = async () => {
  const response = await http.get<{ conversations: ChatConversation[] }>(
    "/chat/conversations",
  );
  return response.data.conversations;
};

export const createOrGetConversation = async (
  payload: CreateConversationPayload,
) => {
  const response = await http.post<{ conversation: ChatConversation }>(
    "/chat/conversations",
    payload,
  );
  return response.data.conversation;
};

export const fetchConversationDetail = async (id: number) => {
  const response = await http.get<ConversationDetailResponse>(
    `/chat/conversations/${id}`,
  );
  return response.data;
};

export const sendChatMessage = async (id: number, content: string) => {
  const response = await http.post<{ message: ChatMessage }>(
    `/chat/conversations/${id}/messages`,
    { content },
  );
  return response.data.message;
};

export const markConversationRead = async (id: number) => {
  const response = await http.post<{
    conversationId: number;
    readCount: number;
  }>(`/chat/conversations/${id}/read`);
  return response.data;
};

export const fetchUnreadCount = async () => {
  const response = await http.get<{ unreadCount: number }>(
    "/chat/unread-count",
  );
  return response.data.unreadCount;
};
