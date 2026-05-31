import { useEffect, useState } from "react";
import { message } from "antd";

import { returnService, type ReturnRequest } from "@/services/return-service";
import { extractApiErrorMessage } from "@/app/utils/error-message";

export const useAdminReturns = () => {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const load = async (status?: string) => {
    setLoading(true);
    try {
      const data = await returnService.getAdminReturnRequests(
        status && status !== "ALL" ? status : undefined
      );
      setRequests(data.returnRequests);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Không thể tải danh sách yêu cầu."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(statusFilter);
  }, [statusFilter]);

  const handleComplete = async (id: number) => {
    setProcessingId(id);
    try {
      await returnService.adminCompleteReturnRequest(id);
      message.success("Đã hoàn tất yêu cầu đổi/trả.");
      await load(statusFilter);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Thao tác thất bại."));
    } finally {
      setProcessingId(null);
    }
  };

  return {
    requests,
    statusFilter,
    setStatusFilter,
    loading,
    processingId,
    handleComplete,
  };
};
