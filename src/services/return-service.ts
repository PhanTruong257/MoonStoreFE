import { http } from "@/app/api/http";

export interface ReturnRequest {
  id: number;
  orderGroupId: number;
  type: string;
  reason: string;
  images: string[] | null;
  status: string;
  note: string | null;
  processedAt: string | null;
  createdAt: string;
  user?: { id: number; fullName: string; email: string };
  orderGroup?: {
    id: number;
    orderId: number;
    items: { id: number; productName: string; quantity: number; imageUrlAtTime: string }[];
    seller?: { id: number; shopName: string };
  };
}

export const returnService = {
  createReturnRequest: async (
    groupId: number,
    payload: { type: string; reason: string; images?: string[] }
  ): Promise<{ id: number; type: string; status: string; createdAt: string }> => {
    const res = await http.post(`/orders/groups/${groupId}/return-requests`, payload);
    return res.data;
  },

  getGroupReturnRequests: async (
    groupId: number
  ): Promise<{ returnRequests: ReturnRequest[] }> => {
    const res = await http.get<{ returnRequests: ReturnRequest[] }>(
      `/orders/groups/${groupId}/return-requests`
    );
    return res.data;
  },

  getSellerReturnRequests: async (
    status?: string
  ): Promise<{ returnRequests: ReturnRequest[] }> => {
    const params = status && status !== "ALL" ? { status } : {};
    const res = await http.get<{ returnRequests: ReturnRequest[] }>(
      "/sellers/me/return-requests",
      { params }
    );
    return res.data;
  },

  approveReturnRequest: async (
    id: number,
    note?: string
  ): Promise<{ id: number; status: string }> => {
    const res = await http.patch(`/sellers/me/return-requests/${id}/approve`, { note });
    return res.data;
  },

  rejectReturnRequest: async (
    id: number,
    note?: string
  ): Promise<{ id: number; status: string }> => {
    const res = await http.patch(`/sellers/me/return-requests/${id}/reject`, { note });
    return res.data;
  },

  confirmReturnReceived: async (id: number): Promise<{ id: number; status: string }> => {
    const res = await http.patch(`/sellers/me/return-requests/${id}/confirm-received`);
    return res.data;
  },

  getAdminReturnRequests: async (
    status?: string
  ): Promise<{ returnRequests: ReturnRequest[] }> => {
    const params = status && status !== "ALL" ? { status } : {};
    const res = await http.get<{ returnRequests: ReturnRequest[] }>(
      "/admin/return-requests",
      { params }
    );
    return res.data;
  },

  adminCompleteReturnRequest: async (
    id: number,
    note?: string
  ): Promise<{ id: number; status: string }> => {
    const res = await http.patch(`/admin/return-requests/${id}/complete`, { note });
    return res.data;
  },
};
