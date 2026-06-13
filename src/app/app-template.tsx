import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

import { initApp } from "@/app/bootstrap/init-app";
import { appConfig } from "@/app/config/app-config";
import { subscribeOpenLoginModal } from "@/app/utils/login-modal-event";
import { AiChatWidget } from "@/component/ai-chat-widget/ai-chat-widget";
import { CompareBar } from "@/component/compare-bar/compare-bar";
import { LoginModal } from "@/features/auth/components/login-modal";
import { SignupModal } from "@/features/auth/components/signup-modal";

type AppTemplateProps = PropsWithChildren<{
  title: string;
}>;

const HIDE_AI_CHAT_PREFIXES = ["/seller", "/admin", "/login", "/register"];

export const AppTemplate = ({ children, title }: AppTemplateProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
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

  useEffect(() => {
    return subscribeOpenLoginModal(() => setIsLoginModalOpen(true));
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
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
    </>
  );
};
