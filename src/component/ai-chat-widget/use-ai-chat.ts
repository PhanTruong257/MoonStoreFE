import { useState, useCallback, useRef } from "react";

import { env } from "@/app/config/env";

export type AiChatRole = "user" | "assistant";

export type AiMessage = {
  id: string;
  role: AiChatRole;
  content: string;
  isStreaming?: boolean;
};

type AiSseChunk = {
  text?: string;
  error?: string;
};

const AI_CHAT_ENDPOINT = `${env.apiBaseUrl}/ai/chat`;

export const useAiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<AiMessage[]>([]);

  messagesRef.current = messages;

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: AiMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
      };
      const assistantId = `a-${Date.now()}`;
      const assistantPlaceholder: AiMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setInput("");
      setIsLoading(true);

      const history = messagesRef.current.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      abortRef.current = new AbortController();

      try {
        const response = await fetch(AI_CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history }),
          signal: abortRef.current.signal,
          credentials: "include",
        });

        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6);
            if (raw === "[DONE]") break;

            try {
              const chunk = JSON.parse(raw) as AiSseChunk;
              if (chunk.error) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: chunk.error!, isStreaming: false }
                      : m,
                  ),
                );
                return;
              }
              if (chunk.text) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + chunk.text }
                      : m,
                  ),
                );
              }
            } catch {
              // ignore malformed SSE lines
            }
          }
        }
      } catch (err: unknown) {
        if ((err as Error).name === "AbortError") return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: "Có lỗi xảy ra, vui lòng thử lại.",
                  isStreaming: false,
                }
              : m,
          ),
        );
      } finally {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m,
          ),
        );
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  return {
    isOpen,
    toggleOpen,
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
    clearMessages,
  };
};
