import { useState } from "react";

import styles from "./contact-page.module.scss";

import { Breadcrumb } from "@/component/breadcrumb/breadcrumb";
import { SharedButton } from "@/component/shared-button/shared-button";
import { SharedInput } from "@/component/shared-input/shared-input";
import { CONTACT_TEXT } from "@/const/contact.const";
import { UI_TEXT } from "@/const/ui-text";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const tc = UI_TEXT.contact;
const th = UI_TEXT.header;

export const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendMessage = () => {
    if (!name || !email || !phone || !message) {
      setStatus(CONTACT_TEXT.requiredMessage);
      return;
    }

    setStatus(CONTACT_TEXT.successMessage);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: th.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: th.searchPlaceholder }}
      />

      <section className={styles.main}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[{ label: CONTACT_TEXT.breadcrumb }]}
        />

        <section className={styles.content}>
          <aside className={styles.infoCard}>
            <article className={styles.infoBlock}>
              <h3>{tc.callTitle}</h3>
              <p>{tc.callDesc}</p>
              <p>{tc.callPhone}</p>
            </article>

            <article className={styles.infoBlock}>
              <h3>{tc.writeTitle}</h3>
              <p>{tc.writeDesc}</p>
              <p>{tc.writeEmail1}</p>
              <p>{tc.writeEmail2}</p>
            </article>
          </aside>

          <article className={styles.formCard}>
            <div className={styles.formTop}>
              <SharedInput
                placeholder={CONTACT_TEXT.namePlaceholder}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <SharedInput
                placeholder={CONTACT_TEXT.emailPlaceholder}
                value={email}
                kind="email"
                onChange={(event) => setEmail(event.target.value)}
              />
              <SharedInput
                placeholder={CONTACT_TEXT.phonePlaceholder}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>

            <SharedInput
              className={styles.messageInput}
              kind="textarea"
              placeholder={CONTACT_TEXT.messagePlaceholder}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />

            <div className={styles.actions}>
              <SharedButton
                variant="primary"
                label={CONTACT_TEXT.submitLabel}
                onClick={sendMessage}
              />
            </div>

            {status ? <p className={styles.message}>{status}</p> : null}
          </article>
        </section>
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
      />
    </main>
  );
};
