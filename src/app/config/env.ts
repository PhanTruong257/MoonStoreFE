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

// Cookies are scoped per host. To keep FE and BE same-site (so cookies are sent
// on XHR with SameSite=Lax), rewrite the API host to match the FE host while
// keeping the configured port/protocol.
const resolveApiBaseUrl = (configured: string): string => {
  if (typeof window === "undefined") {
    return configured;
  }
  try {
    const url = new URL(configured);
    url.hostname = window.location.hostname;
    return url.toString().replace(/\/$/, "");
  } catch {
    return configured;
  }
};

const configuredApiBaseUrl = readOptional(
  rawEnv.VITE_API_BASE_URL,
  "http://localhost:3000",
);

export const env: AppEnv = {
  mode: readOptional(rawEnv.MODE, "development"),
  apiBaseUrl: resolveApiBaseUrl(configuredApiBaseUrl),
  appName: readOptional(rawEnv.VITE_APP_NAME, "Moon Store"),
};

if (env.mode === "production") {
  readRequired("VITE_API_BASE_URL", rawEnv.VITE_API_BASE_URL);
}
