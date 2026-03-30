import type { RouteObject } from "react-router-dom";

import { NotFoundPage } from "@/pages/not-found/not-found-page";

export const errorRoutes: RouteObject[] = [
  {
    path: "*",
    element: <NotFoundPage />,
    handle: { title: "404" },
  },
];
