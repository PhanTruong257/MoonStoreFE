import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  fetchShopStorefront,
  type ShopStorefront,
} from "@/services/catalog-service";
import { extractApiErrorMessage } from "@/app/utils/error-message";

export const useShopPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [shop, setShop] = useState<ShopStorefront | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(sellerId);
    if (!sellerId || isNaN(id)) {
      setError("Không tìm thấy gian hàng.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchShopStorefront(id);
        if (!cancelled) {
          setShop(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(extractApiErrorMessage(err, "Không tải được thông tin gian hàng."));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [sellerId]);

  return { shop, isLoading, error };
};
