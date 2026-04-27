/**
 * Type-safe localStorage helpers. All functions silently no-op on parse failure
 * (and remove corrupted entries) so callers can treat them as pure read/write.
 */

export const readJsonFromStorage = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

export const writeJsonToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeFromStorage = (key: string): void => {
  localStorage.removeItem(key);
};
