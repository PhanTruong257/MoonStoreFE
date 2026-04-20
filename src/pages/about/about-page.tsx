import styles from "./about-page.module.scss";

import { Breadcrumb } from "@/component/breadcrumb/breadcrumb";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const stats = [
  { title: "10.5k", text: "Sellers active our site" },
  { title: "33k", text: "Monthly Product Sale", featured: true },
  { title: "45.5k", text: "Customer active in our site" },
  { title: "25k", text: "Annual gross sale in our site" },
];

const team = [
  {
    name: "Tom Cruise",
    role: "Founder & Chairman",
    image: "/images/products/product-1.jpg",
  },
  {
    name: "Emma Watson",
    role: "Managing Director",
    image: "/images/products/product-2.jpg",
  },
  {
    name: "Will Smith",
    role: "Product Designer",
    image: "/images/products/product-3.jpg",
  },
];

const services = [
  {
    title: "FREE AND FAST DELIVERY",
    desc: "Free delivery for all orders over $140",
  },
  {
    title: "24/7 CUSTOMER SERVICE",
    desc: "Friendly 24/7 customer support",
  },
  {
    title: "MONEY BACK GUARANTEE",
    desc: "We return money within 30 days",
  },
];

export const AboutPage = () => {
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
          items={[{ label: "Home", to: "/" }, { label: "About" }]}
        />

        <section className={styles.storySection}>
          <article className={styles.storyText}>
            <h1>Our Story</h1>
            <p>
              Launched in 2015, Exclusive is South Asia&apos;s premier online
              shopping marketplace with an active presence in Bangladesh.
            </p>
            <p>
              Exclusive has more than 1 Million products to offer, growing at a
              very fast pace with diverse categories.
            </p>
          </article>

          <img
            className={styles.storyImage}
            src="/images/products/product-2.jpg"
            alt="Our story"
          />
        </section>

        <section className={styles.stats}>
          {stats.map((item) => (
            <article
              key={item.title}
              className={`${styles.statCard} ${item.featured ? styles.statFeatured : ""}`}
            >
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </section>

        <section className={styles.teamGrid}>
          {team.map((person) => (
            <article key={person.name} className={styles.memberCard}>
              <img src={person.image} alt={person.name} />
              <h3>{person.name}</h3>
              <p>{person.role}</p>
            </article>
          ))}
        </section>

        <section className={styles.serviceRow}>
          {services.map((service) => (
            <article key={service.title} className={styles.serviceItem}>
              <span />
              <h4>{service.title}</h4>
              <p>{service.desc}</p>
            </article>
          ))}
        </section>
      </section>

      <SiteFooter
        sections={homeFooterSections}
        copyright={`Copyright Rimel ${new Date().getFullYear()}. All right reserved`}
      />
    </main>
  );
};
