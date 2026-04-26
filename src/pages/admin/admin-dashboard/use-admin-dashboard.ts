import { useEffect, useState } from "react";

import { fetchAdminStats } from "@/services/admin-service";
import type { AdminStats } from "@/services/admin-service";

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const result = await fetchAdminStats();
        if (!isMounted) {
          return;
        }
        setStats(result);
      } catch {
        if (!isMounted) {
          return;
        }
        setError("Unable to load admin stats.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { stats, isLoading, error };
};
