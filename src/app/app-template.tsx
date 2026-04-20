import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

import { initApp } from "@/app/bootstrap/init-app";
import { appConfig } from "@/app/config/app-config";

type AppTemplateProps = PropsWithChildren<{
  title: string;
}>;

export const AppTemplate = ({ children, title }: AppTemplateProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = `${title} | ${appConfig.baseTitle}`;
  }, [title]);

  useEffect(() => {
    let isMounted = true;

    void initApp().finally(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="loading-wrap" aria-live="polite" aria-busy="true">
        <span className="app-loading-bar" />
        <span className="app-loading-bar app-loading-bar--short" />
      </div>
    );
  }

  return <>{children}</>;
};
