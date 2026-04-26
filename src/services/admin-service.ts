import { http } from "@/app/api/http";

export type AdminUser = {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
};

export type AdminSeller = {
  id: number;
  userId: number;
  shopName: string;
  description: string | null;
  status: string;
  rejectReason: string | null;
  user: {
    id: number;
    email: string;
    fullName: string;
    phone: string;
    role: string;
  };
};

export type AdminStats = {
  totalUsers: number;
  totalSellers: number;
  pendingSellers: number;
  totalAdmins: number;
};

export const fetchAdminStats = async () => {
  const response = await http.get<AdminStats>("/admin/stats");
  return response.data;
};

export const fetchAdminUsers = async (role?: string) => {
  const response = await http.get<{ users: AdminUser[] }>("/admin/users", {
    params: role ? { role } : undefined,
  });
  return response.data.users;
};

export const promoteUserToAdmin = async (userId: number) => {
  const response = await http.patch<{ user: AdminUser }>(
    `/admin/users/${userId}/promote-admin`,
  );
  return response.data.user;
};

export const fetchAdminSellers = async (status?: string) => {
  const response = await http.get<{ sellers: AdminSeller[] }>(
    "/admin/sellers",
    {
      params: status ? { status } : undefined,
    },
  );
  return response.data.sellers;
};

export const approveSeller = async (sellerId: number) => {
  const response = await http.patch<{ seller: AdminSeller }>(
    `/admin/sellers/${sellerId}/approve`,
  );
  return response.data.seller;
};

export const rejectSeller = async (sellerId: number, reason?: string) => {
  const response = await http.patch<{ seller: AdminSeller }>(
    `/admin/sellers/${sellerId}/reject`,
    { reason },
  );
  return response.data.seller;
};
