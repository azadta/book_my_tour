import { useCallback, useState } from "react";
import type { IOperator } from "../redux/operator/operatorSlice";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";

export const useOperatorVerification = () => {
  const [operators, setOperators] = useState<IOperator[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<{
    id: string | null;
    type: "verify" | "reject" | null;
  }>({ id: null, type: null });

  const getVerificationRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/admin/operators/get-verification-requests`,
      );
      setOperators(res.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch verification requests",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOperator = async (id: string, isVerified: boolean) => {
    try {
      const type = isVerified ? "verify" : "reject";
      setActionLoading({ id, type });
      await axiosInstance.put(`/admin/operators/verify-operator/${id}`, {
        isVerified,
      });
      toast.success(
        `Operator is ${isVerified ? "verified" : "rejected"} successfully`,
      );
      getVerificationRequests();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update verification status",
      );
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  return {
    operators,
    getVerificationRequests,
    verifyOperator,
    loading,
    actionLoading,
  };
};
