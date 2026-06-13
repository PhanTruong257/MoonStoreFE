import { useEffect, useState } from "react";
import { message } from "antd";

import { http } from "@/app/api/http";
import { extractApiErrorMessage } from "@/app/utils/error-message";

export interface AdminShipmentItem {
  id: number;
  trackingCode: string;
  status: string;
  carrier: string;
  createdAt: string;
  orderGroup: {
    id: number;
    orderId: number;
    status: string;
    seller: { id: number; shopName: string };
    items: { id: number; productName: string; quantity: number }[];
  };
  shipper: {
    id: number;
    user: { id: number; fullName: string; phone: string };
  } | null;
  logs: { id: number; status: string; location: string; timestamp: string }[];
}

export interface ActiveShipperOption {
  id: number;
  user: { id: number; fullName: string; phone: string };
}

export const SHIPMENT_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "ASSIGNED", label: "Đã phân công" },
  { value: "PICKED_UP", label: "Đã lấy hàng" },
  { value: "IN_TRANSIT", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "FAILED", label: "Thất bại" },
];

export const SHIPMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xử lý",
  ASSIGNED: "Đã phân công",
  PICKED_UP: "Đã lấy hàng",
  IN_TRANSIT: "Đang giao",
  DELIVERED: "Đã giao",
  FAILED: "Thất bại",
};

export const SHIPMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "default",
  ASSIGNED: "blue",
  PICKED_UP: "cyan",
  IN_TRANSIT: "orange",
  DELIVERED: "green",
  FAILED: "red",
};

export const useAdminShipments = () => {
  const [shipments, setShipments] = useState<AdminShipmentItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [assignTarget, setAssignTarget] = useState<number | null>(null);
  const [activeShippers, setActiveShippers] = useState<ActiveShipperOption[]>([]);
  const [selectedShipperId, setSelectedShipperId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);

  const load = async (status?: string) => {
    setLoading(true);
    try {
      const params = status && status !== "ALL" ? { status } : {};
      const res = await http.get<{ shipments: AdminShipmentItem[] }>("/admin/shipments", { params });
      setShipments(res.data.shipments);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Không thể tải danh sách giao hàng."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(statusFilter);
  }, [statusFilter]);

  const openAssignModal = async (shipmentId: number) => {
    setAssignTarget(shipmentId);
    setSelectedShipperId(null);
    try {
      const res = await http.get<{ shippers: ActiveShipperOption[] }>("/admin/shippers/active");
      setActiveShippers(res.data.shippers);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Không thể tải danh sách shipper."));
      setAssignTarget(null);
    }
  };

  const handleAssign = async () => {
    if (assignTarget === null || selectedShipperId === null) return;
    setAssigning(true);
    try {
      await http.patch(`/admin/shipments/${assignTarget}/assign`, { shipperId: selectedShipperId });
      message.success("Đã phân công shipper.");
      setAssignTarget(null);
      await load(statusFilter);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Phân công thất bại."));
    } finally {
      setAssigning(false);
    }
  };

  return {
    shipments,
    statusFilter,
    setStatusFilter,
    loading,
    assignTarget,
    setAssignTarget,
    activeShippers,
    selectedShipperId,
    setSelectedShipperId,
    assigning,
    openAssignModal,
    handleAssign,
  };
};
