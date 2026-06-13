export const LOGIN_MODAL_EVENT = "auth:open-login-modal";

export const dispatchOpenLoginModal = (): void => {
  window.dispatchEvent(new CustomEvent(LOGIN_MODAL_EVENT));
};

export const subscribeOpenLoginModal = (handler: () => void): (() => void) => {
  window.addEventListener(LOGIN_MODAL_EVENT, handler);
  return () => {
    window.removeEventListener(LOGIN_MODAL_EVENT, handler);
  };
};
