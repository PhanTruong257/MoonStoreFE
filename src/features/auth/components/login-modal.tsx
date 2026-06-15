import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";

import type { AppDispatch, RootState } from "@/app/app-store";
import { authActions } from "@/features/auth/auth-slice";
import styles from "./login-modal.module.scss";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick?: () => void;
};

export const LoginModal = ({ isOpen, onClose, onSignupClick }: LoginModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error: authError } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Show success & close modal when login succeeds
  useEffect(() => {
    if (isOpen && user && !isLoading) {
      message.success({
        content: `Chào mừng ${user.fullName}! Đăng nhập thành công.`,
        duration: 3,
      });
      onClose();
      // Reset form
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [user, isLoading, isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    dispatch(authActions.loginRequested({ email, password }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Đăng nhập vào Moon Store</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorMsg}>{error}</div>}

          <input
            type="text"
            placeholder="Tên đăng nhập hoặc Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className={styles.inputField}
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className={styles.inputField}
          />

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Chưa có tài khoản?{" "}
            <button
              type="button"
              className={styles.signupLink}
              onClick={() => {
                onClose();
                onSignupClick?.();
              }}
            >
              Đăng ký
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
