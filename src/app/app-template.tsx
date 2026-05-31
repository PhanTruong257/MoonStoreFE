import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

import { initApp } from "@/app/bootstrap/init-app";
import { appConfig } from "@/app/config/app-config";
import { AiChatWidget } from "@/component/ai-chat-widget/ai-chat-widget";
import { CompareBar } from "@/component/compare-bar/compare-bar";

type AppTemplateProps = PropsWithChildren<{
  title: string;
}>;

const HIDE_AI_CHAT_PREFIXES = ["/seller", "/admin", "/login", "/register"];

export const AppTemplate = ({ children, title }: AppTemplateProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const showAiChat = !HIDE_AI_CHAT_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix),
  );

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

  return (
    <>
      {children}
      {showAiChat && <AiChatWidget />}
      <CompareBar />
    </>
  );
};
