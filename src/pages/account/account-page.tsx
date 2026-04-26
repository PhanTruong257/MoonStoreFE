import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./account-page.module.scss";

import { SharedButton } from "@/component/shared-button/shared-button";
import { SharedInput } from "@/component/shared-input/shared-input";
import {
  ACCOUNT_MENU,
  ACCOUNT_TEXT,
  PROFILE_FIELDS,
} from "@/const/account.const";
import { getAuthErrorMessage } from "@/features/auth/auth-errors";
import { getStoredUser, setStoredUser } from "@/features/auth/auth-storage";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";
import { fetchProfile, updateProfile } from "@/services/auth-service";
import { createSellerProfile } from "@/services/seller-service";

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

const joinName = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`.trim();
};

export const AccountPage = () => {
  const storedUser = getStoredUser();
  const initialName = splitName(storedUser?.fullName ?? "");

  const [firstName, setFirstName] = useState(initialName.firstName);
  const [lastName, setLastName] = useState(initialName.lastName);
  const [email, setEmail] = useState(storedUser?.email ?? "");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sellerShopName, setSellerShopName] = useState("");
  const [sellerDescription, setSellerDescription] = useState("");
  const [sellerMessage, setSellerMessage] = useState("");
  const [initialProfile, setInitialProfile] = useState({
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    email: storedUser?.email ?? "",
    address: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const profile = await fetchProfile();
        if (!isMounted) {
          return;
        }
        const parsedName = splitName(profile.user.fullName ?? "");
        setFirstName(parsedName.firstName);
        setLastName(parsedName.lastName);
        setEmail(profile.user.email ?? "");
        setAddress(profile.address ?? "");
        setInitialProfile({
          firstName: parsedName.firstName,
          lastName: parsedName.lastName,
          email: profile.user.email ?? "",
          address: profile.address ?? "",
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setError(getAuthErrorMessage(error, "Unable to load profile."));
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetForm = () => {
    setFirstName(initialProfile.firstName);
    setLastName(initialProfile.lastName);
    setEmail(initialProfile.email);
    setAddress(initialProfile.address);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccessMessage("");
  };

  const submitProfile = async () => {
    if (!firstName.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }

    if (currentPassword || newPassword || confirmPassword) {
      setError("Password change is not supported yet.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const response = await updateProfile({
        fullName: joinName(firstName, lastName),
        email,
        address,
      });
      setStoredUser(response.user);
      setInitialProfile({
        firstName,
        lastName,
        email,
        address,
      });
      setSuccessMessage("Profile updated.");
    } catch (error) {
      setError(getAuthErrorMessage(error, "Unable to save profile."));
    } finally {
      setIsSaving(false);
    }
  };

  const registerSeller = async () => {
    if (!storedUser) {
      return;
    }

    if (!sellerShopName.trim()) {
      setSellerMessage("Please enter a shop name.");
      return;
    }

    setSellerMessage("");
    try {
      await createSellerProfile({
        userId: storedUser.id,
        shopName: sellerShopName,
        description: sellerDescription,
      });
      setStoredUser({ ...storedUser, role: "seller" });
      setSellerMessage("Seller profile activated.");
    } catch {
      setSellerMessage("Unable to activate seller profile.");
    }
  };

  const welcomeName = storedUser?.fullName ?? ACCOUNT_TEXT.welcomeName;

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
            {ACCOUNT_TEXT.breadcrumbPrefix}{" "}
            <strong>{ACCOUNT_TEXT.breadcrumbCurrent}</strong>
          </div>
          <div className={styles.welcome}>
            {ACCOUNT_TEXT.welcomePrefix} <span>{welcomeName}</span>
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
            <div className={styles.sellerCard}>
              <div>
                <h3>Seller hub</h3>
                <p>
                  {storedUser?.role === "seller"
                    ? "Manage your product catalog and launch new items."
                    : "Activate seller mode to publish products."}
                </p>
              </div>
              {storedUser?.role === "seller" ? (
                <Link className={styles.sellerLink} to="/seller">
                  Open seller hub
                </Link>
              ) : (
                <div className={styles.sellerForm}>
                  <SharedInput
                    placeholder="Shop name"
                    value={sellerShopName}
                    onChange={(event) => setSellerShopName(event.target.value)}
                  />
                  <SharedInput
                    placeholder="Shop description"
                    value={sellerDescription}
                    onChange={(event) =>
                      setSellerDescription(event.target.value)
                    }
                  />
                  <SharedButton
                    label="Activate seller"
                    onClick={registerSeller}
                  />
                  {sellerMessage ? (
                    <p className={styles.sellerMessage}>{sellerMessage}</p>
                  ) : null}
                </div>
              )}
            </div>

            <h2>{ACCOUNT_TEXT.profileTitle}</h2>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="firstName">
                  {PROFILE_FIELDS.firstNameLabel}
                </label>
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
              <SharedButton
                label={ACCOUNT_TEXT.cancelLabel}
                onClick={() => {
                  resetForm();
                }}
              />
              <SharedButton
                label={ACCOUNT_TEXT.saveLabel}
                variant="primary"
                className={styles.saveBtn}
                disabled={isSaving}
                onClick={() => {
                  void submitProfile();
                }}
              />
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}
            {successMessage ? (
              <p className={styles.success}>{successMessage}</p>
            ) : null}
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
