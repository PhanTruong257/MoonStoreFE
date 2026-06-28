import styles from "./admin-analytics-page.module.scss";

export type AnalyticsBar = {
  label: string;
  value: number;
  display: string;
};

export const AnalyticsBarList = ({ bars }: { bars: AnalyticsBar[] }) => {
  if (!bars.length) return null;
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className={styles.barList}>
      {bars.map((bar) => {
        const pct = Math.round((bar.value / max) * 100);
        return (
          <div key={bar.label} className={styles.barRow}>
            <span className={styles.barLabel} title={bar.label}>
              {bar.label}
            </span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${Math.max(pct, bar.value > 0 ? 3 : 0)}%` }}
              />
            </div>
            <span className={styles.barValue}>{bar.display}</span>
          </div>
        );
      })}
    </div>
  );
};
