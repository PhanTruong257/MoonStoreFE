export const RETURN_REQUEST_TYPE = {
  RETURN: "RETURN",
  EXCHANGE: "EXCHANGE",
} as const;

export type ReturnRequestType =
  (typeof RETURN_REQUEST_TYPE)[keyof typeof RETURN_REQUEST_TYPE];

export const RETURN_REQUEST_TYPE_LABELS: Record<string, string> = {
  [RETURN_REQUEST_TYPE.RETURN]: "Hoàn hàng lấy tiền",
  [RETURN_REQUEST_TYPE.EXCHANGE]: "Đổi hàng",
};

export const RETURN_REQUEST_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ITEM_RECEIVED: "ITEM_RECEIVED",
  COMPLETED: "COMPLETED",
} as const;

export type ReturnRequestStatus =
  (typeof RETURN_REQUEST_STATUS)[keyof typeof RETURN_REQUEST_STATUS];

export const RETURN_REQUEST_STATUS_LABELS: Record<string, string> = {
  [RETURN_REQUEST_STATUS.PENDING]: "Chờ xử lý",
  [RETURN_REQUEST_STATUS.APPROVED]: "Đã duyệt",
  [RETURN_REQUEST_STATUS.REJECTED]: "Từ chối",
  [RETURN_REQUEST_STATUS.ITEM_RECEIVED]: "Đã nhận hàng về",
  [RETURN_REQUEST_STATUS.COMPLETED]: "Hoàn thành",
};

export const RETURN_REQUEST_STATUS_COLORS: Record<string, string> = {
  [RETURN_REQUEST_STATUS.PENDING]: "gold",
  [RETURN_REQUEST_STATUS.APPROVED]: "blue",
  [RETURN_REQUEST_STATUS.REJECTED]: "red",
  [RETURN_REQUEST_STATUS.ITEM_RECEIVED]: "geekblue",
  [RETURN_REQUEST_STATUS.COMPLETED]: "green",
};

export const RETURN_REQUEST_TYPE_OPTIONS = [
  { value: RETURN_REQUEST_TYPE.RETURN, label: "Hoàn hàng lấy tiền" },
  { value: RETURN_REQUEST_TYPE.EXCHANGE, label: "Đổi hàng" },
];
