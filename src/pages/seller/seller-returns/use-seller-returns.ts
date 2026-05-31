import { useEffect, useState } from "react";
import { message } from "antd";

import { returnService, type ReturnRequest } from "@/services/return-service";
import { extractApiErrorMessage } from "@/app/utils/error-message";

export const useSellerReturns = () => {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const load = async (status?: string) => {
    setLoading(true);
    try {
      const data = await returnService.getSellerReturnRequests(
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

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      await returnService.approveReturnRequest(id);
      message.success("Đã duyệt yêu cầu đổi/trả.");
      await load(statusFilter);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Thao tác thất bại."));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number, note: string) => {
    setProcessingId(id);
    try {
      await returnService.rejectReturnRequest(id, note);
      message.success("Đã từ chối yêu cầu.");
      await load(statusFilter);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Thao tác thất bại."));
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReceived = async (id: number) => {
    setProcessingId(id);
    try {
      await returnService.confirmReturnReceived(id);
      message.success("Đã xác nhận nhận lại hàng.");
      await load(statusFilter);
    } catch (err) {
      message.error(extractApiErrorMessage(err, "Thao tác thất bại."));
    } finally {
      setProcessingId(null);
    }
  };

  return {
    requests,
    loading,
    statusFilter,
    setStatusFilter,
    processingId,
    handleApprove,
    handleReject,
    handleConfirmReceived,
  };
};
