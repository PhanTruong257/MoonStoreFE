import { http } from "@/app/api/http";

export type VnpayReturnResponse = {
  paid: boolean;
  orderId: number | null;
  paymentId: number | null;
  message: string;
};

export type QrPaymentInfo = {
  paymentId: number;
  orderId: number;
  amount: number;
  bankBin: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  transferContent: string;
  qrUrl: string;
  paymentStatus: string;
  expiresAt: string | null;
};

export type ConfirmManualResponse = {
  paymentId: number;
  orderId: number;
  paymentStatus: string;
};

export const verifyVnpayReturn = async (
  query: Record<string, string>,
): Promise<VnpayReturnResponse> => {
  const response = await http.get<VnpayReturnResponse>(
    "/payments/vnpay/return",
    { params: query },
  );
  return response.data;
};

export const fetchOrderQrInfo = async (
  orderId: number,
): Promise<QrPaymentInfo> => {
  const response = await http.get<QrPaymentInfo>(
    `/payments/order/${orderId}/qr`,
  );
  return response.data;
};

export const confirmPaymentManual = async (
  paymentId: number,
): Promise<ConfirmManualResponse> => {
  const response = await http.post<ConfirmManualResponse>(
    `/payments/${paymentId}/confirm-manual`,
  );
  return response.data;
};
