import { ConfigProvider } from "antd";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { appRouter } from "@/app/app-routes";
import { store } from "@/app/app-store";

export const AppProviders = () => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <ConfigProvider>
          <RouterProvider router={appRouter} />
        </ConfigProvider>
      </HelmetProvider>
    </Provider>
  );
};
