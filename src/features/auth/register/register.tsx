import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import { SharedButton } from "@/component/shared-button/shared-button";
import { SharedInput } from "@/component/shared-input/shared-input";
import { REGISTER_TEXT } from "@/const/auth.const";
import { useRegister } from "@/features/auth/register/hook";

export const Register = () => {
  const { form, error, isSubmitting, setField, submit } = useRegister();

  return (
    <section className={styles.panel}>
      <h1>{REGISTER_TEXT.title}</h1>
      <p>{REGISTER_TEXT.subtitle}</p>

      <SharedInput
        className={styles.field}
        placeholder={REGISTER_TEXT.namePlaceholder}
        value={form.name}
        onChange={(event) => setField("name", event.target.value)}
      />

      <SharedInput
        className={styles.field}
        kind="email"
        placeholder={REGISTER_TEXT.emailPlaceholder}
        value={form.email}
        onChange={(event) => setField("email", event.target.value)}
      />

      <SharedInput
        className={styles.field}
        kind="password"
        placeholder={REGISTER_TEXT.passwordPlaceholder}
        value={form.password}
        onChange={(event) => setField("password", event.target.value)}
      />

      {error ? <p className={styles.error}>{error}</p> : null}

      <SharedButton
        className={styles.button}
        variant="primary"
        disabled={isSubmitting}
        onClick={() => {
          submit();
        }}
        label={isSubmitting ? REGISTER_TEXT.loadingLabel : REGISTER_TEXT.submitLabel}
      />

      <SharedButton className={styles.google} label={REGISTER_TEXT.googleLabel} />

      <div className={styles.bottom}>
        {REGISTER_TEXT.loginHint}
        <Link to="/login">{REGISTER_TEXT.loginLabel}</Link>
      </div>
    </section>
  );
};
