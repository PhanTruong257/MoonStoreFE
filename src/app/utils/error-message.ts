type AxiosLikeError = {
  response?: { data?: { message?: string } };
};

const isAxiosLikeError = (value: unknown): value is AxiosLikeError => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return "response" in value;
};

export const extractApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (isAxiosLikeError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  return fallback;
};
