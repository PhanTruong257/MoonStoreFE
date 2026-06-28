import type { PayloadAction } from "@reduxjs/toolkit";
import { eventChannel, type EventChannel, type Task } from "redux-saga";
import {
  call,
  cancel,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";

import type { RootState } from "@/app/app-store";
import { extractApiErrorMessage } from "@/app/utils/error-message";
import { CHAT_SOCKET_EVENT } from "@/const/chat.const";
import { authActions } from "@/features/auth/auth-slice";
import { getStoredUser } from "@/features/auth/auth-storage";
import {
  connectChatSocket,
  disconnectChatSocket,
} from "@/features/chat/chat-socket";
import { chatActions } from "@/features/chat/chat.slice";
import {
  createOrGetConversation,
  fetchConversationDetail,
  fetchConversations,
  fetchUnreadCount,
  markConversationRead,
  sendChatMessage,
  type ChatConversation,
  type ChatMessage,
  type ConversationDetailResponse,
  type CreateConversationPayload,
  type SocketMessageEvent,
  type SocketReadEvent,
} from "@/services/chat-service";


function* handleConversationsRequested() {
  try {
    const data = (yield call(fetchConversations)) as ChatConversation[];
    yield put(chatActions.conversationsSucceeded(data));
  } catch (error) {
    yield put(
      chatActions.conversationsFailed(
        extractApiErrorMessage(error, "Không tải được cuộc trò chuyện."),
      ),
    );
  }
}

function* handleConversationDetailRequested(action: PayloadAction<number>) {
  try {
    const data = (yield call(
      fetchConversationDetail,
      action.payload,
    )) as ConversationDetailResponse;
    yield put(chatActions.conversationDetailSucceeded(data));
    yield put(chatActions.markReadRequested(action.payload));
  } catch (error) {
    yield put(
      chatActions.conversationDetailFailed(
        extractApiErrorMessage(error, "Không tải được cuộc trò chuyện."),
      ),
    );
  }
}

function* handleMessageSendRequested(
  action: PayloadAction<{ conversationId: number; content: string }>,
) {
  try {
    const message = (yield call(
      sendChatMessage,
      action.payload.conversationId,
      action.payload.content,
    )) as ChatMessage;
    yield put(chatActions.messageSendSucceeded(message));
  } catch (error) {
    yield put(
      chatActions.messageSendFailed(
        extractApiErrorMessage(error, "Không thể gửi tin nhắn."),
      ),
    );
  }
}

function* handleMarkReadRequested(action: PayloadAction<number>) {
  try {
    yield call(markConversationRead, action.payload);
    yield put(chatActions.conversationMarkedReadLocally(action.payload));
  } catch {
    // silent — the user will retry by reopening
  }
}

function* handleUnreadCountRequested() {
  try {
    const count = (yield call(fetchUnreadCount)) as number;
    yield put(chatActions.unreadCountSucceeded(count));
  } catch {
    // silent
  }
}

function* handleConversationCreateRequested(
  action: PayloadAction<CreateConversationPayload>,
) {
  try {
    const conversation = (yield call(
      createOrGetConversation,
      action.payload,
    )) as ChatConversation;
    yield put(chatActions.conversationCreateSucceeded(conversation));
  } catch (error) {
    yield put(
      chatActions.conversationCreateFailed(
        extractApiErrorMessage(error, "Không thể bắt đầu trò chuyện."),
      ),
    );
  }
}

function* handleMessageReceivedSideEffects(
  action: PayloadAction<SocketMessageEvent>,
) {
  const stored = getStoredUser();
  if (!stored) {
    return;
  }
  const { conversationId, message } = action.payload;

  const knownConversation = (yield select((state: RootState) =>
    state.chat.conversations.some((item) => item.id === conversationId),
  )) as boolean;
  if (!knownConversation) {
    yield put(chatActions.conversationsRequested());
  }

  if (message.senderId === stored.id) {
    return;
  }
  const activeId = (yield select(
    (state: RootState) => state.chat.activeId,
  )) as number | null;
  if (activeId === conversationId) {
    yield put(chatActions.markReadRequested(activeId));
  }
}

type SocketEvent =
  | { kind: "connect" }
  | { kind: "disconnect" }
  | { kind: "message"; payload: SocketMessageEvent }
  | { kind: "read"; payload: SocketReadEvent };

const createSocketChannel = (): EventChannel<SocketEvent> => {
  const socket = connectChatSocket();
  return eventChannel<SocketEvent>((emit) => {
    const onConnect = () => emit({ kind: "connect" });
    const onDisconnect = () => emit({ kind: "disconnect" });
    const onMessage = (payload: SocketMessageEvent) =>
      emit({ kind: "message", payload });
    const onRead = (payload: SocketReadEvent) =>
      emit({ kind: "read", payload });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(CHAT_SOCKET_EVENT.MESSAGE_NEW, onMessage);
    socket.on(CHAT_SOCKET_EVENT.MESSAGE_READ, onRead);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(CHAT_SOCKET_EVENT.MESSAGE_NEW, onMessage);
      socket.off(CHAT_SOCKET_EVENT.MESSAGE_READ, onRead);
    };
  });
};

function* listenSocketEvents() {
  const channel = (yield call(createSocketChannel)) as EventChannel<SocketEvent>;
  try {
    while (true) {
      const event = (yield take(channel)) as SocketEvent;
      switch (event.kind) {
        case "connect": {
          yield put(chatActions.socketConnected());
          yield put(chatActions.unreadCountRequested());
          yield put(chatActions.conversationsRequested());
          const activeId = (yield select(
            (state: RootState) => state.chat.activeId,
          )) as number | null;
          if (activeId !== null) {
            yield put(chatActions.conversationDetailRequested(activeId));
          }
          break;
        }
        case "disconnect":
          yield put(chatActions.socketDisconnected());
          break;
        case "message":
          yield put(chatActions.messageReceived(event.payload));
          break;
        case "read":
          yield put(chatActions.messageReadByPeer(event.payload));
          break;
      }
    }
  } finally {
    channel.close();
  }
}

let socketTask: Task | null = null;

function* startSocket() {
  const stored = getStoredUser();
  yield put(chatActions.currentUserSet(stored?.id ?? null));
  if (socketTask) {
    yield call(connectChatSocket);
    return;
  }
  socketTask = (yield fork(listenSocketEvents)) as Task;
}

function* stopSocket() {
  if (socketTask) {
    yield cancel(socketTask);
    socketTask = null;
  }
  disconnectChatSocket();
  yield put(chatActions.chatReset());
}

export function* chatSaga() {
  yield takeEvery(authActions.loginSucceeded.type, startSocket);
  yield takeEvery(authActions.registerSucceeded.type, startSocket);
  yield takeEvery(authActions.logoutSucceeded.type, stopSocket);

  yield takeLatest(
    chatActions.conversationsRequested.type,
    handleConversationsRequested,
  );
  yield takeLatest(
    chatActions.conversationDetailRequested.type,
    handleConversationDetailRequested,
  );
  yield takeEvery(
    chatActions.messageSendRequested.type,
    handleMessageSendRequested,
  );
  yield takeEvery(chatActions.markReadRequested.type, handleMarkReadRequested);
  yield takeLatest(
    chatActions.unreadCountRequested.type,
    handleUnreadCountRequested,
  );
  yield takeEvery(
    chatActions.conversationCreateRequested.type,
    handleConversationCreateRequested,
  );
  yield takeEvery(
    chatActions.messageReceived.type,
    handleMessageReceivedSideEffects,
  );

  if (getStoredUser()) {
    yield call(startSocket);
  }
}
