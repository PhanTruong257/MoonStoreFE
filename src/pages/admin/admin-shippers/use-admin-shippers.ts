import { useEffect, useState } from "react";
import { message } from "antd";

import { http } from "@/app/api/http";
import { extractApiErrorMessage } from "@/app/utils/error-message";
import { SHIPPER_STATUS } from "@/const/shipper.const";

export interface AdminShipperItem {
  id: number;
  userId: number;
  status: string;
  rejectReason: string | null;
  createdAt: string;
  user: { id: number; fullName: string; email: string; phone: string };
}

export const useAdminShippers = () => {
  const [shippers, setShippers] = useState<AdminShipperItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<number | null>(null);

  const load = async (status?: string) => {
    setLoading(true);
    try {
      const params = status && status !== "ALL" ? { status } : {};
      const res = await http.get<{ shippers: AdminShipperItem[] }>("/admin/shippers", { params });
      setShippers(res.data.shippers);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Không thể tải danh sách shipper."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(statusFilter);
  }, [statusFilter]);

  const handleApprove = async (id: number) => {
    setActingId(id);
    try {
      await http.patch(`/admin/shippers/${id}/approve`);
      message.success("Đã duyệt shipper.");
      await load(statusFilter);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Thao tác thất bại."));
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id: number, reason: string) => {
    setActingId(id);
    try {
      await http.patch(`/admin/shippers/${id}/reject`, { reason });
      message.success("Đã từ chối shipper.");
      await load(statusFilter);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Thao tác thất bại."));
    } finally {
      setActingId(null);
    }
  };

  const handleDisable = async (id: number) => {
    setActingId(id);
    try {
      await http.patch(`/admin/shippers/${id}/disable`);
      message.success("Đã vô hiệu hoá shipper.");
      await load(statusFilter);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Thao tác thất bại."));
    } finally {
      setActingId(null);
    }
  };

  const handleEnable = async (id: number) => {
    setActingId(id);
    try {
      await http.patch(`/admin/shippers/${id}/enable`);
      message.success("Đã kích hoạt shipper.");
      await load(statusFilter);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Thao tác thất bại."));
    } finally {
      setActingId(null);
    }
  };

  return {
    shippers,
    statusFilter,
    setStatusFilter,
    loading,
    actingId,
    handleApprove,
    handleReject,
    handleDisable,
    handleEnable,
  };
};

export const ADMIN_SHIPPER_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: SHIPPER_STATUS.PENDING, label: "Chờ duyệt" },
  { value: SHIPPER_STATUS.ACTIVE, label: "Hoạt động" },
  { value: SHIPPER_STATUS.REJECTED, label: "Từ chối" },
  { value: SHIPPER_STATUS.DISABLED, label: "Vô hiệu" },
];
