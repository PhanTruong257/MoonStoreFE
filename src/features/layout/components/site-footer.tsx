import { Link } from "react-router-dom";

import styles from "@/features/layout/components/site-footer.module.scss";

type FooterItem = {
  label: string;
  to?: string;
};

type FooterSection = {
  title: string;
  items: FooterItem[];
};

type SiteFooterProps = {
  sections: FooterSection[];
  copyright: string;
};

export const SiteFooter = ({ sections, copyright }: SiteFooterProps) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {sections.map((section) => (
          <section key={section.title}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
            <div className={styles.sectionItems}>
              {section.items.map((item) =>
                item.to ? (
                  <Link
                    key={`${item.label}-${item.to}`}
                    to={item.to}
                    className={styles.item}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <p key={item.label} className={styles.item}>
                    {item.label}
                  </p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
      <div className={styles.copy}>{copyright}</div>
    </footer>
  );
};
