import { useEffect, useState } from "react";
import { message } from "antd";

import { shipperService, type ShipperShipment } from "@/services/shipper-service";
import { extractApiErrorMessage } from "@/app/utils/error-message";
import { SHIPMENT_STATUS } from "@/const/shipper.const";

export const useShipperShipments = () => {
  const [shipments, setShipments] = useState<ShipperShipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await shipperService.getShipments();
      setShipments(data.shipments);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Không thể tải danh sách đơn giao."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const nextStatus: Record<string, string> = {
    [SHIPMENT_STATUS.ASSIGNED]: SHIPMENT_STATUS.PICKED_UP,
    [SHIPMENT_STATUS.PICKED_UP]: SHIPMENT_STATUS.IN_TRANSIT,
    [SHIPMENT_STATUS.IN_TRANSIT]: SHIPMENT_STATUS.DELIVERED,
  };

  const handleAdvance = async (shipment: ShipperShipment) => {
    const next = nextStatus[shipment.status];
    if (!next) return;

    setUpdatingId(shipment.id);
    try {
      await shipperService.updateShipmentStatus(shipment.id, { status: next });
      message.success("Cập nhật trạng thái thành công.");
      await load();
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Cập nhật thất bại."));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFailed = async (shipment: ShipperShipment) => {
    setUpdatingId(shipment.id);
    try {
      await shipperService.updateShipmentStatus(shipment.id, {
        status: SHIPMENT_STATUS.FAILED,
      });
      message.success("Đã đánh dấu giao thất bại.");
      await load();
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Cập nhật thất bại."));
    } finally {
      setUpdatingId(null);
    }
  };

  return { shipments, loading, updatingId, nextStatus, handleAdvance, handleFailed };
};
