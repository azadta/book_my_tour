import { APP_ROUTES } from "@/constants/AppRoutes";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useState } from "react";
import { unFlattenObject } from "../../../backend/utils/unFlattenObject";
import { axiosInstance } from "../api/axiosInstance";

export const useOperatorRegister = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registerOperator = async (
    operatorData: Record<string, unknown>,
    onSuccess: (operatorId: string, otpExpire: number) => void,
  ) => {
    try {
      setLoading(true);
      setError("");
      const nestedOperatorData = unFlattenObject(operatorData);

      const res = await axiosInstance.post(
        APP_ROUTES.OPERATORS.OPERATOR.REGISTER,
        nestedOperatorData,
      );

      const { operatorId, otpExpire } = res.data.result;
      onSuccess(operatorId, otpExpire);
    } catch (error) {
      const errMsg = handleApiError(error, { setFieldError });
      if (errMsg) setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { registerOperator, error, loading, fieldError, setFieldError };
};
