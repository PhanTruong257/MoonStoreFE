import { useState } from "react";

import styles from "./contact-page.module.scss";

import { Breadcrumb } from "@/component/breadcrumb/breadcrumb";
import { SharedButton } from "@/component/shared-button/shared-button";
import { SharedInput } from "@/component/shared-input/shared-input";
import { CONTACT_TEXT } from "@/const/contact.const";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

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
        brand={{ label: "Exclusive", to: "/" }}
        navLinks={homeHeaderLinks}
        promo={{
          message:
            "Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!",
          linkLabel: "ShopNow",
          to: "/",
        }}
        search={{ placeholder: "What are you looking for?" }}
      />

      <section className={styles.main}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[{ label: CONTACT_TEXT.breadcrumb }]}
        />

        <section className={styles.content}>
          <aside className={styles.infoCard}>
            <article className={styles.infoBlock}>
              <h3>Call To Us</h3>
              <p>We are available 24/7, 7 days a week.</p>
              <p>Phone: +8801611112222</p>
            </article>

            <article className={styles.infoBlock}>
              <h3>Write To Us</h3>
              <p>Fill out our form and we will contact you within 24 hours.</p>
              <p>Emails: customer@exclusive.com</p>
              <p>Emails: support@exclusive.com</p>
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
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
