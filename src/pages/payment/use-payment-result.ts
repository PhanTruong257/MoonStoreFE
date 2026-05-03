import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  type VnpayReturnResponse,
  verifyVnpayReturn,
} from "@/services/payments-service";

export const usePaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<VnpayReturnResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const query: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      query[key] = value;
    });

    if (Object.keys(query).length === 0) {
      setError("Missing payment parameters.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const verify = async () => {
      try {
        const data = await verifyVnpayReturn(query);
        if (!isMounted) {
          return;
        }
        setResult(data);
      } catch {
        if (!isMounted) {
          return;
        }
        setError("Unable to verify payment.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void verify();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  return { isLoading, result, error };
};
