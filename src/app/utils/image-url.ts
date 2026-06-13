import { env } from "@/app/config/env";

/**
 * Resolve a product imageUrl to a fully-qualified URL.
 * Local uploads (/uploads/...) are prefixed with the API base URL so they load
 * correctly regardless of whether the FE and BE are on different origins.
 */
export const resolveImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.startsWith("/uploads/")) {
    return `${env.apiBaseUrl}${url}`;
  }
  return url;
};
