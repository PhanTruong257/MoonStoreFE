import { http } from "@/app/api/http";

export type UserAddress = {
  id: number;
  userId: number;
  addressLine: string;
  city: string;
  district: string;
  isDefault: boolean;
};

export type CreateAddressPayload = {
  addressLine: string;
  city: string;
  district: string;
  isDefault?: boolean;
};

export type UpdateAddressPayload = {
  addressLine?: string;
  city?: string;
  district?: string;
  isDefault?: boolean;
};

export const fetchMyAddresses = async () => {
  const response = await http.get<{ addresses: UserAddress[] }>(
    "/users/me/addresses",
  );
  return response.data.addresses;
};

export const createMyAddress = async (payload: CreateAddressPayload) => {
  const response = await http.post<{ address: UserAddress }>(
    "/users/me/addresses",
    payload,
  );
  return response.data.address;
};

export const updateMyAddress = async (
  id: number,
  payload: UpdateAddressPayload,
) => {
  const response = await http.patch<{ address: UserAddress }>(
    `/users/me/addresses/${id}`,
    payload,
  );
  return response.data.address;
};

export const deleteMyAddress = async (id: number) => {
  const response = await http.delete<{ id: number }>(
    `/users/me/addresses/${id}`,
  );
  return response.data;
};

export const setDefaultAddress = async (id: number) => {
  const response = await http.patch<{ address: UserAddress }>(
    `/users/me/addresses/${id}/default`,
  );
  return response.data.address;
};
