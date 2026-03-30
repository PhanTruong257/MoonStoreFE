type AppEnv = {
  mode: string;
  apiBaseUrl: string;
  appName: string;
};

const rawEnv = import.meta.env as Record<string, string | undefined>;

const readRequired = (key: string, value: string | undefined) => {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const readOptional = (value: string | undefined, fallback: string) => {
  return value && value.trim().length > 0 ? value : fallback;
};

export const env: AppEnv = {
  mode: readOptional(rawEnv.MODE, "development"),
  apiBaseUrl: readOptional(rawEnv.VITE_API_BASE_URL, "http://localhost:3000"),
  appName: readOptional(rawEnv.VITE_APP_NAME, "Exclusive"),
};

if (env.mode === "production") {
  readRequired("VITE_API_BASE_URL", rawEnv.VITE_API_BASE_URL);
}
