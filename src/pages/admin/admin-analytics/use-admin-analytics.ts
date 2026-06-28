import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AnalyticsBar } from "./analytics-bar-list";

import type { AppDispatch, RootState } from "@/app/app-store";
import { formatSellerCurrency } from "@/const/seller.const";
import { adminAnalyticsActions } from "@/features/admin/admin-analytics/admin-analytics.slice";
import type { AnalyticsAskHistoryItem } from "@/services/admin-service";

export const useAdminAnalytics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboard, isLoading, error, conversation, isAsking } = useSelector(
    (state: RootState) => state.adminAnalytics,
  );
  const [question, setQuestion] = useState("");

  useEffect(() => {
    dispatch(adminAnalyticsActions.dashboardRequested());
  }, [dispatch]);

  const revenueBars = useMemo<AnalyticsBar[]>(
    () =>
      (dashboard?.revenue.series ?? []).map((p) => ({
        label: p.period,
        value: p.revenue,
        display: formatSellerCurrency(p.revenue),
      })),
    [dashboard],
  );

  const topProductBars = useMemo<AnalyticsBar[]>(
    () =>
      (dashboard?.topProducts.items ?? []).map((p) => ({
        label: p.name,
        value: p.revenue,
        display: formatSellerCurrency(p.revenue),
      })),
    [dashboard],
  );

  const statusBars = useMemo<AnalyticsBar[]>(
    () =>
      (dashboard?.statusBreakdown.items ?? []).map((s) => ({
        label: s.status,
        value: s.count,
        display: String(s.count),
      })),
    [dashboard],
  );

  const userGrowthBars = useMemo<AnalyticsBar[]>(
    () =>
      (dashboard?.userGrowth.series ?? []).map((p) => ({
        label: p.period,
        value: p.newUsers,
        display: String(p.newUsers),
      })),
    [dashboard],
  );

  const ask = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isAsking) return;

      const history: AnalyticsAskHistoryItem[] = conversation
        .filter((entry) => !entry.pending && entry.answer)
        .flatMap((entry) => [
          { role: "user" as const, content: entry.question },
          { role: "assistant" as const, content: entry.answer },
        ]);

      dispatch(
        adminAnalyticsActions.askRequested({
          id: `q-${Date.now()}`,
          question: trimmed,
          history,
        }),
      );
      setQuestion("");
    },
    [dispatch, isAsking, conversation],
  );

  return {
    dashboard,
    isLoading,
    error,
    conversation,
    isAsking,
    question,
    setQuestion,
    ask,
    revenueBars,
    topProductBars,
    statusBars,
    userGrowthBars,
  };
};
