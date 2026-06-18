import type { ReactNode } from "react";

import styles from "./shipper-shell.module.scss";

import { UI_TEXT } from "@/const/ui-text";
import { SiteHeader } from "@/features/layout/components/site-header";
import { homeHeaderLinks } from "@/pages/home/mock-data";

type ShipperShellProps = {
  children: ReactNode;
};

export const ShipperShell = ({ children }: ShipperShellProps) => {
  return (
    <main className={styles.page}>
      <SiteHeader
        brand={{ label: UI_TEXT.header.brand, to: "/" }}
        navLinks={homeHeaderLinks}
        search={{ placeholder: UI_TEXT.header.searchPlaceholder }}
      />

      <section className={styles.main}>{children}</section>
    </main>
  );
};
