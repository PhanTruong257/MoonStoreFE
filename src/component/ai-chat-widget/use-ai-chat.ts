import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { env } from "@/app/config/env";
import { dispatchCartUpdated } from "@/app/utils/cart-event";
import { writeJsonToStorage } from "@/app/utils/storage";
import { STORAGE_KEYS } from "@/const/storage.const";
import { addToCart } from "@/services/cart-service";

export type AiChatRole = "user" | "assistant";

export type AiProduct = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
};

export type OrderDraftItem = {
  productId: number;
  name: string;
  quantity: number;
  optionIds: number[];
  unitPrice: number;
  lineTotal: number;
};

export type OrderDraft = {
  items: OrderDraftItem[];
  address: { addressId: number | null; text: string } | null;
  voucherCode: string | null;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  paymentMethod: string;
  warnings: string[];
};

export type AiMessage = {
  id: string;
  role: AiChatRole;
  content: string;
  pending?: boolean;
  products?: AiProduct[];
  orderDraft?: OrderDraft;
  draftConfirming?: boolean;
  draftDone?: boolean;
};

type AgentResponse = {
  text: string;
  orderDraft?: OrderDraft;
  products?: AiProduct[];
};

const AI_AGENT_ENDPOINT = `${env.apiBaseUrl}/ai/agent`;

export const useAiChat = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<AiMessage[]>([]);

  messagesRef.current = messages;

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  const patchMessage = useCallback((id: string, patch: Partial<AiMessage>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );
  }, []);

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
        pending: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setInput("");
      setIsLoading(true);

      const history = messagesRef.current
        .filter((m) => m.content && !m.pending)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const response = await fetch(AI_AGENT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history }),
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = (await response.json()) as AgentResponse;
        patchMessage(assistantId, {
          content: data.text,
          products: data.products,
          orderDraft: data.orderDraft,
          pending: false,
        });
      } catch {
        patchMessage(assistantId, {
          content: "Có lỗi xảy ra, vui lòng thử lại.",
          pending: false,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, patchMessage],
  );

  // Thêm sản phẩm trong bản nháp vào giỏ rồi chuyển sang trang thanh toán (/checkout).
  // KHÔNG tạo đơn ở đây — đơn chỉ được tạo sau khi khách thanh toán ở trang checkout.
  const goToCheckout = useCallback(
    async (messageId: string) => {
      const message = messagesRef.current.find((m) => m.id === messageId);
      const draft = message?.orderDraft;
      if (!draft || message.draftConfirming || message.draftDone) return;

      patchMessage(messageId, { draftConfirming: true });

      try {
        const cartItemIds: number[] = [];
        for (const item of draft.items) {
          const added = await addToCart({
            productId: item.productId,
            quantity: item.quantity,
            optionIds: item.optionIds,
          });
          cartItemIds.push(added.itemId);
        }

        // Đánh dấu đúng các item này được chọn để trang checkout chỉ thanh toán chúng.
        writeJsonToStorage(STORAGE_KEYS.CART_SELECTED_IDS, cartItemIds);
        dispatchCartUpdated();

        patchMessage(messageId, { draftConfirming: false, draftDone: true });
        setIsOpen(false);
        void navigate("/checkout");
      } catch {
        // addToCart dùng axios — nếu chưa đăng nhập (401) sẽ tự chuyển sang /login.
        patchMessage(messageId, { draftConfirming: false });
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content:
              "Không thêm được vào giỏ. Bạn vui lòng đăng nhập rồi thử lại nhé.",
          },
        ]);
      }
    },
    [navigate, patchMessage],
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  return {
    isOpen,
    toggleOpen,
    messages,
    input,
    setInput,
    sendMessage,
    goToCheckout,
    isLoading,
    clearMessages,
  };
};
