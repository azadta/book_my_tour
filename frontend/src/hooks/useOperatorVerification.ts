import { APP_ROUTES } from "@/constants/AppRoutes";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";
import type { IOperator } from "@/interfaces/IOperator";


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
        APP_ROUTES.OPERATORS.ADMIN.VERIFICATION_RQS,
      );
      setOperators(res.data.result);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOperator = async (id: string, isVerified: boolean) => {
    try {
      const type = isVerified ? "verify" : "reject";
      setActionLoading({ id, type });
      await axiosInstance.put(APP_ROUTES.OPERATORS.ADMIN.VERIFY(id), {
        isVerified,
      });
      toast.success(
        `Operator is ${isVerified ? "verified" : "rejected"} successfully`,
      );
      getVerificationRequests();
    } catch (error) {
      handleApiError(error);
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
