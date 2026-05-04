import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  ChatConversation,
  ChatMessage,
  ConversationDetailResponse,
  CreateConversationPayload,
  SocketMessageEvent,
  SocketReadEvent,
} from "@/services/chat-service";

export type ChatState = {
  conversations: ChatConversation[];
  isListLoading: boolean;
  listError: string | null;

  activeId: number | null;
  activeConversation: ChatConversation | null;
  activeMessages: ChatMessage[];
  isThreadLoading: boolean;
  threadError: string | null;

  isSending: boolean;
  sendError: string | null;

  isCreating: boolean;
  createError: string | null;

  unreadCount: number;
  isSocketConnected: boolean;

  currentUserId: number | null;
};

const initialState: ChatState = {
  conversations: [],
  isListLoading: false,
  listError: null,

  activeId: null,
  activeConversation: null,
  activeMessages: [],
  isThreadLoading: false,
  threadError: null,

  isSending: false,
  sendError: null,

  isCreating: false,
  createError: null,

  unreadCount: 0,
  isSocketConnected: false,

  currentUserId: null,
};

const moveConversationToTop = (
  conversations: ChatConversation[],
  next: ChatConversation,
): ChatConversation[] => {
  const filtered = conversations.filter((item) => item.id !== next.id);
  return [next, ...filtered];
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    conversationsRequested(state) {
      state.isListLoading = true;
      state.listError = null;
    },
    conversationsSucceeded(
      state,
      action: PayloadAction<ChatConversation[]>,
    ) {
      state.isListLoading = false;
      state.conversations = action.payload;
      state.unreadCount = action.payload.reduce(
        (sum, item) => sum + item.unreadCount,
        0,
      );
    },
    conversationsFailed(state, action: PayloadAction<string>) {
      state.isListLoading = false;
      state.listError = action.payload;
    },

    conversationOpened(state, action: PayloadAction<number | null>) {
      state.activeId = action.payload;
      if (action.payload === null) {
        state.activeConversation = null;
        state.activeMessages = [];
        state.threadError = null;
      }
    },

    conversationDetailRequested: {
      reducer(state, action: PayloadAction<number>) {
        if (state.activeId !== action.payload) {
          state.activeConversation = null;
          state.activeMessages = [];
        }
        state.activeId = action.payload;
        state.isThreadLoading = true;
        state.threadError = null;
      },
      prepare(conversationId: number) {
        return { payload: conversationId };
      },
    },
    conversationDetailSucceeded(
      state,
      action: PayloadAction<ConversationDetailResponse>,
    ) {
      state.isThreadLoading = false;
      state.activeConversation = action.payload.conversation;
      state.activeMessages = action.payload.messages;

      const idx = state.conversations.findIndex(
        (item) => item.id === action.payload.conversation.id,
      );
      if (idx >= 0) {
        state.conversations[idx] = action.payload.conversation;
      }
    },
    conversationDetailFailed(state, action: PayloadAction<string>) {
      state.isThreadLoading = false;
      state.threadError = action.payload;
    },

    messageSendRequested: {
      reducer(state) {
        state.isSending = true;
        state.sendError = null;
      },
      prepare(payload: { conversationId: number; content: string }) {
        return { payload };
      },
    },
    messageSendSucceeded(state, action: PayloadAction<ChatMessage>) {
      state.isSending = false;
      const message = action.payload;
      if (
        state.activeId === message.conversationId &&
        !state.activeMessages.some((item) => item.id === message.id)
      ) {
        state.activeMessages = [...state.activeMessages, message];
      }
      const idx = state.conversations.findIndex(
        (item) => item.id === message.conversationId,
      );
      if (idx >= 0) {
        const updated: ChatConversation = {
          ...state.conversations[idx],
          lastMessage: {
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            type: message.type,
            createdAt: message.createdAt,
          },
          updatedAt: message.createdAt,
        };
        state.conversations = moveConversationToTop(
          state.conversations,
          updated,
        );
      }
    },
    messageSendFailed(state, action: PayloadAction<string>) {
      state.isSending = false;
      state.sendError = action.payload;
    },

    messageReceived(state, action: PayloadAction<SocketMessageEvent>) {
      const { conversationId, message } = action.payload;
      const isOwnMessage =
        state.currentUserId !== null &&
        message.senderId === state.currentUserId;
      const matchesActive = state.activeId === conversationId;

      if (matchesActive) {
        if (!state.activeMessages.some((item) => item.id === message.id)) {
          state.activeMessages = [...state.activeMessages, message];
        }
      }

      const idx = state.conversations.findIndex(
        (item) => item.id === conversationId,
      );
      if (idx >= 0) {
        const existing = state.conversations[idx];
        const shouldBumpUnread = !isOwnMessage && !matchesActive;
        const updated: ChatConversation = {
          ...existing,
          lastMessage: {
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            type: message.type,
            createdAt: message.createdAt,
          },
          unreadCount: shouldBumpUnread
            ? existing.unreadCount + 1
            : existing.unreadCount,
          updatedAt: message.createdAt,
        };
        state.conversations = moveConversationToTop(
          state.conversations,
          updated,
        );
        if (shouldBumpUnread) {
          state.unreadCount += 1;
        }
      }
    },

    messageReadByPeer(state, action: PayloadAction<SocketReadEvent>) {
      const { conversationId, messageIds } = action.payload;
      if (state.activeId === conversationId) {
        state.activeMessages = state.activeMessages.map((message) =>
          messageIds.includes(message.id)
            ? { ...message, isRead: true }
            : message,
        );
      }
    },

    markReadRequested: {
      reducer() {},
      prepare(conversationId: number) {
        return { payload: conversationId };
      },
    },
    conversationMarkedReadLocally(state, action: PayloadAction<number>) {
      const id = action.payload;
      const idx = state.conversations.findIndex((item) => item.id === id);
      if (idx >= 0) {
        const existing = state.conversations[idx];
        state.unreadCount = Math.max(
          0,
          state.unreadCount - existing.unreadCount,
        );
        state.conversations[idx] = { ...existing, unreadCount: 0 };
      }
      if (state.activeId === id) {
        state.activeMessages = state.activeMessages.map((message) => ({
          ...message,
          isRead: true,
        }));
      }
    },

    unreadCountRequested() {},
    unreadCountSucceeded(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },

    conversationCreateRequested: {
      reducer(state) {
        state.isCreating = true;
        state.createError = null;
      },
      prepare(payload: CreateConversationPayload) {
        return { payload };
      },
    },
    conversationCreateSucceeded(
      state,
      action: PayloadAction<ChatConversation>,
    ) {
      state.isCreating = false;
      const idx = state.conversations.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (idx >= 0) {
        state.conversations[idx] = action.payload;
      } else {
        state.conversations = [action.payload, ...state.conversations];
      }
    },
    conversationCreateFailed(state, action: PayloadAction<string>) {
      state.isCreating = false;
      state.createError = action.payload;
    },

    socketConnected(state) {
      state.isSocketConnected = true;
    },
    socketDisconnected(state) {
      state.isSocketConnected = false;
    },

    currentUserSet(state, action: PayloadAction<number | null>) {
      state.currentUserId = action.payload;
    },

    chatReset() {
      return initialState;
    },
  },
});

export const chatReducer = chatSlice.reducer;
export const chatActions = chatSlice.actions;
