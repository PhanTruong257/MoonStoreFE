import styles from "./admin-analytics-page.module.scss";

import type { AnalyticsAskResult } from "@/services/admin-service";

const HIDDEN_KEYS = new Set(["chartType", "unit"]);

const formatCell = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString("vi-VN");
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "true" : "false";
  return JSON.stringify(value);
};

const DataTable = ({ rows }: { rows: Record<string, unknown>[] }) => {
  if (!rows.length) return null;
  const columns = Object.keys(rows[0]);
  return (
    <table className={styles.dataTable}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {columns.map((c) => (
              <td key={c}>{formatCell(row[c])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ResultBlock = ({ result }: { result: Record<string, unknown> }) => {
  if (typeof result.error === "string") {
    return <p className={styles.dataNote}>{result.error}</p>;
  }

  if (Array.isArray(result.series)) {
    return <DataTable rows={result.series as Record<string, unknown>[]} />;
  }
  if (Array.isArray(result.items)) {
    return <DataTable rows={result.items as Record<string, unknown>[]} />;
  }

  // KPI: hiển thị các cặp key/value còn lại.
  const entries = Object.entries(result).filter(([k]) => !HIDDEN_KEYS.has(k));
  if (!entries.length) return null;
  return (
    <div className={styles.kpiInline}>
      {entries.map(([key, value]) => (
        <span key={key} className={styles.kpiChip}>
          <span className={styles.kpiChipKey}>{key}</span>
          <strong>{formatCell(value)}</strong>
        </span>
      ))}
    </div>
  );
};

export const AnalyticsAskData = ({ data }: { data: AnalyticsAskResult[] }) => {
  if (!data.length) return null;
  return (
    <div className={styles.askData}>
      {data.map((item, idx) => (
        <ResultBlock key={`${item.tool}-${idx}`} result={item.result} />
      ))}
    </div>
  );
};
