import { http } from "@/app/api/http";

export type WalletSummary = {
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
};

export type WalletTransaction = {
  id: number;
  type: string;
  amount: number;
  fee: number;
  net: number;
  description: string;
  orderGroupId: number | null;
  createdAt: string;
};

export type WithdrawalRequest = {
  id: number;
  amount: number;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  status: string;
  note: string | null;
  processedAt: string | null;
  createdAt: string;
};

export type WalletDetail = {
  wallet: WalletSummary;
  transactions: WalletTransaction[];
  withdrawals: WithdrawalRequest[];
};

export type CreateWithdrawalPayload = {
  amount: number;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
};

export const fetchWalletDetail = async () => {
  const response = await http.get<WalletDetail>("/wallet");
  return response.data;
};

export const createWithdrawal = async (payload: CreateWithdrawalPayload) => {
  const response = await http.post<{ withdrawalId: number; status: string }>(
    "/wallet/withdrawals",
    payload,
  );
  return response.data;
};
