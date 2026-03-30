import type { ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import { AppTemplate } from "@/app/app-template";
import { appConfig } from "@/app/config/app-config";
import { errorRoutes } from "@/app/router/error-routes";
import { protectedRoutes } from "@/app/router/protected-routes";
import { publicRoutes } from "@/app/router/public-routes";

type RouteHandle = {
  title?: string;
};

const withTemplate = (routes: RouteObject[]): RouteObject[] => {
  return routes.map((route) => {
    const handle = (route.handle ?? {}) as RouteHandle;
    const title = handle.title ?? appConfig.appName;

    const nextRoute: RouteObject = {
      ...route,
    };

    if (route.element) {
      nextRoute.element = (
        <AppTemplate title={title}>{route.element as ReactNode}</AppTemplate>
      );
    }

    if (route.children) {
      nextRoute.children = withTemplate(route.children);
    }

    return nextRoute;
  });
};

const routes = [
  ...withTemplate(publicRoutes),
  ...withTemplate(protectedRoutes),
  ...withTemplate(errorRoutes),
];

export const appRouter = createBrowserRouter(routes);
