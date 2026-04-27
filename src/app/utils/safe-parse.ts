/**
 * Parses a JSON string into the requested type. Returns `undefined` for
 * empty/whitespace input or invalid JSON. Use to handle user-supplied JSON
 * fields (e.g. option groups textarea) without crashing the form.
 */
export const safeParseJson = <T>(raw: string | undefined | null): T | undefined => {
  if (!raw || !raw.trim()) {
    return undefined;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
};

export const safeParseJsonArray = <T>(
  raw: string | undefined | null,
): T[] | undefined => {
  const parsed = safeParseJson<T[]>(raw);
  return Array.isArray(parsed) ? parsed : undefined;
};
