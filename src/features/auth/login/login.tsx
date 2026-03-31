import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import { SharedButton } from "@/component/shared-button/shared-button";
import { SharedInput } from "@/component/shared-input/shared-input";
import { LOGIN_TEXT } from "@/const/auth.const";
import { useLogin } from "@/features/auth/login/hook";

export const Login = () => {
  const { form, error, isSubmitting, setField, submit } = useLogin();

  return (
    <section className={styles.panel}>
      <h1>{LOGIN_TEXT.title}</h1>
      <p>{LOGIN_TEXT.subtitle}</p>

      <SharedInput
        className={styles.field}
        kind="email"
        placeholder={LOGIN_TEXT.emailPlaceholder}
        value={form.email}
        onChange={(event) => setField("email", event.target.value)}
      />

      <SharedInput
        className={styles.field}
        kind="password"
        placeholder={LOGIN_TEXT.passwordPlaceholder}
        value={form.password}
        onChange={(event) => setField("password", event.target.value)}
      />

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.actionRow}>
        <SharedButton
          className={styles.button}
          variant="primary"
          disabled={isSubmitting}
          onClick={() => {
            submit();
          }}
          label={isSubmitting ? LOGIN_TEXT.loadingLabel : LOGIN_TEXT.submitLabel}
        />

        <Link className={styles.link} to="/register">
          {LOGIN_TEXT.forgotPassword}
        </Link>
      </div>

      <div className={styles.bottom}>
        {LOGIN_TEXT.signupHint}
        <Link to="/register">{LOGIN_TEXT.signupLabel}</Link>
      </div>
    </section>
  );
};
