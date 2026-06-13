import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.VITE_PORT) || 5173;
  const previewPort = Number(env.VITE_PREVIEW_PORT) || 4173;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      host: env.VITE_HOST || "0.0.0.0",
      port,
      proxy: {
        "/uploads": {
          target: (() => {
            try {
              const url = new URL(env.VITE_API_BASE_URL || "http://localhost:2000");
              return `http://localhost:${url.port || 2000}`;
            } catch {
              return "http://localhost:2000";
            }
          })(),
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: env.VITE_HOST || "0.0.0.0",
      port: previewPort,
    },
  };
});
