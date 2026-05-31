import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

import { shipperService } from "@/services/shipper-service";
import { extractApiErrorMessage } from "@/app/utils/error-message";

export const useShipperApply = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async (values: { vehicleType: string }) => {
    setSubmitting(true);
    try {
      await shipperService.apply(values.vehicleType);
      message.success("Đăng ký shipper thành công! Vui lòng chờ admin xét duyệt.");
      navigate("/shipper/pending");
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Đăng ký thất bại."));
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, handleApply };
};
