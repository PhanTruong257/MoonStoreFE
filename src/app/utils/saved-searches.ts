import { STORAGE_KEYS } from "@/const/storage.const";
import { readJsonFromStorage, writeJsonToStorage } from "@/app/utils/storage";

const MAX_SAVED = 10;

export const getSavedSearches = (): string[] =>
  readJsonFromStorage<string[]>(STORAGE_KEYS.SAVED_SEARCHES, []);

export const addSavedSearch = (query: string): void => {
  const trimmed = query.trim();
  if (!trimmed) return;
  const current = getSavedSearches().filter((q) => q !== trimmed);
  writeJsonToStorage(STORAGE_KEYS.SAVED_SEARCHES, [trimmed, ...current].slice(0, MAX_SAVED));
};

export const removeSavedSearch = (query: string): void => {
  writeJsonToStorage(
    STORAGE_KEYS.SAVED_SEARCHES,
    getSavedSearches().filter((q) => q !== query),
  );
};

export const clearSavedSearches = (): void => {
  writeJsonToStorage(STORAGE_KEYS.SAVED_SEARCHES, []);
};
