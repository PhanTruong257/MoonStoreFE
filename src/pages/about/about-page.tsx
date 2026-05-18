import styles from "./about-page.module.scss";

import { Breadcrumb } from "@/component/breadcrumb/breadcrumb";
import { UI_TEXT } from "@/const/ui-text";
import { SiteFooter } from "@/features/layout/components/site-footer";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeFooterSections, homeHeaderLinks } from "@/pages/home/mock-data";

const ta = UI_TEXT.about;
const th = UI_TEXT.header;

const teamImages = [
  "/images/products/product-1.jpg",
  "/images/products/product-2.jpg",
  "/images/products/product-3.jpg",
];

export const AboutPage = () => {
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
          items={[{ label: UI_TEXT.common.home, to: "/" }, { label: ta.breadcrumbAbout }]}
        />

        <section className={styles.storySection}>
          <article className={styles.storyText}>
            <h1>{ta.story.title}</h1>
            <p>{ta.story.para1}</p>
            <p>{ta.story.para2}</p>
          </article>

          <img
            className={styles.storyImage}
            src="/images/products/product-2.jpg"
            alt={ta.story.title}
          />
        </section>

        <section className={styles.stats}>
          {ta.stats.map((item) => (
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
          {ta.team.map((person, index) => (
            <article key={person.name} className={styles.memberCard}>
              <img src={teamImages[index]} alt={person.name} />
              <h3>{person.name}</h3>
              <p>{person.role}</p>
            </article>
          ))}
        </section>

        <section className={styles.serviceRow}>
          {ta.services.map((service) => (
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
        copyright={UI_TEXT.common.copyright(new Date().getFullYear())}
      />
    </main>
  );
};
