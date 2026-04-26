import { http } from "@/app/api/http";

export type VoucherSummary = {
  id: number;
  code: string;
  discountType: string;
  value: number;
  maxDiscount: number | null;
  expiredAt: string;
};

export type VoucherValidateResponse = {
  isValid: boolean;
  reason: string | null;
  voucher: VoucherSummary | null;
  discountAmount: number;
};

export type ValidateVoucherPayload = {
  code: string;
  subtotal: number;
};

export const validateVoucher = async (payload: ValidateVoucherPayload) => {
  const response = await http.post<VoucherValidateResponse>(
    "/vouchers/validate",
    payload,
  );
  return response.data;
};
