import { http } from "@/app/api/http";
import { env } from "@/app/config/env";

export type UploadImageResponse = {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
};

/**
 * Upload an image to BE. Returns the response with `url` rewritten as an
 * absolute URL pointing to the BE static file server, so the URL can be
 * stored in DB and rendered directly via `<img src={url}>` without a
 * runtime resolver.
 */
export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await http.post<UploadImageResponse>(
    "/uploads/image",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  const data = response.data;
  const absoluteUrl = data.url.startsWith("/")
    ? `${env.apiBaseUrl.replace(/\/$/, "")}${data.url}`
    : data.url;
  return { ...data, url: absoluteUrl };
};
