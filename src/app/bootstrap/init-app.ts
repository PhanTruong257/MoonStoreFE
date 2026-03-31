import { appConfig } from "@/app/config/app-config";
import { fetchMe } from "@/features/auth/auth-api";
import { setStoredUser } from "@/features/auth/auth-storage";

let hasInitialized = false;

const preloadMasterData = async () => {
  await Promise.resolve();
};

const restoreAuthSession = async () => {
  try {
    const user = await fetchMe();
    setStoredUser(user);
  } catch (error) {
    setStoredUser(null);
  }
};

const loadAppSettings = async () => {
  await Promise.resolve();
};

export const initApp = async () => {
  if (hasInitialized) {
    return;
  }

  const tasks = [restoreAuthSession(), loadAppSettings()];

  if (!appConfig.featureFlags.isDisableFetchMaster) {
    tasks.unshift(preloadMasterData());
  }

  await Promise.all(tasks);
  hasInitialized = true;
};
