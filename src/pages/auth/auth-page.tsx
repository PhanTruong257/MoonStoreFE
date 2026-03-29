import { useLocation } from "react-router-dom";

import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { Login } from "@/features/auth/login/login";
import { Register } from "@/features/auth/register/register";

import styles from "./auth-page.module.scss";

const authHeaderLinks = [
  { label: "Home", to: "/login" },
  { label: "Contact", to: "/register" },
  { label: "About", to: "/register" },
  { label: "Sign Up", to: "/register" },
];

const authFooterSections = [
  {
    title: "Exclusive",
    items: [{ label: "Subscribe" }, { label: "Get 10% off your first order" }],
  },
  {
    title: "Support",
    items: [
      { label: "111 Bijoy Sarani, Dhaka, BD" },
      { label: "exclusive@gmail.com" },
      { label: "+88015-88888-9999" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "My Account" },
      { label: "Login / Register", to: "/login" },
      { label: "Cart" },
      { label: "Wishlist" },
    ],
  },
  {
    title: "Quick Link",
    items: [
      { label: "Privacy Policy" },
      { label: "Terms Of Use" },
      { label: "FAQ" },
      { label: "Contact" },
    ],
  },
];

export const AuthPage = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: "Exclusive", to: "/login" }}
        navLinks={authHeaderLinks}
        promo={{
          message:
            "Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!",
          linkLabel: "ShopNow",
          to: "/register",
        }}
        search={{ placeholder: "What are you looking for?" }}
      />

      <section className={styles.content}>
        <article className={styles.hero}>
          <div className={styles.heroInner} />
        </article>

        <article className={styles.formWrap}>
          {isLoginPage ? <Login /> : <Register />}
        </article>
      </section>

      <SiteFooter
        sections={authFooterSections}
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
