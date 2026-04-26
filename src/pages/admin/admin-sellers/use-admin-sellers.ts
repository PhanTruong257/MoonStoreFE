import { useEffect, useState } from "react";
import { message } from "antd";

import {
  approveSeller,
  fetchAdminSellers,
  rejectSeller,
} from "@/services/admin-service";
import type { AdminSeller } from "@/services/admin-service";

const STATUS_OPTIONS = ["pending", "active", "rejected", "all"] as const;
export type SellerStatusFilter = (typeof STATUS_OPTIONS)[number];

export const ADMIN_SELLER_STATUS_OPTIONS: SellerStatusFilter[] = [
  ...STATUS_OPTIONS,
];

export const useAdminSellers = () => {
  const [sellers, setSellers] = useState<AdminSeller[]>([]);
  const [statusFilter, setStatusFilter] = useState<SellerStatusFilter>(
    "pending",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<number | null>(null);

  const load = async (status: SellerStatusFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminSellers(status === "all" ? undefined : status);
      setSellers(data);
    } catch {
      setError("Unable to load seller applications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load(statusFilter);
  }, [statusFilter]);

  const handleApprove = async (sellerId: number) => {
    setActingId(sellerId);
    try {
      await approveSeller(sellerId);
      void message.success("Seller approved.");
      await load(statusFilter);
    } catch {
      void message.error("Unable to approve seller.");
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (sellerId: number, reason: string) => {
    setActingId(sellerId);
    try {
      await rejectSeller(sellerId, reason);
      void message.success("Seller rejected.");
      await load(statusFilter);
    } catch {
      void message.error("Unable to reject seller.");
    } finally {
      setActingId(null);
    }
  };

  return {
    sellers,
    statusFilter,
    isLoading,
    error,
    actingId,
    setStatusFilter,
    handleApprove,
    handleReject,
    reload: () => load(statusFilter),
  };
};
