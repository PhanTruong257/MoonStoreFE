import { appConfig } from "@/app/config/app-config";

let hasInitialized = false;

const preloadMasterData = async () => {
  await Promise.resolve();
};

const restoreAuthSession = async () => {
  await Promise.resolve();
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
