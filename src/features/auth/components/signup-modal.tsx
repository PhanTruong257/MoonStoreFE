import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";

import type { AppDispatch, RootState } from "@/app/app-store";
import { authActions } from "@/features/auth/auth-slice";
import styles from "./signup-modal.module.scss";

type SignupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess?: () => void;
};

export const SignupModal = ({ isOpen, onClose, onSignupSuccess }: SignupModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error: authError, user } = useSelector((state: RootState) => state.auth);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  useEffect(() => {
    if (user && !isLoading) {
      message.success({
        content: `Chào mừng ${user.fullName}! Đăng ký thành công.`,
        duration: 3,
      });
      onSignupSuccess?.();
      onClose();
    }
  }, [user, isLoading, onClose, onSignupSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    dispatch(
      authActions.registerRequested({
        fullName,
        email,
        password,
      }),
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Đăng ký</h2>
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

          <div className={styles.formGroup}>
            <label htmlFor="fullName">Họ và tên</label>
            <input
              id="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Đã có tài khoản?{" "}
            <button
              type="button"
              className={styles.loginLink}
              onClick={() => {
                onClose();
                // Parent component sẽ handle switch to login modal
              }}
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
