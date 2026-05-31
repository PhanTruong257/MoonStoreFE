export const SHIPPER_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  REJECTED: "rejected",
  DISABLED: "disabled",
} as const;

export type ShipperStatus =
  (typeof SHIPPER_STATUS)[keyof typeof SHIPPER_STATUS];

export const SHIPPER_STATUS_LABELS: Record<string, string> = {
  [SHIPPER_STATUS.PENDING]: "Chờ duyệt",
  [SHIPPER_STATUS.ACTIVE]: "Hoạt động",
  [SHIPPER_STATUS.REJECTED]: "Từ chối",
  [SHIPPER_STATUS.DISABLED]: "Bị vô hiệu",
};

export const SHIPPER_STATUS_COLORS: Record<string, string> = {
  [SHIPPER_STATUS.PENDING]: "gold",
  [SHIPPER_STATUS.ACTIVE]: "green",
  [SHIPPER_STATUS.REJECTED]: "red",
  [SHIPPER_STATUS.DISABLED]: "default",
};

export const SHIPPER_STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: SHIPPER_STATUS.PENDING, label: "Chờ duyệt" },
  { value: SHIPPER_STATUS.ACTIVE, label: "Hoạt động" },
  { value: SHIPPER_STATUS.REJECTED, label: "Từ chối" },
  { value: SHIPPER_STATUS.DISABLED, label: "Bị vô hiệu" },
];

export const SHIPMENT_STATUS = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  PICKED_UP: "PICKED_UP",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  FAILED: "FAILED",
} as const;

export const SHIPMENT_STATUS_LABELS: Record<string, string> = {
  [SHIPMENT_STATUS.PENDING]: "Chờ shipper",
  [SHIPMENT_STATUS.ASSIGNED]: "Đã phân công",
  [SHIPMENT_STATUS.PICKED_UP]: "Đã lấy hàng",
  [SHIPMENT_STATUS.IN_TRANSIT]: "Đang giao",
  [SHIPMENT_STATUS.DELIVERED]: "Giao thành công",
  [SHIPMENT_STATUS.FAILED]: "Giao thất bại",
};

export const SHIPMENT_STATUS_COLORS: Record<string, string> = {
  [SHIPMENT_STATUS.PENDING]: "default",
  [SHIPMENT_STATUS.ASSIGNED]: "blue",
  [SHIPMENT_STATUS.PICKED_UP]: "geekblue",
  [SHIPMENT_STATUS.IN_TRANSIT]: "processing",
  [SHIPMENT_STATUS.DELIVERED]: "green",
  [SHIPMENT_STATUS.FAILED]: "red",
};

export const VEHICLE_TYPE_OPTIONS = [
  { value: "motorcycle", label: "Xe máy" },
  { value: "bicycle", label: "Xe đạp" },
  { value: "car", label: "Ô tô" },
  { value: "truck", label: "Xe tải" },
];
