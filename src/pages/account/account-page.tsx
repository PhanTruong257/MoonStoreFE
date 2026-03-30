import { useState } from "react";

import styles from "./account-page.module.scss";

import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

export const AccountPage = () => {
  const [firstName, setFirstName] = useState("Md");
  const [lastName, setLastName] = useState("Rimel");
  const [email, setEmail] = useState("rimel1111@gmail.com");
  const [address, setAddress] = useState("Kingston, 5236, United State");

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
            Home / <strong>My Account</strong>
          </div>
          <div className={styles.welcome}>
            Welcome! <span>Md Rimel</span>
          </div>
        </div>

        <div className={styles.content}>
          <aside className={styles.sideMenu}>
            <h3>Manage My Account</h3>
            <button type="button" className={styles.menuActive}>
              My Profile
            </button>
            <button type="button">Address Book</button>
            <button type="button">My Payment Options</button>

            <h4>My Orders</h4>
            <button type="button">My Returns</button>
            <button type="button">My Cancellations</button>

            <h4>My Wishlist</h4>
          </aside>

          <section className={styles.panel}>
            <h2>Edit Your Profile</h2>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>
            </div>

            <div className={styles.passwordSection}>
              <h3>Password Changes</h3>
              <input placeholder="Current Password" type="password" />
              <input placeholder="New Password" type="password" />
              <input placeholder="Confirm New Password" type="password" />
            </div>

            <div className={styles.actions}>
              <button type="button">Cancel</button>
              <button type="button" className={styles.saveBtn}>
                Save Changes
              </button>
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
