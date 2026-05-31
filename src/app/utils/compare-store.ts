import { STORAGE_KEYS } from "@/const/storage.const";
import { readJsonFromStorage, writeJsonToStorage } from "@/app/utils/storage";

export type CompareItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  rating?: number;
};

const MAX_COMPARE = 4;
const COMPARE_EVENT = "compare:updated";

export const getCompareItems = (): CompareItem[] =>
  readJsonFromStorage<CompareItem[]>(STORAGE_KEYS.COMPARE_ITEMS, []);

export const isInCompare = (id: string): boolean =>
  getCompareItems().some((item) => item.id === id);

export const addCompareItem = (item: CompareItem): boolean => {
  const current = getCompareItems();
  if (current.length >= MAX_COMPARE || current.some((i) => i.id === item.id)) {
    return false;
  }
  writeJsonToStorage(STORAGE_KEYS.COMPARE_ITEMS, [...current, item]);
  dispatchCompareUpdated();
  return true;
};

export const removeCompareItem = (id: string): void => {
  writeJsonToStorage(
    STORAGE_KEYS.COMPARE_ITEMS,
    getCompareItems().filter((item) => item.id !== id),
  );
  dispatchCompareUpdated();
};

export const clearCompareItems = (): void => {
  writeJsonToStorage(STORAGE_KEYS.COMPARE_ITEMS, []);
  dispatchCompareUpdated();
};

export const dispatchCompareUpdated = (): void => {
  window.dispatchEvent(new CustomEvent(COMPARE_EVENT));
};

export const subscribeCompareUpdated = (handler: () => void): (() => void) => {
  window.addEventListener(COMPARE_EVENT, handler);
  return () => window.removeEventListener(COMPARE_EVENT, handler);
};
