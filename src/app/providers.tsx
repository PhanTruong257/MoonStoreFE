import { RouterProvider } from "react-router-dom";

import { router } from "./router";

export const AppProviders = () => {
  return <RouterProvider router={router} />;
};
