import { useState } from "react";

import styles from "./account-page.module.scss";

import { SharedButton } from "@/component/shared-button/shared-button";
import { SharedInput } from "@/component/shared-input/shared-input";
import {
  ACCOUNT_MENU,
  ACCOUNT_TEXT,
  PROFILE_FIELDS,
} from "@/const/account.const";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

export const AccountPage = () => {
  const [firstName, setFirstName] = useState("Md");
  const [lastName, setLastName] = useState("Rimel");
  const [email, setEmail] = useState("rimel1111@gmail.com");
  const [address, setAddress] = useState("Kingston, 5236, United State");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        <div className={styles.breadcrumbRow}>
          <div>
            {ACCOUNT_TEXT.breadcrumbPrefix} <strong>{ACCOUNT_TEXT.breadcrumbCurrent}</strong>
          </div>
          <div className={styles.welcome}>
            {ACCOUNT_TEXT.welcomePrefix} <span>{ACCOUNT_TEXT.welcomeName}</span>
          </div>
        </div>

        <div className={styles.content}>
          <aside className={styles.sideMenu}>
            <h3>{ACCOUNT_MENU.manageTitle}</h3>
            {ACCOUNT_MENU.manageItems.map((item, index) => (
              <button
                key={item}
                type="button"
                className={index === 0 ? styles.menuActive : ""}
              >
                {item}
              </button>
            ))}

            <h4>{ACCOUNT_MENU.orderTitle}</h4>
            {ACCOUNT_MENU.orderItems.map((item) => (
              <button key={item} type="button">
                {item}
              </button>
            ))}

            <h4>{ACCOUNT_MENU.wishlistTitle}</h4>
          </aside>

          <section className={styles.panel}>
            <h2>{ACCOUNT_TEXT.profileTitle}</h2>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="firstName">{PROFILE_FIELDS.firstNameLabel}</label>
                <SharedInput
                  id="firstName"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder={PROFILE_FIELDS.firstNameLabel}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lastName">{PROFILE_FIELDS.lastNameLabel}</label>
                <SharedInput
                  id="lastName"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder={PROFILE_FIELDS.lastNameLabel}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">{PROFILE_FIELDS.emailLabel}</label>
                <SharedInput
                  id="email"
                  kind="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={PROFILE_FIELDS.emailLabel}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="address">{PROFILE_FIELDS.addressLabel}</label>
                <SharedInput
                  id="address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder={PROFILE_FIELDS.addressLabel}
                />
              </div>
            </div>

            <div className={styles.passwordSection}>
              <h3>{ACCOUNT_TEXT.passwordTitle}</h3>
              <SharedInput
                kind="password"
                placeholder={ACCOUNT_TEXT.currentPasswordPlaceholder}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
              <SharedInput
                kind="password"
                placeholder={ACCOUNT_TEXT.newPasswordPlaceholder}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <SharedInput
                kind="password"
                placeholder={ACCOUNT_TEXT.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <div className={styles.actions}>
              <SharedButton label={ACCOUNT_TEXT.cancelLabel} />
              <SharedButton
                label={ACCOUNT_TEXT.saveLabel}
                variant="primary"
                className={styles.saveBtn}
              />
            </div>
          </section>
        </div>
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
