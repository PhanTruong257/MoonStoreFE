import axios from "axios";

export const getAuthErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message.trim().length > 0) {
        return message;
      }
    }
  }

  return fallback;
};
