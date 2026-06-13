import { http } from "@/app/api/http";

export interface ShipperProfile {
  id: number;
  userId: number;
  status: string;
  rejectReason: string | null;
  createdAt: string;
  user: { id: number; fullName: string; email: string; phone: string };
}

export interface ShipperShipment {
  id: number;
  orderGroupId: number;
  carrier: string;
  trackingCode: string;
  status: string;
  createdAt: string;
  orderGroup: {
    id: number;
    status: string;
    order: { id: number; shippingAddress: unknown };
  };
}

export const shipperService = {
  apply: async (): Promise<{ id: number; status: string }> => {
    const res = await http.post("/shipper/apply", {});
    return res.data;
  },

  getProfile: async (): Promise<ShipperProfile> => {
    const res = await http.get<ShipperProfile>("/shipper/profile");
    return res.data;
  },

  getShipments: async (): Promise<{ shipments: ShipperShipment[] }> => {
    const res = await http.get<{ shipments: ShipperShipment[] }>("/shipper/shipments");
    return res.data;
  },

  updateShipmentStatus: async (
    shipmentId: number,
    payload: { status: string; location?: string; note?: string }
  ): Promise<{ id: number; status: string }> => {
    const res = await http.patch(`/shipper/shipments/${shipmentId}/status`, payload);
    return res.data;
  },
};
