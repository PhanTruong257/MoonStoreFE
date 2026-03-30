import { env } from "@/app/config/env";

export const appConfig = {
  appName: env.appName,
  baseTitle: env.appName,
  defaultPath: "/",
  loginPath: "/login",
  featureFlags: {
    isDisableFetchMaster: false,
  },
};
