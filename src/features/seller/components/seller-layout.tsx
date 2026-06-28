import { useState } from "react";
import { Outlet } from "react-router-dom";

import { SellerShell } from "./seller-shell";
import {
  SellerShellContext,
  type SellerShellPageProps,
} from "./seller-shell-context";

const DEFAULT_PROPS: SellerShellPageProps = {
  title: "Kênh người bán",
  subtitle: "",
  fullHeight: false,
};

/**
 * Layout route cho toàn bộ /seller/*.
 * Render SellerShell 1 lần duy nhất — chỉ <Outlet /> (content) thay đổi khi navigate.
 * Giúp loại bỏ giật header/sidebar khi chuyển trang.
 */
export const SellerLayout = () => {
  const [pageProps, setPageProps] = useState<SellerShellPageProps>(DEFAULT_PROPS);

  return (
    <SellerShellContext.Provider value={{ setPageProps }}>
      <SellerShell
        title={pageProps.title}
        subtitle={pageProps.subtitle}
        actions={pageProps.actions}
        fullHeight={pageProps.fullHeight}
      >
        <Outlet />
      </SellerShell>
    </SellerShellContext.Provider>
  );
};
